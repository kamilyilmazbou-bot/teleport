export default async function handler(req, res) {
  const { index, town } = req.body;
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

  // SHA al
  const shaRes = await fetch(API_URL, { headers });
  const shaJson = await shaRes.json();

  // JSON al
  const raw = await fetch(RAW_URL);
  const json = await raw.json();

  // 🔥 TOWN AT
  if (town) {
    json.town.trigger = Date.now();
    json.last_action = "town";

    await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "TRIGGER TOWN",
        content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
        sha: shaJson.sha,
        branch: "main"
      })
    });

    res.json({ ok: true });
    return;
  }

  // 🔥 MAGE TP (1–8)
  json.buttons[index].trigger = Date.now();
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
