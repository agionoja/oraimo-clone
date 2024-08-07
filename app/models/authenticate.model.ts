import { model, Model, Schema, Types } from "mongoose";
import generateAuthCode from "~/utils/generateAuthCode";

interface IAuthenticate {
  authCode: string;
  product: Types.ObjectId;
  authCount?: number;
  qrCode: string;
}

type UserModel = Model<IAuthenticate>;

const authenticateSchema = new Schema<IAuthenticate, UserModel>(
  {
    authCode: {
      type: String,
      unique: true,
      index: true,
    },
    qrCode: {
      type: String,
      unique: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
      index: true,
    },
    authCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

authenticateSchema.pre<IAuthenticate & Model<IAuthenticate>>(
  "save",
  async function (next) {
    this.authCode = generateAuthCode(3, "A");

    const generateUniqueCode = async () => {
      let uniqueCode = "";
      let isUnique = false;

      while (!isUnique) {
        uniqueCode = generateAuthCode(3, "A");
        const existingCode = await this.findOne(
          { authCode: uniqueCode },
          { authCode: 1 },
        )
          .lean()
          .exec();

        if (!existingCode) {
          isUnique = true;
        }
      }

      return uniqueCode;
    };

    this.authCode = await generateUniqueCode();

    next();
  },
);

const Authenticate = model<IAuthenticate, UserModel>(
  "Authenticate",
  authenticateSchema,
);

export default Authenticate;
