const superagent = require("superagent");
const Logger = require("./logger");
const chalk = require("chalk");
class Request {
  constructor() {
    this.session = new superagent.agent();
    this.session.set(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0",
    );
  }
  async execRequest(method, url, data) {
    try {
      const response = await this.session[method.toLowerCase()](url).send(data);
      return response;
    } catch (error) {
      console.error(Logger.Sprint("[ERROR]", error, chalk.red));
    }
  }
  async postRequest(url, data) {
    return await this.execRequest("POST", url, data);
  }

  async getRequest(url) {
    return await this.execRequest("GET", url);
  }
  async putRequest(url, data) {
    return await this.execRequest("PUT", url, data);
  }
}
module.exports = Request;
