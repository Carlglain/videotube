import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cokies.accessToken ||
    req.header("Authorization"?.replace("Bearer ", ""));
  if (!token) {
    throw new ApiError([], null, 401, "unAuthorized");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(
        [],
        null,
        401,
        "User with this refresh token does not exist"
      );
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError([], null, 401, error?.message || "invalid access token");
  }
});
