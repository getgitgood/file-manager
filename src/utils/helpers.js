import { styleText } from "util";

export const capitalize = (string) =>
  `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;

export const messageUser = (msg, error) => {
  if (error) msg = styleText("bgRedBright", msg);

  process.stdout.write(msg + "\n");
};
