import {
  registerUser,
  loginUser,
  logoutUser,
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
export default router;
