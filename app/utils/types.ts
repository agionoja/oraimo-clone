// utils.ts
import { Types } from "mongoose";

export type LeanDocument<T> = T & { _id: Types.ObjectId; $locals?: never };