type Option = {
  includeAlphaNumeric?: boolean;
};

const codeGen = (salt: number, options?: Option) => {
  let otp = "";
  const characters = options?.includeAlphaNumeric
    ? "0123456789abcdefghijklmnopqrstuvwxyz"
    : "0123456789";
  const len = characters.length;

  for (let i = 0; i < salt; i++) {
    otp += characters[Math.floor(Math.random() * len)];
  }

  return otp;
};

export default codeGen;
