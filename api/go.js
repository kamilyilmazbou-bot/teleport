export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { index } = req.body;
    const token = process.env.GITHUB_TOKEN;

    const API_URL =
      "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
    const RAW_URL =
      "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

    const headers = {
      Authorization: `token ${token}`,
      "User-Agent": "vercel-function"
    };

    // 1️⃣ SHA al
    const shaRes = await fetch(API_URL, { headers });
    const shaJson = await shaRes.json();

    // 2️⃣ JSON al
    const rawRes = await fetch(RAW_URL);
    const json = await rawRes.json();

    // 3️⃣ GO = 1
    json.buttons[index].go = 1;

    await fetch(API_URL, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `GO ${index + 1}`,
        content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
        sha: shaJson.sha,
        branch: "main"
      })
    });

    // 4️⃣ 4 SANİYE SONRA OTOMATİK RESET
    setTimeout(async () => {
      try {
        const shaRes2 = await fetch(API_URL, { headers });
        const shaJson2 = await shaRes2.json();

        const rawRes2 = await fetch(RAW_URL);
        const json2 = await rawRes2.json();

        json2.buttons[index].go = 0;

        await fetch(API_URL, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `RESET ${index + 1}`,
            content: Buffer.from(JSON.stringify(json2, null, 2)).toString("base64"),
            sha: shaJson2.sha,
            branch: "main"
          })
        });
      } catch (e) {
        console.error("Auto reset failed", e);
      }
    }, 4000);

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
