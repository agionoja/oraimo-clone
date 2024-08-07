// utils/globalError.ts
import cloneDeep from "clone-deep";
import { MongoServerError } from "mongodb";
import AppError from "~/utils/appError";
import { Error as MongooseError } from "mongoose";

export type GlobalError = {
  message: string;
  statusCode: number;
  status: string;
  stack?: string | undefined;
  name?: string;
  isOperational?: boolean;
};

type ExtendError = {
  status?: string;
  statusCode?: number;
  isOperational?: boolean;
};

const handleDevError = (err: Error & ExtendError): GlobalError => {
  return {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode || 500,
    status: err.status || "error",
    stack: err.stack,
    isOperational: err.isOperational,
  };
};

const handleProdError = (err: Error & ExtendError): GlobalError => {
  return err.isOperational
    ? {
        message: err.message,
        statusCode: err.statusCode || 500,
        status: err.status || "error",
      }
    : {
        message: "Something went very wrong💥💥",
        statusCode: 500,
        status: "Internal server error",
      };
};

const handleDuplicateError = (err: MongoServerError): AppError => {
  const keyValue = Object.entries(err.keyValue)[0];
  const [key, value] = keyValue;
  return new AppError(
    `The ${key} ${value} is already in use. Please use a different ${key}.`,
    400,
  );
};

const handleDbValidationError = (err: MongooseError.ValidationError) => {
  const message = Object.keys(err.errors)
    .map((key) => err.errors[key].message)
    .join(". ");
  return new AppError(message, 400);
};

const handleDbCastError = (err: MongooseError.CastError) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const globalError = (err: Error & ExtendError): GlobalError => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal server error";

  if (process.env.NODE_ENV === "development") {
    return handleDevError(err);
  } else {
    let cloneError = cloneDeep(err);

    if ((err as MongoServerError).code === 11000) {
      cloneError = handleDuplicateError(err as MongoServerError);
    }

    if (err.name === "ValidationError") {
      cloneError = handleDbValidationError(
        err as MongooseError.ValidationError,
      );
    }

    if (err.name === "CastError") {
      cloneError = handleDbCastError(err as MongooseError.CastError);
    }

    return handleProdError(cloneError);
  }
};

export default globalError;
