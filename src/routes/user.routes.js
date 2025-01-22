import {
  homePage,
  loginUser,
  otpSender,
  registerUser,
  getMyProfile,
  logout,
} from "../controller/user.controller.js";

import {
  uploadProfilePicture,
  comment,
  like,
} from "../controller/userPost.controller.js";

import verifyJWt from "../middleware/auth.middlewaer.js";

import { upload } from "../middleware/multer.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/").get(homePage);
router.route("/otp").post(otpSender);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyJWt, getMyProfile);
router.route("/logout").post(verifyJWt, logout);
router
  .route("/uploadProfilePic")
  .post(verifyJWt, upload.single("image"), uploadProfilePicture);

router.route("/comment").patch(verifyJWt, comment);

router.route("/like").patch(verifyJWt, like);
export default router;
