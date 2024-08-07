/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Query } from "mongoose";

interface QueryObject {
  [key: string]: any;
}

export default class AppQueries<T> {
  queryObject: QueryObject;
  mongooseQuery: Query<T[], T>;

  constructor(queryObject: QueryObject, mongooseQuery: Query<T[], T>) {
    this.queryObject = queryObject;
    this.mongooseQuery = mongooseQuery;
  }

  filter(): this {
    const excludedFields = ["page", "limit", "fields", "sort"];
    const queryObjectClone = { ...this.queryObject };

    excludedFields.forEach((field) => delete queryObjectClone[field]);

    const queryStr = JSON.stringify(queryObjectClone).replace(
      /\b(gte|gt|lte|lt|in|ne|eq|regex|options)\b/g,
      (match) => `$${match}`,
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields(): this {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(): this {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}
