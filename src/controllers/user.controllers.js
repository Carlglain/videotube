import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
const registerUser = asyncHandler(async (req, res) => {
  const { name, fullname, email, password } = req.body;
  const newUser = new User({
    name,
    fullname,
    email,
    password,
  });
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
});
export { registerUser };
