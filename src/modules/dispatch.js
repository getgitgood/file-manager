import { messageUser } from "../utils/index.js";
import { navigate, files } from "./index.js";

export async function dispatch({ cmd, ...params }) {
  if (!cmd) {
    messageUser("No cmd provided", true);

    return;
  }
  try {
    switch (cmd) {
      case "cd":
      case "up":
      case "ls":
        return await navigate({ cmd, ...params });
      case "cat":
        return await files({ cmd, ...params });
      default:
        messageUser("Invalid input", true);
    }
  } catch (e) {
    let message = e;
    if (e instanceof Error && "message" in e) message = e.message;

    messageUser(message, true);
  }
}
