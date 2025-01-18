import {
  homePage,
  otpSender,
  registerUser,
  uploadProilePicture,
} from "../controller/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/").get(homePage);
router.route("/otp").post(otpSender);
router.route("/register").post(registerUser);
router
  .route("/uploadProfilePic")
  .put(upload.single("image"), uploadProilePicture);

export default router;
