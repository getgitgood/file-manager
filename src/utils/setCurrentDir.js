import { homedir } from "os";
import path from "path";
import { styleText } from "util";
import { getState, messageUser } from "./index.js";

export const setCurrentDir = (state, options = {}, promptOnly = false) => {
  const getPrompt = (dir) =>
    styleText(["grey", "italic"], `> You are currently in ${dir}`);

  if (promptOnly) {
    messageUser(getPrompt(state.currentDir));

    return;
  }

  const pathObj = {
    root: homedir(),
    ...options,
  };

  state.currentDir = path.format(pathObj);

  messageUser(getPrompt(state.currentDir));
  return state.currentDir;
};

/*
TODO: remove in final version
from node docs:

pathObject <Object> Any JavaScript object having the following properties:
dir <string>
root <string>
base <string>
name <string>
ext <string>
*/
