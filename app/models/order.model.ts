import { Schema, Types } from "mongoose";
import addressSchema, { IAddress } from "~/models/schemas/address.schema";
import { IBill } from "~/models/bill.model";

export interface IOder {
  orderNumber: string;
  quantity: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
  shippingAddress: IAddress;
  billingAddress: IBill;
  status: "pending" | "shipped" | "completed" | "canceled";
}

const orderSchema = new Schema<IOder>(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    user: {
      type: Schema.Types.ObjectId,
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export default orderSchema;
