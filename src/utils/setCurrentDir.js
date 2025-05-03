import { homedir } from "os";
import path from "path";
import { styleText } from "util";
import { getState, messageUser } from "./index.js";

export const setCurrentDir = (state, options = {}, withPrompt = true) => {
  const pathObj = {
    root: homedir(),
    ...options,
  };

  state.currentDir = path.format(pathObj);

  messageUser(
    styleText(["grey", "italic"], `> You are currently in ${state.currentDir}`)
  );

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
