import mongoose from "mongoose";
import { isObject } from "~/utils/typeValidators";

export interface IFile {
  publicId: string;
  url: string;
}

export const isIFile = <T>(item: T) =>
  isObject(item) && "publicId" in item && "url" in item;

const fileSchema = new mongoose.Schema<IFile>({
  publicId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export default fileSchema;
