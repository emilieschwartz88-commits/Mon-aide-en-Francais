// Fonction serveur : lit la photo d'un exercice et en recopie le texte.
// La photo n'est pas enregistrée par l'application : elle est envoyée à l'IA puis oubliée.
const MODELE = process.env.ANTHROPIC_MODEL_VISION || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const compteur = new Map();
function limite(ip) {
  const now = Date.now();
  const liste = (compteur.get(ip) || []).filter((t) => now - t < 600000);
  liste.push(now);
  compteur.set(ip, liste);
  return liste.length > 20;
}

const CONSIGNE =
  "Tu lis la photo d'un exercice ou d'une leçon de français de collège. " +
  "Recopie fidèlement tout le texte imprimé ou écrit (consigne et textes support), sans le corriger ni le résoudre. " +
  "Écris [illisible] pour ce qui ne se lit pas. " +
  "Ne recopie jamais de noms, prénoms ou informations personnelles : remplace-les par [nom]. " +
  "Si l'image n'est pas un document scolaire de français, réponds uniquement : [Cette image ne semble pas être un exercice de français.] " +
  "Réponds uniquement par le texte recopié, sans commentaire.";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ erreur: "Méthode non autorisée." });
  const b = req.body || {};

  if (process.env.CODE_CLASSE && b.code !== process.env.CODE_CLASSE)
    return res.status(401).json({ erreur: "Code de classe incorrect." });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "inconnu";
  if (limite(ip)) return res.status(429).json({ erreur: "Trop de photos. Fais une pause de quelques minutes." });

  const img = b.image;
  if (typeof img !== "string" || img.length < 100 || img.length > 3500000 || !/^[A-Za-z0-9+/=]+$/.test(img))
    return res.status(400).json({ erreur: "Image invalide ou trop lourde. Reprends la photo." });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELE,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: img } },
              { type: "text", text: CONSIGNE },
            ],
          },
        ],
      }),
    });
    if (!r.ok) throw new Error("Erreur API " + r.status);
    const d = await r.json();
    const texte = (d.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
    if (!texte) throw new Error("vide");
    return res.status(200).json({ texte });
  } catch (e) {
    return res.status(500).json({ erreur: "La lecture de la photo a échoué. Reprends la photo ou tape l’exercice." });
  }
};
