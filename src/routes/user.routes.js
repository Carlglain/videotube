import {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  refreshAccessToken,
  updateAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controllers.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

//secured routes
router.get("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/update-password", verifyJWT, changeCurrentPassword);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);
router.put("/update-account-details", verifyJWT, updateAccountDetails);
router.put(
  "/update-avatar",
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);
router.put(
  "/update-cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);
export default router;
