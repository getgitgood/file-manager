import path from "path";
import { getState, messageUser, setCurrentDir } from "../utils/index.js";
import { readdir } from "fs";

export async function navigate({ cmd, args, flags }) {
  const state = await getState();

  return new Promise((res, rej) => {
    switch (cmd) {
      case "up": {
        const pathObj = path.parse(path.resolve(state.currentDir, "../"));

        setCurrentDir(state, pathObj);
        res();

        break;
      }

      case "cd": {
        const dirPath = path.resolve(state.currentDir, ...args);

        readdir(dirPath, { withFileTypes: true }, (err, files) => {
          if (err) {
            messageUser(`No directory found by path ${dirPath}`, true);

            rej();
          }

          if (files?.length) {
            const pathObj = path.parse(dirPath);
            setCurrentDir(state, pathObj);
          } else {
            setCurrentDir(state, {}, true);
          }

          res();
        });

        break;
      }

      case "ls": {
        readdir(state.currentDir, { withFileTypes: true }, (err, files) => {
          if (err) {
            messageUser(`No directory found by path ${dirPath}`, true);

            rej();
          }

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
