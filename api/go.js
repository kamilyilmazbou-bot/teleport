let lastFire = {}; // 🔥 in-memory debounce

export default async function handler(req, res) {
  const { index } = req.body;
  const token = process.env.GITHUB_TOKEN;

  const now = Date.now();

  // 🔒 AYNI BUTON 1 SN İÇİNDE TEKRAR GELİRSE YOK SAY
  if (lastFire[index] && now - lastFire[index] < 1000) {
    return res.json({ ok: true, ignored: true });
  }
  lastFire[index] = now;

  const API_URL =
    "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
  const RAW_URL =
    "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

  const headers = {
    Authorization: `token ${token}`,
    "User-Agent": "vercel-function",
    "Content-Type": "application/json"
  };

  // SHA al
  const shaRes = await fetch(API_URL, { headers });
  const shaJson = await shaRes.json();

  // JSON al
  const raw = await fetch(RAW_URL);
  const json = await raw.json();

  // 🔥 SADECE MAGE
  json.buttons[index].trigger = now;
  json.last_action = "mage";

  await fetch(API_URL, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `TRIGGER MAGE ${index}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
      sha: shaJson.sha,
      branch: "main"
    })
  });

  res.json({ ok: true });
}
