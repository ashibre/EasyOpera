const functions = require("../utils/functions");
const { promisify } = require("util");
const fs = require("fs");
const writeFileAsync = promisify(fs.writeFile);
const axios = require("axios");
class Program {
  constructor() {
    this.shouldTerminate = false;
  }

  async run() {
    try {
      while (!this.shouldTerminate) {
        await this.makeRequest();
        await functions.waitAndRetry(40);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async makeRequest() {
    try {
      const response = await this.fetchUrl();
      console.log(response);
      if (response.data.token) {
        await this.writeToFile(response.data.token);
        console.log(
          `https://discord.com/billing/partner-promotions/1180231712274387115/${response.data.token}`,
        );
        console.log(`Link generate check ${config.output}`);
      } else if (response.status === 429) {
        await functions.waitAndRetry(40);
      }
    } catch (error) {
      console.error("Failed to make request:", error);
    }
  }

  async fetchUrl() {
    try {
      const token = await functions.generateAuth(
        "SESSION_TYPE=user; SESSION=MDQwNDY5OWMtMTFkNS00Y2QxLWE2YzYtMzY2ZTE2ZGVlOGIx",
      );
      console.log(token);
      const options = {
        method: "POST",
        url: "https://discord.opr.gg/v2/direct-fulfillment",
        headers: {
          authority: "discord.opr.gg",
          accept: "*",
          "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json",
          origin: "https://www.opera.com",
          referer: "https://www.opera.com/",
          "sec-ch-ua": `"Not A(Brand";v="99", "Opera GX";v="107", "Chromium";v="121"`,
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent": `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0`,
          Authorization: token,
        },
      };

      const response = await axios.request(options);
      console.log(response);
      return response;
    } catch (error) {
      return error.response || error;
    }
  }

  async writeToFile(token) {
    try {
      await writeFileAsync(
        "xx.txt",
        `https://discord.com/billing/partner-promotions/1180231712274387115/${token}\n`,
        { flag: "a" },
      );
    } catch (error) {
      console.error("Failed to write to file:", error);
    }
  }

  terminate() {
    this.shouldTerminate = true;
  }
}

new Program().run();
