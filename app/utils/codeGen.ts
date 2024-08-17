type Option = {
  includeAlphaNumeric?: boolean;
};

const codeGen = (len: number, options?: Option) => {
  let code = "";
  const characters = options?.includeAlphaNumeric
    ? "0123456789abcdefghijklmnopqrstuvwxyz"
    : "0123456789";
  const length = characters.length;

  for (let i = 0; i < len; i++) {
    code += characters[Math.floor(Math.random() * length)];
  }

  return code;
};

export default codeGen;
