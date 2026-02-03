export default async function handler(req, res) {
  const { index, town } = req.body; // town parametresi eklendi
  const token = process.env.GITHUB_TOKEN;

  const API_URL =
    "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
  const RAW_URL =
    "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

  const headers = {
    Authorization: `token ${token}`,
    "User-Agent": "vercel-function",
    "Content-Type": "application/json"
  };

  // SHA
  const shaRes = await fetch(API_URL, { headers });
  const shaJson = await shaRes.json();

  // JSON
  const raw = await fetch(RAW_URL);
  const json = await raw.json();

  // 🔹 Buton trigger veya Town At trigger 🔹
  if (typeof index !== "undefined") {
    // Mevcut TP butonları
    json.buttons[index].trigger = Date.now();
  } else if (town) {
    // Town At için
    json.town = json.town || {};
    json.town.trigger = Date.now();
  }

  // PUT request ile GitHub güncelle
  await fetch(API_URL, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: town ? `TRIGGER TOWN` : `TRIGGER ${index}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
      sha: shaJson.sha,
      branch: "main"
    })
  });

  res.json({ ok: true });
}
