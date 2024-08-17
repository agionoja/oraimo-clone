/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Query } from "mongoose";
import AppQueries from "~/utils/appQueries";
import { asyncWrapper } from "~/utils/asyncWrapper";
import User from "~/models/user.model";

type QueryWithoutExec<T> = Omit<Query<T[], T>, "exec">;

type TModel<
  TRawDocType,
  TInstanceMethods = NonNullable<unknown>,
  THydratedDocument = NonNullable<unknown>,
> = Model<
  TRawDocType,
  NonNullable<unknown>,
  TInstanceMethods,
  NonNullable<unknown>,
  THydratedDocument
>;

type GetAllArgs<
  TRawDocType,
  TInstanceMethods = NonNullable<unknown>,
  THydratedDocument = NonNullable<unknown>,
> = {
  queryObject: Record<string, any>;
  model: TModel<TRawDocType, TInstanceMethods, THydratedDocument>;
  cb?: (q: QueryWithoutExec<TRawDocType>) => QueryWithoutExec<TRawDocType>;
};

export const getAll = async <
  TRawDocType,
  TInstanceMethods = NonNullable<unknown>,
  THydratedDocument = NonNullable<unknown>,
>(
  args: GetAllArgs<TRawDocType, TInstanceMethods, THydratedDocument>,
) =>
  asyncWrapper(async () => {
    const { queryObject, model, cb } = args;
    const query = new AppQueries<TRawDocType>(queryObject, model.find())
      .filter()
      .sort()
      .limitFields()
      .paginate().query;
    return cb ? await cb(query).lean().exec() : await query.lean().exec();
  });

export const createOne = <TRawDocType, TInstanceMethods, THydratedDocument>(
  formData: Promise<FormData>,
  model: TModel<TRawDocType, TInstanceMethods, THydratedDocument>,
) =>
  asyncWrapper(
    async () => await model.create(Object.fromEntries(await formData)),
  );

export const findById = <T>(id: string, model: Model<T>) =>
  asyncWrapper(async () => {
    return await model.findById(id).exec();
  });
