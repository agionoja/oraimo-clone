import { Model, model, Schema, Types } from "mongoose";
import categorySchema, { ICategory } from "~/models/schemas/category.schema";
import colorSchema, { IColor, isIColor } from "~/models/schemas/color.schema";
import specificationsSchema, {
  isISpecification,
  ISpecification,
} from "~/models/schemas/specifications.schema";
import featuresSchema, {
  IFeature,
  isIFeature,
} from "~/models/schemas/features.schema";
import slugify from "slugify";
import fileSchema, { IFile, isIFile } from "~/models/schemas/file.schema";
import { IReview } from "~/models/review.model";
import parameterSchema, {
  IParameter,
  isIParameter,
} from "~/models/schemas/parameter.schema";
import { arrayValidator } from "~/utils/typeValidators";
import dealSchema, { IDeal } from "~/models/schemas/deal.schema";

export interface IProduct {
  name: string;
  marketName: string;
  price: number;
  discount: number;
  slug?: string;
  ratingsAvg: number;
  ratingsQty: number;
  availableQty: number;
  model: string;
  orders: number;
  wishCount: number;
  cartCount: number;
  score: number;
  dailyDeal?: IDeal;
  flashSales?: IDeal;
  blackFriday?: IDeal;
  coverPhoto: IFile;
  colors: Array<IColor>;
  photos: Array<IFile>;
  category: ICategory;
  specifications: Array<ISpecification>;
  parameters: Array<IParameter>;
  features: Array<IFeature>;
}

export interface IProductWithReviews extends THydratedProductDocument {
  reviews?: Array<IReview>;
}

export type THydratedProductDocument = IProduct & {
  dailyDeal: Types.Subdocument<IDeal>;
  flashSales: Types.Subdocument<IDeal>;
  category: Types.Subdocument<ICategory>;
  specifications: Types.DocumentArray<ISpecification>;
  features: Types.DocumentArray<IFeature>;
  parameters: Types.DocumentArray<string>;
  colors: Types.DocumentArray<IColor>;
};

type ProductModel = Model<
  IProduct,
  NonNullable<unknown>,
  NonNullable<unknown>,
  NonNullable<unknown>,
  THydratedProductDocument
>;

const productSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, "Please provide the product name."],
      minlength: [4, "The product name must be at least 4 characters long."],
      maxlength: [60, "The product name cannot exceed 60 characters."],
      unique: true,
    },
    marketName: {
      type: String,
      required: [true, "Please provide the market name for the product."],
      min: [4, "The market name must be at least 4 characters long."],
      max: [60, "The market name cannot exceed 60 characters."],
    },
    coverPhoto: {
      type: fileSchema,
      required: [true, "Please upload a cover photo for the product."],
    },
    price: {
      type: Number,
      required: [true, "Please provide the price of the product."],
      min: [0, "The price cannot be a negative value."],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "The discount cannot be a negative value."],
      max: [100, "The discount cannot exceed 100%."],
    },
    orders: {
      type: Number,
      default: 0,
      min: [0, "The number of orders cannot be negative."],
    },
    ratingsAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQty: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableQty: {
      type: Number,
      required: [true, "Please specify the available quantity."],
      min: [0, "The available quantity cannot be negative."],
    },
    wishCount: {
      type: Number,
      default: 0,
      min: [0, "The wish count cannot be negative."],
    },
    cartCount: {
      type: Number,
      default: 0,
      min: [0, "The cart count cannot be negative."],
    },
    score: {
      type: Number,
      default: 0,
      max: [1, "The score cannot exceed 1."],
    },
    colors: {
      type: [colorSchema],
      required: [true, "Please specify the available colors."],
      validate: {
        validator: (value: IColor[]) => arrayValidator(value, isIColor),
        message:
          "Each color must have a name and code. Please ensure all color entries are correct.",
      },
    },
    category: {
      type: categorySchema,
      required: [true, "Please select a category for the product."],
    },
    photos: {
      type: [fileSchema],
      required: [true, "Please upload photos for the product."],
      validate: {
        validator: (value: IFile[]) => arrayValidator(value, isIFile),
        message:
          "Each photo must have a valid URL and public ID. Please ensure all photo entries are correct.",
      },
    },
    specifications: {
      type: [specificationsSchema],
      required: [true, "Please provide the product specifications."],
      validate: {
        validator: (value: ISpecification[]) =>
          arrayValidator(value, isISpecification),
        message:
          "Each specification must include a summary and an icon. Please ensure all specification entries are correct.",
      },
    },
    features: {
      type: [featuresSchema],
      required: [true, "Please provide the product features."],
      validate: {
        validator: (value: IFeature[]) => arrayValidator(value, isIFeature),
        message:
          "Each feature must have a name, summary, and description. Please ensure all feature entries are correct.",
      },
    },
    parameters: {
      type: [parameterSchema],
      required: [true, "Please provide the product parameters."],
      validate: {
        validator: (value: IParameter[]) => arrayValidator(value, isIParameter),
        message:
          "Each parameter must have a name and value. Please ensure all parameter entries are correct.",
      },
    },
    slug: String,
    model: String,
    dailyDeal: dealSchema,
    flashSales: dealSchema,
    blackFriday: dealSchema,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

productSchema.virtual<IProduct>("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Product = model<IProduct, ProductModel>("Product", productSchema);

export default Product;
