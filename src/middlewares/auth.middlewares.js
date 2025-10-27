import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.body.refreshToken;
  if (!token) {
    throw new ApiError([], null, 401, "Invalid refresh token");
  }
  try {
  } catch (error) {
    throw new Api();
  }
});
