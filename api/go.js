export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { index } = req.body;
    const token = process.env.GITHUB_TOKEN;
    const API_URL = "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
    const RAW_URL = "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

    const headers = {
      Authorization: `token ${token}`,
      "User-Agent": "vercel-function",
      "Content-Type": "application/json"
    };

    // 1️⃣ SHA al
    const shaRes = await fetch(API_URL, { headers });
    const shaJson = await shaRes.json();

    // 2️⃣ JSON al
    const rawRes = await fetch(RAW_URL);
    const json = await rawRes.json();

    // 3️⃣ Gönder: go = 1
    json.buttons[index].go = 1;

    await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `GO ${index}`,
        content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
        sha: shaJson.sha,
        branch: "main"
      })
    });

    // 🟢 hemen reset: go = 0
    json.buttons[index].go = 0;

    await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `RESET ${index}`,
        content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
        sha: shaJson.sha,  // refresh SHA same or re-fetch ok
        branch: "main"
      })
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
