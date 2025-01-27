import { friendship } from "../model/friends.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import asyncHandler from "express-async-handler";

const sendFriendRequest = asyncHandler(async (req, res) => {
  const from = req.user._id;
  const { to } = req.body;
  console.log(`from ${from}     to ${to}`);

  if (from.toString() === to.toString()) {
    throw new ApiError(400, "cannot send request to yourself");
  }
  const existRequest = await friendship.findOne({
    $or: [
      {
        requester: from,
        recipient: to,
      },
      {
        requester: to,
        recipient: from,
      },
    ],
  });

  if (existRequest) {
    throw new ApiError(409, "request already exist");
  }
  const newRequest = await friendship.create({
    requester: from,
    recipient: to,
  });
  if (!newRequest) {
    throw new ApiError(400, "error while sending request");
  }
  res.status(200).json(new ApiResponse(200, {}, "request send success fully"));
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { request } = req.body;
  const existRequest = await friendship.findById(request);
  if (!existRequest) {
    throw new ApiError(400, "Request already  removed");
  }
  existRequest.status = "ACCEPTED";
  await existRequest.save();
  res.status(200).json(new ApiResponse(200, {}, "request accepted"));
});

const declineFriendRequest = asyncHandler(async (req, res) => {
  const { request } = req.body;
  const existRequest = await friendship.findById(request);
  if (!existRequest) {
    throw new ApiError(400, "Request already  removed");
  }
  if (existRequest.status === "ACCEPTED") {
    throw new ApiError(400, "Request already  accepted cannto decline ");
  }
  existRequest.status = "DECLINED";
  await existRequest.save();
  res.status(200).json(new ApiResponse(200, {}, "request declineF"));
});

const blockUser = asyncHandler(async (req, res) => {
  const from = req.user._id;
  const { to } = req.body;
  console.log(`from ${from}     to ${to}`);

  if (from.toString() === to.toString()) {
    throw new ApiError(400, "block yourself");
  }
  let friends = await friendship.findOne({
    $or: [
      {
        requester: from,
        recipient: to,
      },
      {
        requester: to,
        recipient: from,
      },
    ],
  });
  if (friends) {
    friends.status = "BLOCKED";
    await friends.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "friend blocked successfully"));
  }
  friends = new friendship({
    requester: from,
    recipient: to,
    status: "BLOCKED",
  });
  await friends.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "user blocked successfully"));
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  blockUser,
};
