import { friendship } from "../model/friends.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import Chat from "../model/chat.model.js";

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
  // sending the object id of request not the user
  const { request } = req.body;
  const existRequest = await friendship.findById(request);
  if (!existRequest) {
    throw new ApiError(400, "Request already  removed");
  }
  existRequest.status = "ACCEPTED";
  await existRequest.save();

  const user1 = existRequest.requester;
  const user2 = existRequest.recipient;

  let chat = await Chat.findOne({
    participants: { $all: [user1, user2] },
  });

  if (!chat) {
    // Create a new chat if it doesn't exist
    chat = new Chat({
      participants: [user1, user2],
    });
  }

  await chat.save(); // Save the chat document

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
