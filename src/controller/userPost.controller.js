import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Imageupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { ImagePost } from "../model/userPost.model.js";

import userDetail from "../model/userDetails.model.js";

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { discripion } = req.body;
  const user = await userDetail.findById(userId);

  if (!user) {
    throw new ApiError(404, "please register first");
  }
  let image = "";

  const profileimage = req.file?.path;

  image = await uploadOnCloudinary(profileimage);

  if (!image) {
    throw new ApiError(400, "fail to upload image");
  }
  const post = await ImagePost.create({
    user: userId._id,
    is: "Profile",
    image: image.url,
    discripion,
  });
  res.status(200).json(new ApiResponse(200, post, "success"));
});

const postPicture = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { discripion } = req.body;
  const user = await userDetail.findById(userId);

  if (!user) {
    throw new ApiError(404, "please register first");
  }
  let image = "";
  console.log(req.body);

  const profileimage = req.file?.path;

  if (profileimage) {
    image = await uploadOnCloudinary(profileimage);
  }

  if (!image) {
    throw new ApiError(400, "fail to upload image");
  }
  const post = await ImagePost.create({
    user: userId._id,
    is: "Post",
    image: image.url,
    discripion,
  });
  res.status(200).json(new ApiResponse(200, post, "success"));
});

const comment = asyncHandler(async (req, res) => {
  const { say, postId } = req.body;
  const userId = req.user._id;

  const user = await userDetail.findById(userId);
  if (!user) {
    throw new ApiError(404, "please register first");
  }
  const post = await ImagePost.findById(postId);
  if (!post) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "post all ready removed"));
  }
  const newComments = {
    user: userId,
    say,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  post.Comments.push(newComments);
  await post.save();

  res.status(200).json(new ApiResponse(200, {}, "comment posted"));
});

const like = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { postId } = req.body;
  const user = await userDetail.findById(userId);
  if (!user) {
    throw new ApiError(404, "please register first");
  }
  const post = await ImagePost.findById(postId);
  if (!post) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "post already removed"));
  }
  const newLike = {
    user: userId,
  };

  post.likes.push(newLike);
  await post.save();

  res.status(200).json(new ApiResponse(200, {}, "lie  added"));
});

export { uploadProfilePicture, comment, postPicture, like };
