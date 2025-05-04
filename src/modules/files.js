import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream, createWriteStream } from "fs";
import { writeFile, mkdir, rename, lstat, unlink, rm } from "fs/promises";
import { pipeline } from "stream/promises";

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

        break;
      }

      case "add": {
        try {
          await writeFile(filePath, "", { flag: "wx" });

          messageUser(`File "${filename}" created successfully.`, "success");

          res();

          break;
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

          break;
        } catch {
          rej("Directory already exists");
        }
      }

      case "rn": {
        if (args.length <= 1) {
          rej("Specify filename in order to rename file");

          return;
        }

        try {
          const filename = args[args.length - 1];
          const initFilePath = args.slice(0, -1).join(" ");

          const dirPath = path.resolve(currentDir, initFilePath);
          const newPath = path.parse(initFilePath);
          newPath.name = filename;
          newPath.base = filename;

          await rename(dirPath, path.resolve(currentDir, path.format(newPath)));

          messageUser(`File renamed to "${filename}".`, "success");

          res();

          break;
        } catch (e) {
          rej(e);
        }
      }
      case "cp":
      case "mv": {
        if (args.length <= 1) {
          rej(
            `Specify filename in order to ${
              cmd === "cp" ? "copy" : "move"
            } file`
          );

          return;
        }

        const isMvOperation = cmd === "mv";
        const copyFrom = args.slice(0, -1).join(" ");
        const copyTo = args[args.length - 1];

        const dirPath = path.resolve(currentDir, copyFrom);
        const newPath = path.resolve(currentDir, copyTo);

        const { root, base, dir } = path.parse(dirPath);
        const baselessPath = path.resolve(root, base, dir);

        if (baselessPath === newPath) {
          rej(
            `Base and ${isMvOperation ? "move" : "copy"} paths are identical.`
          );

          return;
        }

        try {
          const dir = await lstat(newPath);

          if (!dir.isDirectory()) {
            rej("Expect destination to be a directory, got file instead.");

            return;
          }

          const { base } = path.parse(dirPath);

          const readStream = createReadStream(dirPath);
          const writeStream = createWriteStream(path.join(newPath, base));

          await pipeline(readStream, writeStream);

          if (isMvOperation) await unlink(dirPath);

          messageUser(
            `File ${isMvOperation ? "moved" : "copied"} to "${newPath}".`,
            "success"
          );

          res();

          break;
        } catch (e) {
          rej(e);
        }
      }
      case "rm": {
        try {
          const rmPath = path.resolve(currentDir, args.join(" "));

          await rm(rmPath, { recursive: true });

          messageUser(`File at path "${rmPath}" was removed.`, "success");

          res();

          break;
        } catch (e) {
          rej(e);
        }
      }
    }
  });
}
