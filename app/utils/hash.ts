import { promisify } from "node:util";
import * as crypto from "node:crypto";

type CreateHashArgs = {
  data?: string;
  len?: number;
};

export async function createHash(args: CreateHashArgs) {
  if (!args.len && !args.data) {
    throw new Error("Either hash length or hash data must be provided");
  }

  if (args.len && args.data) {
    throw new Error("Only hash len or hash data must be provided");
  }

  let data = "";

  if (args.data) {
    data = args.data;
  }

  if (args.len) {
    data = (await promisify(crypto.randomBytes)(args.len)).toString("hex");
  }

  return crypto.createHash("sha256").update(data).digest("hex");
}

export function compareHash(hash: string | undefined, data: string) {
  return crypto.createHash("sha256").update(data).digest("hex") === hash;
}
