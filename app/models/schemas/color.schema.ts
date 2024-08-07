import { Schema } from "mongoose";

export interface IColor {
  name:
    | "black"
    | "red"
    | "green"
    | "blue"
    | "silver"
    | "gold"
    | "grey"
    | "iceLakeBlue"
    | "nebulaBlue";
  code: string;
}

const colorSchema = new Schema<IColor>(
  {
    name: {
      type: String,
      required: true,
      enum: [
        "black",
        "red",
        "green",
        "blue",
        "silver",
        "gold",
        "grey",
        "iceLakeBlue",
        "nebulaBlue",
      ],
    },
    code: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

export default colorSchema;
