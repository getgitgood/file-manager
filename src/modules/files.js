import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";

export async function files({ cmd, args }) {
  const { currentDir } = await getState();

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
          const fileName = args.join(" ");
          const filePath = path.join(currentDir, fileName);

          await writeFile(filePath, "", { flag: "w" });

          messageUser(`File ${fileName} created successfully.`, "success");

          res();
        } catch {
          rej("Operation failed");
        }
      }

      case 'mkdir': {

      }
    }
  });
}
