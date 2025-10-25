import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
      .json(new ApiResponse(201, "User Registered succesfully ", createdUser));
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

  return res.status(200).json(
    new ApiResponse(200, "User logen in succesfully ", {
      accessToken,
      refreshToken,
    })
  );
});
export { registerUser, loginUser };
