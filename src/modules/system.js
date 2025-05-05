import { messageUser } from "../utils/index.js";
import { EOL, cpus, arch, userInfo } from "os";

export function system({ args, flags }) {
  const flag = flags[0]?.toLowerCase();
  const arg = args[0]?.toLowerCase();

  return new Promise((res, rej) => {
    switch (flag) {
      case "--eol": {
        messageUser(`Operating system EOL - ${JSON.stringify(EOL)}`, "success");

        res();

        break;
      }

      case "--cpus": {
        const cpusArr = cpus().map((cpu) => ({
          Model: cpu.model,
          Speed: cpu.speed,
        }));
        console.table(cpusArr);
        messageUser(
          `                    ${cpusArr.length} CPUS detected in total.                   `,
          "success"
        );

        res();

        break;
      }

      case "--homedir":
      case "--username": {
        const { homedir, username } = userInfo();

        messageUser(
          flag === "--homedir"
            ? `Home directory is ${homedir}`
            : `Current session username  is ${username}`,
          "success"
        );

        res();

        break;
      }

      case "--architecture": {
        messageUser(`CPU architecture is ${arch()}`, "success");

        res();

        break;
      }

      default: {
        rej(`Invalid input. ${arg ? `Do you mean --${arg}?` : ""}`);

        break;
      }
    }
  });
}
