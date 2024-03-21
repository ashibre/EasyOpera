const functions = require("./utils/functions"),
  readline = require("readline"),
  Opera = require("./script/opera"),
  Request = require("./script/request");

class EasyOpera extends Opera {
  constructor() {
    super("EasyPassword-discord.gg/RfNZ9wGSmb");
    this.req = new Request();
  }

  async start() {
    console.clear();
    process.stdout.write(`\x1b]0;FLVM - discord.gg/RfNZ9wGSmb | EasyOpera\x07`);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const number = await new Promise((resolve) => {
      rl.question(
        `
          ▄████████    ▄████████    ▄████████ ▄██   ▄                
          ███    ███   ███    ███   ███    ███ ███   ██▄              
          ███    █▀    ███    ███   ███    █▀  ███▄▄▄███              
         ▄███▄▄▄       ███    ███   ███        ▀▀▀▀▀▀███              
        ▀▀███▀▀▀     ▀███████████ ▀███████████ ▄██   ███              
          ███    █▄    ███    ███          ███ ███   ███              
          ███    ███   ███    ███    ▄█    ███ ███   ███              
          ██████████   ███    █▀   ▄████████▀   ▀█████▀               
                                                                      
         ▄██████▄     ▄███████▄    ▄████████    ▄████████    ▄████████
        ███    ███   ███    ███   ███    ███   ███    ███   ███    ███
        ███    ███   ███    ███   ███    █▀    ███    ███   ███    ███
        ███    ███   ███    ███  ▄███▄▄▄      ▄███▄▄▄▄██▀   ███    ███
        ███    ███ ▀█████████▀  ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   ▀███████████
        ███    ███   ███          ███    █▄  ▀███████████   ███    ███
        ███    ███   ███          ███    ███   ███    ███   ███    ███
         ▀██████▀   ▄████▀        ██████████   ███    ███   ███    █▀ 
                                               ███    ███             
                                               discord.gg/RfNZ9wGSmb}\nHow many links do you want to generate ?: `,
        (answer) => {
          resolve(parseInt(answer));
          rl.close();
        },
      );
    });
    for (let i = 0; i < number; i++) {
      console.log(i);
      let user = `flem${functions.randomUUID(8)}`;
      let email = `${user}@1secmail.com`;
      await this.regAndAuth(user, email);
    }
  }
}

new EasyOpera().start();
