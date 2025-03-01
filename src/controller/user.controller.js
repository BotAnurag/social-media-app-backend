import asyncHandler from "express-async-handler";

import userDetail from "../model/userDetails.model.js";
import { userPost } from "../model/userPost.model.js";

import otp from "../model/otp.model.js";

import { ApiError } from "../utils/ApiError.js";

import otpGenerate from "../utils/otpGenerate.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccesstokenRefreshtoken = async (userId) => {
  try {
    const user = await userDetail.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);

    throw new ApiError(500, "something went wrong while creating tokens");
  }
};

const alluser = asyncHandler(async (_, res) => {
  const user = await userDetail.find().select("-refreshToken -password");
  res.send(user);
});

const homePage = asyncHandler(async (req, res) => {});

const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const Detail = await userDetail.findById(userId).select("username");
  const post = await userPost.find({ user: userId, is: "Profile" });

  if (!Detail) {
    throw new ApiError(404, "user not register");
  }
  res.status(200).json(new ApiResponse(200, { Detail, post }, "found you"));
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
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
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
  const { username, dob, gender, email, password, onetimepass } = req.body;

  const present = await userDetail.findOne({
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

  if (user.expiresAt < current) {
    console.log("hi");
    await otp.deleteOne({ email: email });
    throw new ApiError(401, "OTP has expired. Please request a new one.");
  }

  if (email !== user.email || onetimepass !== user.pass) {
    throw new ApiError(401, "invalid email or otp ");
  }

  const profile = await userDetail.create({
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
    await otp.deleteOne({ email: email });
  }
  await userPost.create({
    user: profile._id,
    image: "https://www.pinterest.com/pin/95420085850914854/",
    is: "Profile",
    present: true,
  });
  res.status(200).json(new ApiResponse(200, "user created sucess fully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }
  const user = await userDetail.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found please register first");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "password incorrect");
  }
  const { accessToken } = await generateAccesstokenRefreshtoken(user._id);

  const options = {
    httponly: false,
    secure: false,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, user, "user login success"));
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user._id;
  console.log("hi");

  await userDetail.findByIdAndUpdate(
    user,
    {
      $set: { refreshToken: null },
    },
    {
      new: true,
    }
  );
  const option = {
    httponly: false,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, {}, "logout success"));
});

const searchUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  const users = await userDetail.find({
    username: { $regex: user, $options: "i" },
    status: "ACTIVE",
  });
  if (users.length < 1) {
    throw new ApiError(404, "user not found with given name");
  }
  res
    .status(200)
    .json(new ApiResponse(200, users, `number of hits:  ${users.length}`));
  // console.log(users);
});

export {
  homePage,
  registerUser,
  otpSender,
  loginUser,
  logout,
  getMyProfile,
  alluser,
  searchUser,
};
