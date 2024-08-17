import { model, Model, Query, Schema, Types } from "mongoose";
import { IUser } from "~/models/user.model";
import Product from "~/models/product.model";
import fileSchema, { IFile } from "~/models/schemas/file.schema";
import { IVote } from "~/models/votes.model";

export interface IReview {
  rating: number;
  review: string;
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  title?: string;
  photos?: Array<IFile>;
  upvotes: number;
  downvotes: number;
  score: number;
}

export interface IReviewWithVote extends IReview {
  votes: Array<IVote>;
}

interface IReviewMethods {
  voteHelpful: (userId: Types.ObjectId, isUpvote: boolean) => Promise<void>;
}

interface ReviewModel
  extends Model<IReview, NonNullable<unknown>, IReviewMethods> {
  calcAverageRating: (productId: Schema.Types.ObjectId) => Promise<void>;
}

interface CustomQuery<TResultType, TDocType>
  extends Query<TResultType, TDocType> {
  productId: Schema.Types.ObjectId;
}

const reviewSchema = new Schema<IReview, ReviewModel, IReviewMethods>(
  {
    rating: {
      type: Number,
      required: [
        true,
        "Rating is required. Please provide a rating between 1 and 5.",
      ],
      min: [1, "Rating cannot be less than 1."],
      max: [5, "Rating cannot be more than 5."],
    },
    review: {
      type: String,
      required: [
        true,
        "Review text is required. Please provide your feedback.",
      ],
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
      max: [1, "Score cannot exceed 1."],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [
        true,
        "A product reference is required. Please provide the product ID.",
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "A user reference is required. Please provide the user ID.",
      ],
    },
    title: {
      type: String,
      default: "",
    },
    photos: {
      type: [fileSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// This prevents duplicate review from the same user
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.virtual("vote", {
  ref: "Vote",
  localField: "_id",
  foreignField: "review",
});

reviewSchema.pre<IReview>("save", async function (next) {
  if (!this.title) {
    const product = await Product.findById(this.product, { name: 1 })
      .select({ name: 1 })
      .lean()
      .exec();
    this.title = product?.name;
  }
  next();
});

reviewSchema.pre<Query<IReview, ReviewModel>>(/^find/, function (next) {
  this.populate<{ user: IUser }>({
    path: "user",
    select: "firstname lastname photo",
  });
  next();
});

reviewSchema.post("save", async function () {
  await (this.constructor as ReviewModel).calcAverageRating(this.product);
});

reviewSchema.pre<CustomQuery<IReview, ReviewModel>>(
  /^findOneAnd/,
  async function (next) {
    const review = await this.model
      .findOne<IReview>(this.getQuery())
      .select({ product: 1 })
      .lean()
      .exec();

    if (review) {
      this.productId = review.product as Schema.Types.ObjectId;
    }
    next();
  },
);

reviewSchema.post<CustomQuery<IReview, ReviewModel>>(
  /^findOneAnd/,
  async function () {
    if (this.productId) {
      await (this.model as ReviewModel).calcAverageRating(this.productId);
    }
  },
);

reviewSchema.statics.calcAverageRating = async function (
  productId: Types.ObjectId,
) {
  const [stats] = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        nRating: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingsAvg: stats.avgRating,
    ratingsQty: stats.nRating,
  });
};

const Review = model<IReview, ReviewModel>("Review", reviewSchema);

export default Review;
