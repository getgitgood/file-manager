import { messageUser } from "./helpers.js";

export async function getState() {
  try {
    const state = await import("../state/state.js").then(
      ({ default: value }) => value
    );

    return state;
  } catch (e) {
    messageUser("Cannot get state from ../state/state.js", true);

    return {};
  }
}
