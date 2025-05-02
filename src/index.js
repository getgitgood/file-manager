import { styleText } from "node:util";
import { capitalize } from "./utils/index.js";

function main() {
  process.username = capitalize(process.env.npm_config_username);

  if (!process.username) {
    console.warn(
      `Specify user name in args to start using FileManager! ${styleText(
        "grey",
        "e.g. npm run start -- --username=goa"
      )}`
    );

    return;
  }

  console.log(`Welcome to the File Manager, ${process.username}!`);

}

main();
