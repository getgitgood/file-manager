import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createHash } from "crypto";
import { createReadStream } from "fs";

export async function hash({ args }) {
  return new Promise(async (res, rej) => {
    try {
      const { currentDir } = await getState();

      const filePath = path.resolve(currentDir, args.join(" "));

      const hashFn = createHash("sha256");

      const readStream = createReadStream(filePath);

      readStream.on("data", (chunk) => {
        hashFn.update(chunk);
      });

      readStream.on("error", (e) => {
        rej(e);
      });

      readStream.on("end", () => {
        messageUser(
          `Hash for file ${filePath} is "${hashFn.digest("hex")}"`,
          "success"
        );

        res();
      });
    } catch (e) {
      rej(e);
    }
  });
}
