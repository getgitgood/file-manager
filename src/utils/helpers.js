import { styleText } from "util";

export const capitalize = (string) =>
  `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;

export const messageUser = (msg, style) => {
  if (style)
    msg = styleText(style === "error" ? "bgRedBright" : "bgGreenBright", msg);

  process.stdout.write(msg + "\n");
};
