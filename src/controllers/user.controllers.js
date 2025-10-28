import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiisPasswordValid } from "../utils/ApiisPasswordValid.js";
import jwt from "jsonwebtoken";
import { options } from "./data.js";
import bcrypt from "bcrypt";
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(["Empty Field"], null, 400, "Validation failed");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(
      ["Existing user"],
      null,
      409,
      "User with email or password already exist"
    );
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(
      ["Missing field"],
      null,
      400,
      "Avatar must be provided."
    );
  }
  const avatar = await uploadToCloudinary(avatarLocalPath);
  let coverImage = "";
  if (coverLocalPath) {
    coverImage = await uploadToCloudinary(coverLocalPath);
  }

  try {
    const newUser = await User.create({
      username,
      fullname: fullname.toLowerCase(),
      password,
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError([], null, 500, "something went wrong!");
    }

    return res
      .status(201)
      .json(
        new ApiisPasswordValid(201, "User Registered succesfully ", createdUser)
      );
  } catch (error) {
    console.log("User creation failed.");
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      [],
      null,
      500,
      "User creation failed. Please try again."
    );
  }
});

const generateAccessandRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      [],
      null,
      500,
      "Token generation failed. Please try again."
    );
  }
};
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if ([email, password, username].some((field) => field?.trim() === "")) {
    throw new ApiError(["Empty Field"], null, 400, "Validation failed");
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!existingUser) {
    throw new ApiError([
      "User not found",
      null,
      404,
      "No Such User in the system",
    ]);
  }
  const isValid = await existingUser.isPasswordCorrect(password);
  if (!isValid) {
    throw new ApiError([], null, 401, "Ivalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessandRefereshToken(
    existingUser._id
  );
  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiisPasswordValid(200, "User logen in succesfully ", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCokies("refreshToken", options)
    .clearCokies("accessToken", options)
    .json(new ApiisPasswordValid(200, "User logged out successfull", {}));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError([], null, 401, "Refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError([], null, 401, "Invalid refresh token user not found");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError([], null, 401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessandRefereshToken(user._id);
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiisPasswordValid(200, "Access token refreshed successfully", {
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
  } catch (error) {
    throw new ApiError([], null, 401, "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if ([password, oldPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(
      ["Empty Field"],
      null,
      400,
      "All fields must not be null"
    );
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError([], null, 401, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError([], null, 401, "Incorrect old Password");
  }
  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully", {}));
});

const getCurrentUser = asyncHandler(async (req, res) => {});

const updateAccountDetails = asyncHandler(async (req, res) => {});
const updateUserAvatar = asyncHandler(async (req, res) => {});
const updateUserCoverImage = asyncHandler(async (req, res) => {});

const deleteWatchHistory = asyncHandler(async (req, res) => {});
export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
};
