import asyncHandler from "express-async-handler";

import userProfileSchema from "../model/user.model.js";

import otp from "../model/otp.model.js";

import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary } from "../utils/Imageupload.js";

import otpGenerate from "../utils/otpGenerate.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const homePage = asyncHandler((req, res) => {
  res.status(200).send("home page ");
});

const otpSender = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await otp.findOne({
    email: email,
  });

  if (user) {
    await otp.deleteOne({ email: email });
  }

  const pass = otpGenerate;

  if (!email) {
    throw new ApiError(401, "please enter your  email address");
  }
  if (!email.includes("@")) {
    throw new ApiError(401, "invald email address");
  }
  const otpExpiry = new Date();
  otpExpiry.setSeconds(otpExpiry.getSeconds() + 30);
  otpExpiry.setMilliseconds(0);
  console.log(otpExpiry);

  const otpdb = await otp.create({
    email: email,
    pass: pass,
    expiresAt: otpExpiry,
  });
  res.status(200).json(new ApiResponse(200, otpdb, "otp sended to your email"));
});

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { username, dob, gender, email, password, onetimepass } = req.body;

  const present = await userProfileSchema.findOne({
    email: email,
  });
  if (present) {
    throw new ApiError(401, "user already exist");
  }
  if (!username || !dob || !gender || !email || !password) {
    throw new ApiError(401, "all information must be filled");
  }

  if (!email.includes("@")) {
    throw new ApiError(401, "invalid email");
  }

  const user = await otp.findOne({
    email: email,
  });
  console.log(user);

  if (!user) {
    throw new ApiError(401, "please ask for otp first");
  }
  const current = new Date();
  current.setMilliseconds(0);
  console.log(current);

  if (user.expiresAt < current) {
    console.log("hi");
    await otp.deleteOne({ email: email });
    throw new ApiError(401, "OTP has expired. Please request a new one.");
  }

  if (email !== user.email || onetimepass !== user.pass) {
    throw new ApiError(401, "invalid email or otp ");
  }

  const profile = await userProfileSchema.create({
    username,
    dateOfBirth: dob,
    gender,
    email,
    password,
  });
  if (!profile) {
    throw new ApiError(500, "error while regestering the user");
  }
  if (profile) {
    await user.deleteOne({ email: email });
  }

  res
    .status(200)
    .json(new ApiResponse(200, profile, "user created sucess fully"));
});

const uploadProilePicture = asyncHandler(async (req, res) => {
  let image = "";
  console.log(req.body);

  const profileimage = req.file?.path;

  if (profileimage) {
    image = await uploadOnCloudinary(profileimage);
  }
});

export { homePage, registerUser, otpSender, uploadProilePicture };
