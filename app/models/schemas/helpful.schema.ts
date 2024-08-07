import { Schema } from "mongoose";

export interface IHelpful {
  helpfulCount: number;
  unHelpfulCount: number;
}

const helpfulSchema = new Schema<IHelpful>({
  helpfulCount: {
    type: Number,
    required: true,
    default: 0,
    min: 1,
  },
  unHelpfulCount: {
    type: Number,
    required: true,
    default: 0,
    min: 1,
  },
});

export default helpfulSchema;
