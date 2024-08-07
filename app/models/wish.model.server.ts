import { Schema } from "mongoose";

export interface IWish {
  product: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

new Schema<IWish>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
