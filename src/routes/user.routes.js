import {
  homePage,
  loginUser,
  otpSender,
  registerUser,
  uploadProilePicture,
  logout,
} from "../controller/user.controller.js";

import verifyJWt from "../middleware/auth.middlewaer.js";

import { upload } from "../middleware/multer.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/").get(homePage);
router.route("/otp").post(otpSender);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWt, logout);
router
  .route("/uploadProfilePic")
  .put(upload.single("image"), uploadProilePicture);

export default router;
