const chalk = require("chalk"),
  readline = require("readline");

class Logger {
  static Sprint(tag, content, color) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ts = `${hours}:${minutes}:${seconds}`;
    return console.log(`${chalk.bold(ts)} ${color(tag)} ${content}`);
  }
  static Ask(tag, content, color) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ts = `${hours}:${minutes}:${seconds}`;

    const input = readline
      .createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      .question(`${chalk.bold(ts)} ${color}${tag} ${content}`);
    return input;
  }
}

module.exports = Logger;
