import { styleText } from "node:util";
import {
  capitalize,
  setCurrentDir,
  parseCliCmd,
  messageUser,
  getState,
} from "./utils/index.js";
import { dispatch } from "./modules/dispatch.js";

(async function main() {
  const state = await getState();

  state.username = capitalize(process.env.npm_config_username);

  if (!state.username) {
    messageUser(
      `Specify user name in args to start using FileManager! ${styleText(
        "grey",
        "(e.g. npm run start -- --username=goa)"
      )}`
    );

    return;
  }

  messageUser(
    styleText("bgWhite", `Welcome to the File Manager, ${state.username}!`) +
      "\n"
  );

  const userNoticeMsg = styleText(
    "yellow",
    "To proceed enter command in a CLI and wait for execution results."
  );

  messageUser(userNoticeMsg);
  setCurrentDir(state);

  process.stdin.on("data", async (data) => {
    const { cmd, ...params } = parseCliCmd(data, state);

    if (cmd === ".exit") {
      process.emit("SIGINT");

      return;
    }

    await dispatch({ cmd, ...params });
    // on end

    messageUser(userNoticeMsg);
    setCurrentDir(state, {}, true);
  });

  process.on("SIGINT", () => {
    messageUser(
      styleText(
        "bgBlackBright",
        `Thank you for using File Manager, ${state.username}, goodbye!`
      )
    );
    console.log(state);

    process.exit();
  });
})();
