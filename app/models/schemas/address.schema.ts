import { Schema } from "mongoose";

export interface IAddress {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  state: string;
  city: string;
  district: string;
  whatsapp: string;
}

const addressSchema = new Schema<IAddress>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email address",
    },
  },
  phone: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  whatsapp: String,
});

export default addressSchema;
