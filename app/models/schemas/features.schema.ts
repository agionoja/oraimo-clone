import { Schema } from "mongoose";
import fileSchema, { IFile } from "~/models/schemas/file.schema";
import { arrayValidator, isObject, isString } from "~/utils/typeValidators";

export interface IFeature {
  photo?: IFile[];
  name: string;
  summary: string;
  description: string[];
}

export const isIFeature = <T>(item: T) =>
  isObject(item) &&
  "summary" in item &&
  "description" in item &&
  "name" in item;

const featuresSchema = new Schema<IFeature>({
  photo: {
    type: [fileSchema],
  },
  name: {
    type: String,
    required: [true, "Feature must have a name."],
  },
  summary: {
    type: String,
    required: [
      true,
      "Feature summary is required. Please provide a brief summary of the feature.",
    ],
  },
  description: {
    type: [String],
    required: [
      true,
      "Feature description is required. Please provide at least one detailed description.",
    ],
    validate: {
      validator: (value: string[]) => arrayValidator(value, isString),
      message: "Each description must be a non-empty string.",
    },
  },
});

export default featuresSchema;
