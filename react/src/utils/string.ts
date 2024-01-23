export const camelToFlat = (str: string) => {
  str = str.replace(/[A-Z]/g, " $&");
  str[0].toUpperCase() + str.slice(1);

  const arrStr = str.split(" ");

  const splitBetweenNumberAndString = arrStr.map((e) => {
    const matchResult = e.match(/(To|At)([a-fA-F0-9]+)/);
    if (matchResult) {
      return `${matchResult[1]} ${matchResult[2]}`;
    }
    return e;
  });

  return splitBetweenNumberAndString.join(" ");
};
