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
  randomUUID,
};
