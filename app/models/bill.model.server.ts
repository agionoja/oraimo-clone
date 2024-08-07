import { Schema, Types } from "mongoose";

export interface IBill {
  user: Types.ObjectId;
  product: Types.ObjectId;
  status: "pending" | "completed" | "failed";
}

const billSchema = new Schema<IBill>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    status: {
      type: String,
      enum: ["pending", "failed", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default billSchema;
