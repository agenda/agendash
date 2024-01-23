export const formatJsonString = (str: string) => {
  if (!str) return undefined;
  return JSON.stringify(JSON.parse(str), null, 2);
};
