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

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "../controller/friendship.controller.js";

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

// post routes

router
  .route("/uploadProfilePic")
  .post(verifyJWt, upload.single("image"), uploadProfilePicture);

router.route("/comment").patch(verifyJWt, comment);

router.route("/like").patch(verifyJWt, like);

// friendship route

router.route("/friendrequest").post(verifyJWt, sendFriendRequest);

router.route("/acceptfriendrequest").patch(verifyJWt, acceptFriendRequest);

router.route("/declinefriendrequest").patch(verifyJWt, declineFriendRequest);
export default router;
