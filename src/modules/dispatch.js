import { messageUser } from "../utils/index.js";
import { navigate, files } from "./index.js";

export async function dispatch({ cmd, ...params }) {
  if (!cmd) return;

  try {
    switch (cmd) {
      case "cd":
      case "up":
      case "ls":
        return await navigate({ cmd, ...params });
      case "cat":
      case "add":
      case "mkdir":
      case "rn":
        return await files({ cmd, ...params });
      default:
        messageUser("Invalid input", "error");

        break;
    }
  } catch (e) {
    let message = e;
    if (e instanceof Error && "message" in e) message = e.message;

    messageUser(`Operation failed: ${message}`, "error");
  }
}
