import mongoose, { Model, Query, Schema, Types } from "mongoose";
import Review from "~/models/review.model";
import { IUser } from "~/models/user.model";

export interface IVote {
  review: Types.ObjectId;
  user: Types.ObjectId;
  isUpvote: boolean;
}

interface VoteModel extends Model<IVote> {
  calcVotes: (
    reviewId: Types.ObjectId | Schema.Types.ObjectId,
  ) => Promise<void>;
}

interface CustomQuery<TResultType, TDocType>
  extends Query<TResultType, TDocType> {
  reviewId: Types.ObjectId;
}

const voteSchema = new Schema<IVote, VoteModel>(
  {
    review: {
      type: Schema.Types.ObjectId,
      required: [
        true,
        "A review reference is required. Please provide the review ID.",
      ],
      ref: "Review",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [
        true,
        "A user reference is required. Please provide the user ID.",
      ],
      ref: "User",
    },
    isUpvote: {
      type: Boolean,
      required: [
        true,
        "Vote type is required. Please specify whether this is an upvote or down-vote.",
      ],
    },
  },
  { timestamps: true },
);

// Prevents duplicate vote
voteSchema.index({ review: 1, user: 1 }, { unique: true });

voteSchema.pre<Query<IVote, VoteModel>>(/^find/, function (next) {
  this.populate<{ user: IUser }>("user", "firstname lastname username photo");
  next();
});

voteSchema.post("save", async function () {
  await (this.constructor as VoteModel).calcVotes(this.review);
});

voteSchema.pre<CustomQuery<IVote, VoteModel>>(
  /^findOneAnd/,
  async function (next) {
    const vote = await this.model
      .findOne<IVote>(this.getQuery())
      .select("review")
      .lean()
      .exec();

    if (vote) {
      this.reviewId = vote.review;
    }

    next();
  },
);

voteSchema.post<CustomQuery<IVote, VoteModel>>(
  /^findOneAnd/,
  async function () {
    if (this.reviewId) {
      await (this.model as VoteModel).calcVotes(this.reviewId);
    }
  },
);

voteSchema.statics.calcVotes = async function (reviewId: Types.ObjectId) {
  const [stats] = await this.aggregate([
    {
      $match: { review: reviewId },
    },
    {
      $group: {
        _id: "$review",
        upvotes: {
          $sum: {
            $cond: [{ $eq: ["$isUpvote", true] }, 1, 0],
          },
        },
        downvotes: {
          $sum: {
            $cond: [{ $eq: ["$isUpvote", false] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        upvotes: 1,
        downvotes: 1,
        score: {
          $cond: {
            if: {
              $eq: [
                {
                  $add: [{ $toInt: "$upvotes" }, { $toInt: "$downvotes" }],
                },
                0,
              ],
            },
            then: 0,
            else: {
              $divide: [
                { $toInt: "$upvotes" },
                {
                  $add: [{ $toInt: "$downvotes" }, { $toInt: "$upvotes" }],
                },
              ],
            },
          },
        },
      },
    },
  ]);

  await Review.findByIdAndUpdate(reviewId, {
    upvotes: stats.upvotes,
    downvotes: stats.downvotes,
    score: stats.score,
  });
};

const Vote = mongoose.model<IVote, VoteModel>("Vote", voteSchema);

export default Vote;
