export default async function handler(req, res) {
  try {
    const { index } = req.body;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const API_URL =
      "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
    const RAW_URL =
      "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

    // 1️⃣ SHA al
    const fileRes = await fetch(API_URL, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "vercel"
      }
    });
    const fileData = await fileRes.json();

    // 2️⃣ JSON al
    const jsonRes = await fetch(RAW_URL);
    const json = await jsonRes.json();

    // 3️⃣ GO = 1
    json.buttons[index].go = 1;

    // 4️⃣ Geri yaz
    const payload = {
      message: `TP ${index + 1}`,
      content: Buffer.from(
        JSON.stringify(json, null, 2)
      ).toString("base64"),
      sha: fileData.sha,
      branch: "main"
    };

    await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "vercel"
      },
      body: JSON.stringify(payload)
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
