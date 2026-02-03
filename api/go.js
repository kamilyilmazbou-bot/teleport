export default async function handler(req, res) {
  const { index, town } = req.body;
  const token = process.env.GITHUB_TOKEN;

  const API_URL =
    "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";

  const headers = {
    Authorization: `token ${token}`,
    "User-Agent": "vercel-function",
    "Content-Type": "application/json"
  };

  // SHA
  const shaRes = await fetch(API_URL, { headers });
  const shaJson = await shaRes.json();

  // JSON
  const raw = await fetch(
    "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json"
  );
  const json = await raw.json();

  if (town) {
    // Town At tetikle
    json.town.trigger = Date.now();

    await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `TRIGGER TOWN`,
        content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
        sha: shaJson.sha,
        branch: "main"
      })
    });

    res.json({ ok: true });
    return;
  }

  // Normal button trigger
  json.buttons[index].trigger = Date.now();

  await fetch(API_URL, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `TRIGGER ${index}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
      sha: shaJson.sha,
      branch: "main"
    })
  });

  res.json({ ok: true });
}
