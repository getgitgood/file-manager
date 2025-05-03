import { styleText } from "node:util";
import {
  capitalize,
  showCurrentDir,
  parseCliCmd,
  messageUser,
} from "./utils/index.js";
import { dispatch } from "./modules/dispatch.js";

(async function main() {
  process.username = capitalize(process.env.npm_config_username);

  if (!process.username) {
    messageUser(
      `Specify user name in args to start using FileManager! ${styleText(
        "grey",
        "(e.g. npm run start -- --username=goa)"
      )}`
    );

    return;
  }

  messageUser(
    styleText("bgWhite", `Welcome to the File Manager, ${process.username}!`)
  );
  const userNoticeMsg = styleText(
    "italic",
    "To proceed enter command in a CLI and wait for execution results.\n"
  );

  messageUser(`${userNoticeMsg}${showCurrentDir()}`);

  process.stdin.on("data", (data) => {
    const { cmd, ...params } = parseCliCmd(data);

    if (cmd === ".exit") {
      process.emit("SIGINT");

      return;
    }

    dispatch({ cmd, ...params });
    // on end

    if (data.toString()) messageUser(`${userNoticeMsg}${showCurrentDir()}`);
  });

  process.on("SIGINT", () => {
    messageUser(
      styleText(
        "bgBlackBright",
        `Thank you for using File Manager, ${process.username}, goodbye!`
      )
    );

    process.exit();
  });
})();
