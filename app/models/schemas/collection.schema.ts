import { Schema } from "mongoose";

export interface ICollection {
  category: "product";
  subcategory: "audio" | "power" | "home appliance";
  specificCategory: string;
  itemName: string;
}

export default new Schema<ICollection>(
  {
    category: {
      type: String,
      default: "product",
      enum: ["product"],
    },
    subcategory: {
      type: String,
      required: true,
      enum: ["audio", "power", "home appliance"],
    },
    specificCategory: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
    },
  },
  { _id: false },
);
