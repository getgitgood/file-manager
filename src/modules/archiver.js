import path from "path";
import { createBrotliCompress, constants, createBrotliDecompress } from "zlib";
import { getState, messageUser } from "../utils/index.js";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";

export async function archiver({ cmd, args }) {
  return new Promise(async (res, rej) => {
    const state = await getState();

    if (args.length <= 1) {
      rej("Specify destinations (from, to)");

      return;
    }
    try {
      switch (cmd) {
        case "compress":
          const [from, to] = args;

          const pathFrom = path.resolve(state.currentDir, from);
          const { base, ext } = path.parse(pathFrom);
          const pathTo = path.resolve(
            state.currentDir,
            path.join(to, base.replace(ext, ".br"))
          );

          const compressStream = createBrotliCompress();
          const readStream = createReadStream(pathFrom);
          const writeStream = createWriteStream(pathTo);

          state.compressedFilesLog.push({
            id: state.compressedFilesLog.length,
            filename: base.replace(ext, ""),
            ext,
          });

          await pipeline(readStream, compressStream, writeStream);

          messageUser(`File ${base} successfully compressed`, "success");

          res();

          break;

        case "decompress": {
          const [from, to] = args;

          const pathFrom = path.resolve(state.currentDir, from);
          const { base, ext } = path.parse(pathFrom);
          const previouslyCompressed = state.compressedFilesLog.find(
            ({ filename }) => filename === base.replace(ext, "")
          );
          const pathTo = path.resolve(
            state.currentDir,
            path.join(to, base.replace(".br", previouslyCompressed?.ext || ""))
          );

          const decompressStream = createBrotliDecompress({
            params: {
              [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
            },
          });
          const readStream = createReadStream(pathFrom);
          const writeStream = createWriteStream(pathTo);

          await pipeline(readStream, decompressStream, writeStream);

          if (previouslyCompressed) {
            const copyArr = [...state.compressedFilesLog];

            state.compressedFilesLog = copyArr.filter(
              ({ filename }) => filename !== base.replace(ext, "")
            );
          }

          messageUser(`File ${base} successfully decompressed`, "success");
          res();
        }
        default:
          break;
      }
    } catch (e) {
      rej(e);
    }
  });
}
