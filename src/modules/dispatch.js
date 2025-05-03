import { messageUser } from "../utils/index.js";
import { navigate } from "./navigate.js";

export async function dispatch({ cmd, ...params }) {
  if (!cmd) {
    messageUser("No cmd provided", true);

    return;
  }

  switch (cmd) {
    case "cd":
    case "up":
    case "ls":
      return await navigate({ cmd, ...params });
    default:
      messageUser("Invalid input", true);
  }
}
