import { Model, model, Schema } from "mongoose";
import codeGen from "~/utils/codeGen";
import { compareHash, createHash } from "~/utils/hash";
import createTimeStamp from "~/utils/createTimeStamp";
import { isEmail } from "validator";

interface IVerifyUser {
  email: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
}

interface IVerifyUserMethods {
  generateAndSaveVerificationCode: () => Promise<string>;
  compareVerificationCode: (code: string) => boolean;
}

type VerifyUserModel = Model<
  IVerifyUser,
  NonNullable<unknown>,
  IVerifyUserMethods
>;

const verifyUserSchema = new Schema<
  IVerifyUser,
  VerifyUserModel,
  IVerifyUserMethods
>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [isEmail, "Invalid email address"],
    },
    verificationCode: String,
    verificationCodeExpires: Date,
  },
  { timestamps: true },
);

verifyUserSchema.methods.generateAndSaveVerificationCode = async function () {
  const code = await createHash({ data: codeGen(6) });

  this.verificationCode = code;
  this.verificationCodeExpires = new Date(createTimeStamp({ m: 10 }));

  await this.save({ validateBeforeSave: false });
  return code;
};

verifyUserSchema.methods.compareVerificationCode = function (code: string) {
  return compareHash(this.verificationCode, code);
};

const VerifyUser = model<IVerifyUser, VerifyUserModel>(
  "VerifyUser",
  verifyUserSchema,
);

export default VerifyUser;
