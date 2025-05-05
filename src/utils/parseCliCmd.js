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

    state.cliCmd = { cmd, ...input };

    res({ cmd, ...input });
  });
};
