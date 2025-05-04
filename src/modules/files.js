import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream } from "fs";

export async function files({ cmd, args }) {
  const { currentDir } = await getState();

  return new Promise((res, rej) => {
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
    }
  });
}
