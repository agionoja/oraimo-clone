import { Schema } from "mongoose";
import fileSchema from "~/models/schemas/file.schema";

type Feature = {
  photo: string;
  name: string;
  description: string;
};
export interface IFeatures {
  features: Array<Feature>;
}

const featuresSchema = new Schema<IFeatures>(
  {
    features: [
      {
        photo: {
          type: fileSchema,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { _id: false },
);

export default featuresSchema;
