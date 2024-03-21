const axios = require("axios"),
  { readFileSync } = require("fs");

async function generateAuth(cookie) {
  try {
    const url = "https://api.gx.me/profile/token";
    const headers = {
      Accept: "application/json",
      authority: "api.gx.me",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      Cookie: cookie,
      Origin: "https://www.opera.com",
      Referer: "https://www.opera.com/",
      "Sec-Ch-Ua":
        '"Not A(Brand";v="99", "Opera GX";v="107", "Chromium";v="121"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0",
    };
    const res = await axios.get(url, { headers });
    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error(
        `Failed to generate authorization: HTTP status ${res.status}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to generate authorization: ${error}`);
  }
}
function randomUUID(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0"); // "dd"
  const month = String(today.getMonth() + 1).padStart(2, "0"); // "mm"
  const year = today.getFullYear(); // "yyyy"
  return `${day}:${month}:${year}`;
}

function countLines() {
  try {
    const data = readFileSync("codes.txt", "utf8");
    const lines = data.split("\n");
    return lines.length;
  } catch (error) {
    throw new Error(`Failed to count lines: ${error.message}`);
  }
}

async function waitAndRetry(seconds) {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("Retrying...");
      resolve();
    }, seconds * 1000);
  });
}

module.exports = {
  generateAuth,
  randomUUID,
  getCurrentDate,
  countLines,
  waitAndRetry,
};
