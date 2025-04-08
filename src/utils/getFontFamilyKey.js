export const getFontFamilyKey = (fontFamilyValue) => {
  const node = document.querySelector(`.font-names .${fontFamilyValue}`);
  if (node) {
    return node.innerText;
  }
  return "";
};

export const getFontFamilyValueFromKey = (fontFamilyKey) => {
  const node = document.querySelector(`.font-keys .${fontFamilyKey}`);
  if (node) {
    return node.innerText;
  }
  return "";
};
