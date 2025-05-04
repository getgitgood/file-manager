import path from "path";
import { getState, messageUser, setCurrentDir } from "../utils/index.js";
import { readdir } from "fs";

export async function navigate({ cmd, args }) {
  const state = await getState();
  const rejPrompt = `No directory found by path`;

  return new Promise((res, rej) => {
    switch (cmd) {
      case "up": {
        const pathObj = path.parse(path.resolve(state.currentDir, "../"));

        setCurrentDir(state, pathObj);
        res();

        break;
      }

      case "cd": {
        const dirPath = path.resolve(state.currentDir, args.join(" "));

        readdir(dirPath, { withFileTypes: true }, (err) => {
          if (err) rej(`${rejPrompt} ${dirPath}`);

          const pathObj = path.parse(dirPath);
          setCurrentDir(state, pathObj);

          res();
        });

        break;
      }

      case "ls": {
        readdir(state.currentDir, { withFileTypes: true }, (err, files) => {
          if (err) rej(`${rejPrompt} ${dirPath}`);

          const tableData = files.map((value) => ({
            Name: value.name,
            Type: value.isFile() ? "file" : "directory",
          }));

          console.table(tableData);

          res();
        });

        break;
      }
    }
  });
}

/*
TODO: remove in final version
from node docs:

pathObject <Object> Any JavaScript object having the following properties:
dir <string>
root <string>
base <string>
name <string>
ext <string>
*/
