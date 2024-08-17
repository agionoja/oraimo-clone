/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";

interface QueryObject {
  [key: string]: any;
}

export default class AppQueries<TResult> {
  private readonly queryObject: QueryObject;
  public query: Query<TResult[], TResult>;

  constructor(
    queryObject: QueryObject,
    mongooseQuery: Query<TResult[], TResult>,
  ) {
    this.queryObject = queryObject;
    this.query = mongooseQuery;
  }

  search(paths: string): this | null {
    const qString = this.queryObject?.q;

    if (!qString || qString.length <= 2) {
      return null;
    }

    const pipeline: Array<any> = paths.split(" ").map((path) => ({
      [path]: { $regex: qString, $options: "i" },
    }));

    this.query = this.query.find({ $or: pipeline });

    return this;
  }

  filter(): this {
    const excludedFields = ["page", "limit", "fields", "sort"];
    const queryObjectClone = { ...this.queryObject };

    excludedFields.forEach((field) => delete queryObjectClone[field]);

    const queryStr = JSON.stringify(queryObjectClone).replace(
      /\b(gte|gt|lte|lt|in|ne|eq|regex|options|text|search)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.queryObject.text
      ? this.query
          .find(JSON.parse(queryStr), {
            score: { $meta: "textScore" },
          })
          .sort({ score: { $meta: "textScore" } })
      : this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields(): this {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate(): this {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async exec() {
    return this.query.lean().exec();
  }
}
