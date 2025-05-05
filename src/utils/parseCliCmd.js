export const parseCliCmd = async (data, state) => {
  return new Promise((res, rej) => {
    const [cmd, ...rest] = data.toString().trim().split(" ").filter(Boolean);

    const input = rest.reduce(
      (acc, item) => {
        item.startsWith("--") ? acc.flags.push(item) : acc.args.push(item);

        return acc;
      },
      { args: [], flags: [] }
    );

    const args = input.args;

    if (!args.length) {
      state.cliCmd = { cmd, ...input };

      res({ cmd, ...input });
    }

    let isQuoted = false;

    const assembledArgs = [];
    let quotedArg = [];

    for (const arg of args) {
      if (arg.startsWith('"')) isQuoted = true;

      if (isQuoted && arg.startsWith('"')) {
        quotedArg.push(arg.slice(1));

        continue;
      }

      if (arg.endsWith('"')) {
        quotedArg.push(arg.slice(0, -1));
        assembledArgs.push(quotedArg.join(" ").replaceAll('"', ""));
        quotedArg = [];
        isQuoted = false;

        continue;
      }

      if (arg.includes('"')) {
        isQuoted = true;
        quotedArg.push(arg);

        continue;
      }

      assembledArgs.push(arg);
      isQuoted = false;
    }

    if (isQuoted)
      rej(
        `Invalid Input. Encountered opened but not closed quote in arg "${quotedArg.join(
          " "
        )}"`
      );

    input.args = assembledArgs;

    state.cliCmd = { cmd, ...input };

    return res({ cmd, ...input });
  });
};
