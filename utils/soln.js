const config = require("./config"),
  Logger = require("../script/logger");

class Solver {
  constructor(req) {
    this.req = req;
  }

  async CapSolver(url, key) {
    const payload = {
      clientKey: config["capsolverKey"],
      task: {
        type: "ReCaptchaV2TaskProxyLess",
        websiteURL: url,
        websiteKey: key,
        isInvisible: true,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0",
      },
    };
    let resp = await this.req.postRequest(
      "https://api.capsolver.com/createTask",
      payload,
    );
    if (resp.status === 200) {
      this.taskId = resp._body.taskId;
    } else
      throw new Error(
        Logger.Sprint(
          "[CAPTCHA]",
          `Failed to create captcha task.!`,
          chalk.red,
        ),
      );

    while (true) {
      resp = await this.req.postRequest(
        "https://api.capsolver.com/getTaskResult",
        {
          clientKey: config["capsolverKey"],
          taskId: this.taskId,
        },
      );
      if (JSON.stringify(resp._body).includes("ready")) {
        return resp._body.solution.gRecaptchaResponse;
      } else if (JSON.stringify(resp._body).includes("processing")) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      } else
        throw new Error(
          Logger.Sprint("[CAPTCHA]", `Failed to solve captcha!`, chalk.red),
        );
    }
  }
}

module.exports = Solver;
