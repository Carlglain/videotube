import { registerUser } from "../controllers/user.controllers";
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares";
const router = Router();
router.post(
  "/register",
  upload.fields([
    {
      name: "converImage",
      maxCount: 1,
    },
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
