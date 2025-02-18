import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Imageupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { userPost } from "../model/userPost.model.js";

import userDetail from "../model/userDetails.model.js";
import { Types } from "mongoose";

const uploadProfilePicture = asyncHandler(async (req, res) => {
  let image = "";
  const userId = req.user;
  const { discripion } = req.body;
  const user = await userDetail.findById(userId);

  if (!user) {
    throw new ApiError(404, "please register first");
  }

  const profileimage = req.file?.path;

  image = await uploadOnCloudinary(profileimage);

  if (!image) {
    throw new ApiError(400, "fail to upload image");
  }
  await userPost.updateMany(
    { user: userId, present: true },
    { $set: { present: false } }
  );
  const post = await userPost.create({
    user: userId._id,
    is: "Profile",
    image: image.url,
    present: true,
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
  const post = await userPost.create({
    user: userId._id,
    is: "Post",
    image: image.url,
    discripion,
  });
  res.status(200).json(new ApiResponse(200, post, "success"));
});

const postStatus = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const user = await userDetail.findById(owner);

  if (!user) {
    throw new ApiError(400, "user doesnot exit please register first");
  }
  const post = await userPost.create({
    user: owner,
    is: "Post",
    image: null,
    discripion,
  });
});

const comment = asyncHandler(async (req, res) => {
  const { say, postId } = req.body;
  const userId = req.user._id;
  console.log(postId, say);

  const user = await userDetail.findById(userId);
  if (!user) {
    throw new ApiError(404, "please register first");
  }
  const post = await userPost.findById(postId);
  if (!post) {
    throw new ApiError(400, "post not founds");
  }
  const newComments = {
    user: userId,
    say,
  };
  post.comments.push(newComments);
  await post.save();

  res.status(200).json(new ApiResponse(200, post, "comment posted"));
});

const postDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "inavalid id formate");
  }
  const post = await userPost.findById(id);
  if (!post) {
    throw new ApiError(400, "post not found");
  }
  res.status(200).json(200, post, "");
});

const replyOnComment = asyncHandler(async (req, res) => {
  const { commentID } = req.body;
  const user = req.user._id;
});

const like = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { postId } = req.body;
  const user = await userDetail.findById(userId);
  if (!user) {
    throw new ApiError(404, "please register first");
  }
  const post = await userPost.findById(postId);
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

const getMyPosts = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const myDetail = await userDetail
    .findById(me)
    .select(" -password -refreshToken");
  console.log(myDetail);

  if (!myDetail) {
    throw new ApiError(400, "user not found ");
  }
  const myPosts = await userPost.find({ user: me });

  res.status(200).json(new ApiResponse(200, { myDetail, myPosts }, ""));
});

export {
  uploadProfilePicture,
  comment,
  postPicture,
  like,
  replyOnComment,
  postDetails,
  postStatus,
  getMyPosts,
};
