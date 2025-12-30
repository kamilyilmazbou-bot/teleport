const fetch = require("node-fetch");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const index = body.index;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const API_URL = "https://api.github.com/repos/kamilyilmazbou-bot/teleport/contents/commands.json";
  const RAW_URL = "https://raw.githubusercontent.com/kamilyilmazbou-bot/teleport/main/commands.json";

  // mevcut json'u al
  const fileRes = await fetch(API_URL, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const fileData = await fileRes.json();

  const jsonRes = await fetch(RAW_URL);
  const json = await jsonRes.json();

  json.buttons[index].value = "4444";

  const payload = {
    message: "button trigger",
    content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
    sha: fileData.sha
  };

  await fetch(API_URL, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
