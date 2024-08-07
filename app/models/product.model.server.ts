import { Model, model, Schema } from "mongoose";
import collectionSchema, {
  ICollection,
} from "~/models/schemas/collection.schema";
import colorSchema, { IColor } from "~/models/schemas/color.schema";
import specificationsSchema, {
  ISpecifications,
} from "~/models/schemas/specifications.schema";
import featuresSchema, { IFeatures } from "~/models/schemas/features.schema";

export interface IProduct {
  name: string;
  price: number;
  discount: number;
  color: IColor;
  collection: ICollection;
  ratingsAverage: number;
  ratingsQuantity: number;
  summary: string;
  specifications: ISpecifications;
  parameters: string[];
  features: IFeatures;
}

type ProductModel = Model<IProduct>;

const productSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      minlength: 4,
      maxlength: 60,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: true,
    },
    color: {
      type: colorSchema,
      required: true,
    },
    collection: {
      type: collectionSchema,
      required: true,
    },
    specifications: {
      type: specificationsSchema,
      required: true,
    },
    features: {
      type: featuresSchema,
      required: true,
    },
    parameters: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  this.collection.itemName = this.name;
  next();
});

const Product = model<IProduct, ProductModel>(
  "ProductModelServer",
  productSchema,
);

export default Product;
