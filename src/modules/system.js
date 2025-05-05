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
      }

      case "--cpus": {
        const cpusArr = cpus().map((cpu) => ({
          Model: cpu.model,
          Speed: cpu.speed,
        }));
        console.table(cpusArr);
        messageUser(
          `                    ${cpusArr.length} CPUS detected in total.                   `,
          "success "
        );

        res();
      }

      case "--homedir":
      case "--username": {
        const { homedir, username } = userInfo();

        messageUser(
          flag === "--homedir"
            ? `Home directory is ${homedir}`
            : `Current OS username is ${username}`,
          "success"
        );

        res();
      }

      case "--architecture": {
        messageUser(`CPU architecture is ${arch()}`, "success");

        res();
      }

      default: {
        rej(`Invalid input.${arg ? `Do you mean --${arg}?` : ""}`);
      }
    }
  });
}
