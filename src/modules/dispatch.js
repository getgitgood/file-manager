import { messageUser } from "../utils/index.js";
import { navigate } from "./navigate.js";

export function dispatch({ cmd, ...params }) {
  if (!cmd) {
    messageUser("No cmd provided", true);

    return;
  }

  switch (cmd) {
    case "up":
      navigate({ cmd, ...params });

      break;
    default:
      messageUser("Invalid input", true);
  }
}
