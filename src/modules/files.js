import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream } from "fs";
import { writeFile, mkdir, rename } from "fs/promises";

export async function files({ cmd, args }) {
  const { currentDir } = await getState();

  const filename = args.join(" ");
  const filePath = path.join(currentDir, filename);

  return new Promise(async (res, rej) => {
    switch (cmd) {
      case "cat": {
        messageUser("\n");
        const filePath = path.resolve(currentDir, args[0]);

        const readStream = createReadStream(filePath, { encoding: "utf-8" });

        readStream.on("data", (chunk) => console.log(chunk));
        readStream.on("end", () => {
          messageUser("\n");
          res();
        });

        readStream.on("error", () => rej("Operation failed"));
      }

      case "add": {
        try {
          await writeFile(filePath, "", { flag: "wx" });

          messageUser(`File "${filename}" created successfully.`, "success");

          res();
        } catch {
          rej("File already exists");
        }
      }

      case "mkdir": {
        try {
          await mkdir(filePath);

          messageUser(
            `Directory "${filename}" created successfully.`,
            "success"
          );

          res();
        } catch {
          rej("Directory already exists");
        }
      }

      case "rn": {
        try {
          if (args.length <= 1) {
            rej("Specify filename in order to rename file");

            return;
          }

          const filename = args[args.length - 1];
          const initFilePath = args.slice(0, -1).join(" ");

          const dirPath = path.resolve(currentDir, initFilePath);
          const newPath = path.parse(initFilePath);
          newPath.name = filename;
          newPath.base = filename;

          await rename(dirPath, path.resolve(currentDir, path.format(newPath)));

          messageUser(
            `File renamed to "${filename}".`,
            "success"
          );

          res();
        } catch (e) {
          rej(e)
        }
      }
    }
  });
}
