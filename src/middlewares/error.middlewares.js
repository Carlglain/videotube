import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
const errorHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || "Something went wrong";
    // ApiError constructor: (errors = [], stack, statusCode, message)
    // Keep the same ordering as other callers (controllers) so properties map correctly
    error = new ApiError(error?.error || [], err.stack, statusCode, message);
  }
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development"
      ? {
          stack: error.stack,
        }
      : {}),
  };
  return res.status(error.statusCode).json(response);
};
export { errorHandler };
