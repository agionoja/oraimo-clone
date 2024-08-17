import { Schema } from "mongoose";
import { isObject } from "~/utils/typeValidators";

export interface IParameter {
  name: string;
  value: string;
}
export const isIParameter = <T>(item: T) =>
  isObject(item) && "name" in item && "value" in item;

const parameterSchema = new Schema<IParameter>({
  name: {
    type: String,
    required: [
      true,
      "Parameter name is required. Please specify the name of the parameter.",
    ],
  },
  value: {
    type: String,
    required: [
      true,
      "Parameter value is required. Please specify the value of the parameter.",
    ],
  },
});

export default parameterSchema;
