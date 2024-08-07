import { model, Model, Query, Schema } from "mongoose";
import { IUser } from "~/models/user.model.server";
import { IProduct } from "~/models/product.model.server";
import fileSchema, { IFile } from "~/models/schemas/file.schema";
import helpfulSchema, { IHelpful } from "~/models/schemas/helpful.schema";

export interface IReview {
  rating: number;
  review: string;
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  summary?: string;
  photos?: IFile;
  helpful: IHelpful;
}

interface ReviewModel extends Model<IReview> {}

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
    },
      user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
      summary: String,
      photos: [fileSchema],
    helpful: helpfulSchema,
  },
  { timestamps: true },
);

reviewSchema.pre<IReview>("save", async function (next) {

})

reviewSchema.pre<Query<IReview, ReviewModel>>(/^find/, function (next) {
  this.populate<{ user: IUser }>({
    path: "user",
    select: "firstname lastname photo _id",
  });

  this.populate<IProduct>({ path: "product", select: "name _id" });
  next();
});

const Review = model<IReview, ReviewModel>("Review", reviewSchema);

const review = await Review.findById("").populate("user").exec();

export default Review;
