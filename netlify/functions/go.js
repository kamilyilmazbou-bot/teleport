
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const index = body.index;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const API_URL =
      "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
    const RAW_URL =
      "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

    // 1️⃣ GitHub'dan SHA al
    const fileRes = await fetch(API_URL, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "netlify-function"
      }
    });
    const fileData = await fileRes.json();

    // 2️⃣ JSON içeriğini al
    const jsonRes = await fetch(RAW_URL);
    const json = await jsonRes.json();

    // 3️⃣ GO TETİKLE ✅
    json.buttons[index].go = 1;

    // 4️⃣ GitHub'a geri yaz
    const payload = {
      message: `TP ${index + 1} trigger`,
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
        "User-Agent": "netlify-function"
      },
      body: JSON.stringify(payload)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
