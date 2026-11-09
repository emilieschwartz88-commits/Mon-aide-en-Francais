// Fonction serveur : la clé d'API reste ici et n'est jamais envoyée au navigateur.
const PROMPT = require("./prompt");

const MODELE = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const NIVEAUX = ["4ème", "3ème"];
const FORMAT =
  "\n\n# FORMAT\nRéponds en texte simple, sans Markdown (pas de titres, pas de gras, pas de tableaux).";

// Limite simple par adresse IP : 30 demandes toutes les 10 minutes
const compteur = new Map();
function limite(ip) {
  const now = Date.now();
  const liste = (compteur.get(ip) || []).filter((t) => now - t < 600000);
  liste.push(now);
  compteur.set(ip, liste);
  return liste.length > 30;
}

async function appel(system, messages, maxTokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODELE, max_tokens: maxTokens || 600, system, messages }),
  });
  if (!r.ok) throw new Error("Erreur API " + r.status);
  const d = await r.json();
  return (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

// Contrôle automatique : la réponse du tuteur donne-t-elle la solution ?
async function donneLaSolution(exercice, reponseTuteur) {
  const system =
    "Tu es un contrôleur pédagogique. On te montre un exercice d'élève et un message du tuteur. " +
    "Réponds uniquement OUI ou NON : le message du tuteur donne-t-il la réponse à l'exercice, même partiellement " +
    "(résultat, mot à relever, forme à écrire, phrase rédigée à la place de l'élève) ? " +
    "Féliciter l'élève pour une réponse qu'il a lui-même écrite, reformuler la consigne, rappeler une règle " +
    "ou traiter un exemple sur une AUTRE phrase n'est PAS donner la solution.";
  const contenu = "EXERCICE :\n" + exercice + "\n\nMESSAGE DU TUTEUR :\n" + reponseTuteur;
  const verdict = await appel(system, [{ role: "user", content: contenu }], 5);
  return /^\s*OUI/i.test(verdict);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ erreur: "Méthode non autorisée." });
  const b = req.body || {};

  if (process.env.CODE_CLASSE && b.code !== process.env.CODE_CLASSE)
    return res.status(401).json({ erreur: "Code de classe incorrect." });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "inconnu";
  if (limite(ip)) return res.status(429).json({ erreur: "Trop de demandes. Fais une pause de quelques minutes." });

  const niveau = NIVEAUX.includes(b.niveau) ? b.niveau : "4ème";
  let msgs = (Array.isArray(b.messages) ? b.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (msgs.length > 12) msgs = [msgs[0]].concat(msgs.slice(-10));
  if (!msgs.length || msgs[0].role !== "user" || msgs[msgs.length - 1].role !== "user")
    return res.status(400).json({ erreur: "Demande invalide." });

  const system = PROMPT + "\n\n# NIVEAU DE L'ÉLÈVE\n" + niveau + FORMAT;

  try {
    let texte = await appel(system, msgs);
    if (process.env.CONTROLE !== "off" && (await donneLaSolution(msgs[0].content, texte))) {
      texte = await appel(
        system +
          "\n\nATTENTION : ta réponse précédente donnait trop d'éléments de solution. Recommence en restant strictement dans le palier demandé, sans aucun élément de réponse.",
        msgs
      );
      if (await donneLaSolution(msgs[0].content, texte))
        texte =
          "Je préfère ne pas t’en dire plus pour l’instant. Relis la consigne, essaie d’écrire une première réponse, puis je t’aiderai à la vérifier.";
    }
    return res.status(200).json({ texte });
  } catch (e) {
    return res.status(500).json({ erreur: "Le service est indisponible pour le moment. Réessaie dans un instant." });
  }
};
