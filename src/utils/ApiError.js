class ApiError extends Error {
  constructor(
    errors = [],
    stack,
    statusCode,
    message = "Something went wrong"
  ) {
    this.message = message;
    this.data = null;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
