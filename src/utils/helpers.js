import { styleText } from "util";

export const capitalize = (string) =>
  `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;

const messageStyle = {
  error: "bgRedBright",
  warning: "bgYellowBright",
  success: "bgGreenBright",
};

export const messageUser = (msg, type) => {
  if (type) msg = styleText(messageStyle[type], msg);

  process.stdout.write(msg + "\n");
};
