import { Schema } from "mongoose";

type Specification = { name: string; icon: string };

export interface ISpecifications {
  specifications: Array<Specification>;
}

const specificationsSchema = new Schema<ISpecifications>(
  {
    specifications: [
      {
        icon: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { _id: false },
);

export default specificationsSchema;
