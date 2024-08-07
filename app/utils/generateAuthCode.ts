export default function generateAuthCode(segment: number, prefix: string) {
  const yearPrefix = new Date().getFullYear().toString().slice(0, 3);
  let code = `${yearPrefix}`;

  for (let i = 0; i < segment - 1; i++) {
    const randomSegment = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, "0");
    code += `-${randomSegment}`;
  }

  return `${prefix}${code}`;
}
