const Logger = require("./logger");
const chalk = require("chalk");
class Mail {
  constructor(req) {
    this.req = req;
  }

  async lick(user) {
    let Verified = false;
    try {
      const messagesResponse = await this.req.getRequest(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=1secmail.com`,
      );
      if (messagesResponse.status === 200) {
        const messages = messagesResponse._body;

        await Promise.all(
          messages.map(async (message) => {
            if (message.subject === "Your updated email address") {
              const messageResponse = await this.req.getRequest(
                `https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=1secmail.com&id=${message.id}`,
              );
              const confirmationLinkMatches =
                messageResponse._body.textBody.match(
                  /https:\/\/auth\.opera\.com\/account\/email-verification\?key=[^\s]+/,
                );

              if (
                confirmationLinkMatches &&
                confirmationLinkMatches.length > 0
              ) {
                const getRes = await this.req.getRequest(
                  confirmationLinkMatches[0],
                );
                if ([200, 204, 201].includes(getRes.status)) {
                  await this.req.postRequest(
                    "https://auth.opera.com/account/email-verification/confirm",
                    {
                      email: `${user}@1secmail.com`,
                    },
                  );
                  Verified = true;
                  return Logger.Sprint(
                    `[MAIL-${user}@1secmail.com]`,
                    `Verified `,
                    chalk.green,
                  );
                }
              }
            } else {
              console.error("Verification link not found", chalk.red);
            }
          }),
        );
      }
    } catch (error) {
      console.error(
        Logger.Sprint(
          `[MAIL-${this.user}@1secmail.com]`,
          `Error: ${error}`,
          chalk.red,
        ),
      );
    }
    return Verified;
  }
}
module.exports = Mail;
