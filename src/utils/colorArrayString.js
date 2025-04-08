export const colorArrayToString = (array) => {
  return `hsla(${array[0]}, ${array[1]}%, ${array[2]}%, ${array[3]})`;
};

export const colorStringToArray = (string) => {
  return string
    .replace("hsla(", "")
    .replace(")", "")
    .split(",")
    .map((v) => parseFloat(v.trim()));
};
