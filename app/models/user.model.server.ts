import { model, Model, Schema, Types } from "mongoose";
import createTimeStamp from "~/utils/createTimeStamp";
import codeGen from "~/utils/codeGen";
import { Roles } from "~/utils/enums";
import { compareHash, hashPassword } from "~/utils/scrypt";
import addressSchema, { IAddress } from "~/models/schemas/address.schema";

export interface IUser {
  email: string;
  firstname: string;
  lastname: string;
  username?: string;
  role: string;
  cart: string[];
  orders: string;
  coupon: string;
  addresses: Types.DocumentArray<IAddress>;
  wishlist: Array<Types.ObjectId>;
  password: string;
  passwordConfirm: string | undefined;
  passwordResetCode: string | undefined;
  passwordResetCodeExpires: Date | undefined;
  passwordChangeAfterJwt: Date | undefined;
  verificationCode: string | undefined;
  verificationCodeExpires: Date | undefined;
}

interface IUserMethods {
  passwordChangedAfterJwt: (jwtIat: Date) => boolean;
  comparePassword: (
    plainPassword: string,
    hashedPassword: string,
  ) => Promise<boolean>;
  generateAndSavePasswordResetCode: () => Promise<string>;
  generateAndSaveVerificationCode: () => Promise<string>;
}

type UserModel = Model<IUser, NonNullable<unknown>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      select: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email address",
      },
    },
    role: {
      type: String,
      default: Roles.USER,
    },
    wishlist: [
      {
        type: Types.ObjectId,
        ref: "wishlist",
      },
    ],
    addresses: [addressSchema],
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password confirmation is required"],
      validate: {
        validator: function (value: string): boolean {
          return this.password === value;
        },
        message: "Passwords do not match",
      },
    },
    passwordResetCode: String,
    passwordResetCodeExpires: String,
    passwordChangeAfterJwt: Date,
    verificationCode: String,
    verificationCodeExpires: Date,
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function (next) {
  this.password = await hashPassword(this.password);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.comparePassword = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await compareHash(plainPassword, hashedPassword);
};

userSchema.methods.passwordChangedAfterJwt = function (jwtIat: Date): boolean {
  if (!this.passwordChangeAfterJwt) {
    return false;
  }

  const changedTimestamp = this.passwordChangeAfterJwt.getTime() / 1000;
  return jwtIat.getTime() < changedTimestamp;
};

userSchema.methods.generateAndSavePasswordResetCode = async function () {
  const code = codeGen(6, { includeAlphaNumeric: true });
  this.passwordResetCode = code;
  this.passwordResetCodeExpires = new Date(createTimeStamp({ m: 10 }));

  this.save({ validateBeforeSave: false });
  return code;
};

userSchema.methods.generateAndSaveVerificationCode = async function () {
  const code = codeGen(6, { includeAlphaNumeric: true });
  this.verificationCode = code;
  this.verificationCodeExpires = new Date(createTimeStamp({ m: 10 }));
  this.save({ validateBeforeSave: false });
  return code;
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
