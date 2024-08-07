import mongoose, { Model, Query } from "mongoose";
import AppQueries from "~/utils/appQueries";

let connect: mongoose.Connection;
declare global {
  // eslint-disable-next-line no-var
  var __db: mongoose.Connection | undefined;
}

const mongoURI = process.env.DATABASE_LOCAL || "your_default_mongo_uri";

const createConnection = () => {
  if (process.env.NODE_ENV === "production") {
    connect = mongoose.createConnection(mongoURI);
  } else {
    if (!global.__db) {
      global.__db = mongoose.createConnection(mongoURI);
    }
    connect = global.__db;
  }

  return new Promise((resolve, reject) => {
    connect.once("open", () => resolve(connect));
    connect.on("error", (error) => reject(error));
  });
};
export default createConnection;

export const getAll = async <T>(
  queryObject: Record<string, any>,
  model: Model<T>,
  cb?: (q: Query<T[], T>) => Promise<T[]>,
): Promise<{ key: string; value: T[] }> => {
  try {
    const query = new AppQueries(queryObject, model.find())
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Assuming paginate is a method in AppQueries

    const docs = cb ? await cb(query.mongooseQuery) : await query.mongooseQuery;

    return { key: model.modelName.toLowerCase() + "s", value: docs };
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};
