import asyncHandler from "express-async-handler";

import userProfileSchema from "../model/user.model.js";

import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary } from "../utils/Imageupload.js";

const homePage = asyncHandler((req, res) => {
  res.status(200).send("home page ");
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, dob, gender, email, password } = req.body;

  const profile = await userProfileSchema.create({
    username: username,
  });

  res.status(200).send(profile);
});

const uploadProilePicture = asyncHandler(
  asyncHandler(async (req, res) => {
    let image = "";
    console.log(req.body);

    const profileimage = req.file?.path;

    if (profileimage) {
      image = await uploadOnCloudinary(profileimage);
    }
  })
);

export { homePage, registerUser, uploadProilePicture };
