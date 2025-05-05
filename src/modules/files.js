import path from "path";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream, createWriteStream, fstat } from "fs";
import { writeFile, mkdir, rename, lstat, unlink, rm } from "fs/promises";
import { pipeline } from "stream/promises";

export async function files({ cmd, args }) {
  const { currentDir } = await getState();

  const filename = args.join(" ");
  const filePath = path.resolve(currentDir, filename);

  return new Promise(async (res, rej) => {
    try {
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

          readStream.on("error", (e) => rej(e));

          break;
        }

        case "add": {
          await writeFile(filePath, "", { flag: "wx" });
          messageUser(`File "${filename}" created successfully.`, "success");

          res();

          break;
        }

        case "mkdir": {
          await mkdir(filePath);

          messageUser(
            `Directory "${filename}" created successfully.`,
            "success"
          );

          res();

          break;
        }

        case "rn": {
          if (args.length <= 1) {
            rej("Operation failed. Specify filename in order to rename file");

            return;
          }

          const filename = args[args.length - 1];
          const initFilePath = args.slice(0, -1).join(" ");

          const dirPath = path.resolve(currentDir, initFilePath);
          const newPath = path.parse(initFilePath);
          newPath.name = filename;
          newPath.base = filename;

          const stat = await lstat(
            path.resolve(currentDir, path.format(newPath))
          );

          if (stat.isFile() || stat.isDirectory()) {
            rej("Operation failed. File with a same name already exist in directory");

            break;
          }
          await rename(dirPath, path.resolve(currentDir, path.format(newPath)));

          messageUser(`File renamed to "${filename}".`, "success");

          res();

          break;
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
              `Operation failed. Base and ${isMvOperation ? "move" : "copy"} paths are identical.`
            );

            return;
          }

          const stat = await lstat(newPath);

          if (!stat.isDirectory()) {
            rej("Operation failed. Expect destination to be a directory, got file instead.");

            return;
          }

          const readStream = createReadStream(dirPath);
          const writeStream = createWriteStream(path.join(newPath, base));

          await pipeline(readStream, writeStream);

          if (isMvOperation) await unlink(dirPath);

          messageUser(
            `File was ${isMvOperation ? "moved" : "copied"} to "${newPath}".`,
            "success"
          );

          res();

          break;
        }
        case "rm": {
          const rmPath = path.resolve(currentDir, args.join(" "));

          await rm(rmPath, { recursive: true });

          messageUser(`"${path.parse(rmPath).base}" was removed.`, "success");

          res();

          break;
        }
      }
    } catch (e) {
      rej(e);
    }
  });
}
