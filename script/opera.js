const Request = require("./request"),
  functions = require("../utils/functions"),
  fs = require("fs"),
  chalk = require("chalk"),
  mail = require("./secmail"),
  Logger = require("./logger"),
  solver = require("../utils/soln"),
  { promisify } = require("util"),
  writeFileAsync = promisify(fs.writeFile);

class Opera {
  constructor(password) {
    this.auth_data = null;
    this.user;
    this.email;
    this.password = password;
    this.req = new Request();
    this.secmail = new mail(this.req);
  }

  async regAndAuth(user, email) {
    this.user = user;
    this.email = email;
    await this.req.getRequest("https://auth.opera.com/account/authenticate", {
      allow_redirects: true,
    });

    const start = Date.now();
    const soln = await new solver(this.req).CapSolver(
      "https://auth.opera.com",
      "6LdYcFgaAAAAAEH3UnuL-_eZOsZc-32lGOyrqfA4",
    );
    if (!soln) return false;

    this.req.session.set("x-language-locale", "en");
    this.req.session.set("origin", "https://www.opera.com/");
    this.req.session.set(
      "referer",
      "https://auth.opera.com/account/authenticate/signup",
    );
    Logger.Sprint(
      `[CAPTCHA-${this.email}]`,
      `Captcha Solved in ${(Date.now() - start) / 1000}s `,
      chalk.blue,
    );

    const signUp = await this.req.postRequest(
      "https://auth.opera.com/account/v4/api/signup",
      {
        email: this.email,
        password: this.password,
        password_repeated: this.password,
        marketing_consent: false,
        captcha: soln,
        services: ["gmx"],
      },
      {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    );
    Logger.Sprint(
      `[MAIL-${this.email}`,
      `Password: ${this.password}`,
      chalk.green,
    );
    if (!signUp || [429].includes(signUp.status)) {
      Logger.Sprint(`[ERROR-${this.email}`, `Rate limit On Signup!`, chalk.red);
      return false;
    }
    if (![200, 201, 204].includes(signUp.status)) {
      Logger.Sprint(
        `[ERROR-${this.email}]`,
        `SignUp Error : ${signUp.statusText}`,
        chalk.red,
      );
      return false;
    }
    this.req.session.set("x-csrftoken", signUp.headers["x-opera-csrf-token"]);

    const mailRequest = await this.req.postRequest(
      "https://auth.opera.com/account/request-email-verification",
      {
        email: this.email,
      },
    );
    if ([200, 201, 204].includes(mailRequest.status)) {
      Logger.Sprint(
        `[MAIL-${this.email}]`,
        `Verification Request`,
        chalk.yellow,
      );
    } else {
      Logger.Sprint(
        `[MAIL-${this.email}]`,
        `Failed to send email verification request`,
        chalk.red,
      );
    }
    const profile = await this.req.execRequest(
      "PATCH",
      "https://auth.opera.com/api/v1/profile",
      {
        username: this.user,
      },
    );
    if (![200, 201, 204].includes(profile.status)) {
      Logger.Sprint(
        `[PROFILE-${this.email}]`,
        `Profile Set Username Error: ${profile.data}`,
        chalk.red,
      );
      return false;
    }

    this.req.session.set({
      ...this.req.session.set,
      authority: "api.gx.me",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      referer: "https://gx.me/signup/?utm_source=gxdiscord",
      "sec-ch-ua":
        '"Not A(Brand";v="99", "Opera GX";v="107", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-site",
      "upgrade-insecure-requests": "1",
    });
    await this.req.getRequest(
      "https://api.gx.me/session/login?site=gxme&target=%2F",
      { allow_redirects: true },
    );
    await this.req.getRequest(
      "https://auth.opera.com/account/login-redirect?service=gmx",
      { allow_redirects: true },
    );
    let res = await this.secmail.lick(this.user);
    while (!res) {
      console.log(`Waiting for email verification: ${this.email}`),
        await new Promise((resolve) => setTimeout(resolve, 1000));
      res = await this.secmail.lick();
    }

    await this.req.execRequest("PATCH", "https://api.gx.me/profile", {
      birthdate: "2000-12-25",
    });
    Logger.Sprint(`[BIRTHDATE-${this.email}`, `Update`, chalk.green);
    await this.req.putRequest(
      "https://api.gx.me/profile/signup/steps/AVATAR/skip",
    );

    const final = await this.req.getRequest("https://api.gx.me/profile/token");
    if (final.status === 200) {
      Logger.Sprint(
        `[FETCH-${this.email}`,
        `Cookie on ${this.email}`,
        chalk.green,
      );
      this.req.session.set({
        Authorization: final._body.data,
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
      });
      const send = await this.req.postRequest(
        "https://discord.opr.gg/v2/direct-fulfillment",
      );
      let key_ = JSON.parse(send.text);
      try {
        await writeFileAsync(
          "flem.txt",
          `${this.email}:${this.password} | https://discord.com/billing/partner-promotions/1180231712274387115/${key_.token}\n`,
          { flag: "a" },
        );
        Logger.Sprint(`[SAVED-${this.email}`, `GG`, chalk.blue);
      } catch (error) {
        console.error(`[Failed to write file ${this.email}] : `, error);
      }
    }
  }
}
module.exports = Opera;
