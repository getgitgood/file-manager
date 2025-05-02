import { homedir } from "os";
import path from "path";
import { styleText } from "util";

export const showCurrentDir = (options = {}, withPrompt = true) => {
  const pathObj = {
    root: homedir(),
    ...options,
  };

  if (withPrompt)
    return styleText("grey", `> You are currently in ${homedir()}`);

  return path.format(pathObj);
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
