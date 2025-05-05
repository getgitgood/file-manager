import { mkdir, lstat } from "node:fs/promises";

export const mkDirOnENOENT = async (e, path) => {
  if (e instanceof Error && e?.code === "ENOENT")
    return await mkdir(path, { recursive: true });

  return null;
};
