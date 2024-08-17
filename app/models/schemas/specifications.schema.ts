import { Schema } from "mongoose";
import fileSchema, { IFile } from "~/models/schemas/file.schema";
import { isObject } from "~/utils/typeValidators";

export type ISpecification = { summary: string; icon: IFile };
export const isISpecification = <T>(item: T) =>
  isObject(item) && "summary" in item && "icon" in item;

const specificationsSchema = new Schema<ISpecification>({
  icon: {
    type: fileSchema,
    required: true,
  },
  summary: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 20,
  },
});

export default specificationsSchema;
