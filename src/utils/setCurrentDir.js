import { homedir } from "os";
import path from "path";
import { styleText } from "util";
import { messageUser } from "./index.js";

export const setCurrentDir = (state, options = {}, promptOnly = false) => {
  const getPrompt = (dir) =>
    styleText(["dim", "italic"], `> You are currently in ${dir}`);

  if (promptOnly) {
    messageUser(getPrompt(state.currentDir));

    return;
  }

  const pathObj = {
    root: homedir(),
    ...options,
  };

  state.currentDir = path.format(pathObj);

  return state.currentDir;
};
