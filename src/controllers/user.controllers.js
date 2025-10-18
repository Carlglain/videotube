import { User } from "../models/user.models";
import { asyncHandler } from "../utils/asyncHandler";
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    fullname,
    watchHistory,
    password,
    avatar,
    coverImage,
    refreshToken,
    timeStamp,
  } = req.body;
  //   try {
  //     const newUser = new User({
  //       username,
  //       email,
  //       fullname,
  //       watchHistory,
  //       password,
  //       refreshToken,
  //       timeStamp,
  //     });
  //     await newUser
  //       .save()
  //       .status(201)
  //       .send(newUser)
  //       .json({ message: `User Created succesfully` });
  //   } catch (err) {}
});

export { registerUser };
