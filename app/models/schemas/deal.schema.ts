import { Schema, Types, Document, Query } from "mongoose";

export interface IDeal {
  dealType: DealType;
  dealPrice: number;
  dealDiscount: number;
  dealStart: Date;
  dealEnd: Date;
}

export type DealType = "daily" | "flash" | "black-friday";

interface IDealSubDocument extends IDeal, Types.Subdocument {}

interface IDealWithGet extends IDeal {
  get: Query<IDeal, never>["get"];
}

const dealSchema = new Schema<IDeal>({
  dealPrice: {
    type: Number,
    default: 0,
  },
  dealType: {
    type: String,
    required: [
      true,
      "Deal type is required. Choose from 'daily', 'flash', or 'black-friday'.",
    ],
    enum: ["daily", "flash", "black-friday"],
  },
  dealDiscount: {
    type: Number,
    required: [
      true,
      "Deal discount is required. Please provide a discount percentage between 0 and 100.",
    ],
    min: [
      0,
      "Discount cannot be negative. Please provide a value between 0 and 100.",
    ],
    max: [
      100,
      "Discount cannot exceed 100%. Please provide a value between 0 and 100.",
    ],
  },
  dealStart: {
    type: Date,
    required: [
      true,
      "Start date is required. Please specify when the deal begins.",
    ],
    validate: {
      validator: function (value: Date) {
        const self = this as IDealWithGet;

        if (self.get && self.get("dealEnd")) {
          const dealEnd = self.get("dealEnd") as Date;
          return value < dealEnd;
        }

        return self.dealEnd > value;
      },
      message:
        "Start date must be before the end date. Please correct the start date.",
    },
  },
  dealEnd: {
    type: Date,
    required: [
      true,
      "End date is required. Please specify when the deal ends.",
    ],
    validate: {
      validator: function (value: Date) {
        const self = this as IDealWithGet;

        if (self.get && self.get("dealStart")) {
          const dealStart = self.get("dealStart") as Date;
          return value < dealStart;
        }
        return self.dealEnd > value;
      },
      message:
        "End date must be after the start date. Please correct the end date.",
    },
  },
});

dealSchema.pre<IDealSubDocument>("save", function (next) {
  const product = this.ownerDocument() as Document & { price: number };

  if (
    !this.dealPrice ||
    this.isModified("dealDiscount") ||
    product.isModified("price")
  ) {
    if (this.dealDiscount > 0 && product.price) {
      this.dealPrice = product.price * (1 - this.dealDiscount / 100);
    }
  }

  next();
});

export default dealSchema;
