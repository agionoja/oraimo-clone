import User from "~/models/user.model";
import { createOne, getAll } from "~/services/factory";

export const createUser = async (formData: Promise<FormData>) =>
  await createOne(formData, User);

export const getUsers = async (query: Record<string, never>) =>
  await getAll({ queryObject: query, model: User });
