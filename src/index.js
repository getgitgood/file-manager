import { styleText } from "node:util";
import { capitalize, showCurrentDir, parseCliCmd } from "./utils/index.js";

(async function main() {
  process.username = capitalize(process.env.npm_config_username);

  if (!process.username) {
    console.warn(
      `Specify user name in args to start using FileManager! ${styleText(
        "grey",
        "(e.g. npm run start -- --username=goa)"
      )}`
    );

    return;
  }

  console.log(`Welcome to the File Manager, ${process.username}!\n`);
  const userNoticeMsg =
    "To proceed enter command in cli and wait for execution results.\n";

  console.log(userNoticeMsg);
  console.log(showCurrentDir());

  process.stdin.on("data", (data) => {
    console.log(parseCliCmd(data.toString()));

    // on end
    process.stdout.write(`${userNoticeMsg}${showCurrentDir()}\n`);
  });

  // process.stdin.pipe(process.stdout);
  // await pipeline(process.stdin, process.stdout);
})();
