import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream } from "fs";
import { writeFile, mkdir } from "fs/promises";

export async function files({ cmd, args }) {
  const { currentDir } = await getState();

  const fileName = args.join(" ");
  const filePath = path.join(currentDir, fileName);

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

          messageUser(`File "${fileName}" created successfully.`, "success");

          res();
        } catch {
          rej("Operation failed, file already exists");
        }
      }

      case "mkdir": {
        try {
          await mkdir(filePath);

          messageUser(
            `Directory "${fileName}" created successfully.`,
            "success"
          );

          res();
        } catch {
          rej("Operation failed, directory already exists");
        }
      }
    }
  });
}
