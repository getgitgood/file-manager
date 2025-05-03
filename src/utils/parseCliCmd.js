export const parseCliCmd = (data, state) => {
  const [cmd, ...rest] = data.toString().trim().split(" ");

  const args = rest.reduce(
    (acc, item) => {
      if (item.startsWith("--")) acc.flags.push(item);
      else acc.args.push(item);

      return acc;
    },
    { args: [], flags: [] }
  );

  state.cliCmd = { cmd, ...args };

  return { cmd, ...args };
};
