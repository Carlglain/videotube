import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { name, fullname, email, password } = req.body;
  if ([name, fullname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(["Empty Field"], null, 400, "Validation failed");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(
      ["Existing user"],
      null,
      4009,
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

  const newUser = await User.create({
    name,
    fullname: fullname.toLowerCase(),
    password,
    email,
    password,
    avater: avatar.url,
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
});
export { registerUser };
