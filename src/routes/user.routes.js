import {
  homePage,
  loginUser,
  otpSender,
  registerUser,
  getMyProfile,
  logout,
  alluser,
  searchFriends,
} from "../controller/user.controller.js";

import verifyJWt from "../middleware/auth.middlewaer.js";

import { Router } from "express";

const router = Router();

router.route("/all").get(alluser);
router.route("/check").get(searchFriends);
router.route("/").get(homePage);
router.route("/otp").post(otpSender);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyJWt, getMyProfile);
router.route("/logout").post(verifyJWt, logout);

export default router;
