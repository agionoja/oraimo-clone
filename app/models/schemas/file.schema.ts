import mongoose from "mongoose";

export interface IFile {
  id: string;
  url: string;
}

const fileSchema = new mongoose.Schema<IFile>(
  {
    id: {
      type: String,
      required: [true, "A file must have an ID"],
    },
    url: {
      type: String,
      required: [true, "A file must have a URL"],
    },
  },
  { _id: false },
);

export default fileSchema;
