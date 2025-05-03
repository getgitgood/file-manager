import path from "path";
import { getState, setCurrentDir } from "../utils/index.js";

export async function navigate({ cmd, args, flags }) {
  const state = await getState();

  switch (cmd) {
    case "up": {
      const pathObj = path.parse(path.resolve(state.currentDir, "../"));

      setCurrentDir(state, pathObj);
    }
  }
}

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
