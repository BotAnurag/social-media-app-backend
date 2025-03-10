import { friendship } from "../model/friends.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import Chat from "../model/chat.model.js";

import { userPost } from "../model/userPost.model.js";

import asyncHandler from "express-async-handler";

import userDetail from "../model/userDetails.model.js";

const getAllFriendRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const request = await friendship.find({
    recipient: userId,
    status: "PENDING",
  });
  if (!request) {
    throw new ApiError(404, "no request found");
  }
  res.status(200).json(new ApiResponse(200, request, "request found"));
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  const from = req.user._id;
  const { to } = req.body;

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
  res
    .status(200)
    .json(new ApiResponse(200, { newRequest }, "request send success fully"));
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  // sending the object id of request not the user
  const { request } = req.body;
  const userId = req.user._id;

  const existRequest = await friendship.findById(request);

  if (!existRequest) {
    throw new ApiError(400, "Request already  removed");
  }
  if (userId.toString() === existRequest.requester.toString()) {
    throw new ApiError(400, "You cannot accept your own friend request");
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

  await chat.save();

  res.status(200).json(new ApiResponse(200, { chat }, "request accepted"));
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

const sideBarforFriends = asyncHandler(async (req, res) => {
  const me = req.user._id;

  // Find friendships where the user is either requester or recipient
  const friends = await friendship.find({
    $or: [{ requester: me }, { recipient: me }],
  });

  if (friends.length < 1) {
    throw new ApiError(404, "[]");
  }

  // Extract unique friend IDs and store friendshipId
  const friendList = friends.map((friend) => ({
    friendId:
      friend.requester._id.toString() === me.toString()
        ? friend.recipient._id
        : friend.requester._id,
  }));

  const uniqueFriends = [
    ...new Map(friendList.map((f) => [f.friendId.toString(), f])).values(),
  ];
  console.log(uniqueFriends);

  // Fetch user details and profile pictures
  const side = await Promise.all(
    uniqueFriends.map(async ({ friendId }) => {
      const name = await userDetail.findById(friendId).select("_id username");
      const profile = await userPost
        .findOne({
          user: friendId,
          present: true,
          is: "Profile",
        })
        .select("image");
      return { name, profile };
    })
  );

  res
    .status(200)
    .json(new ApiResponse(200, { side }, `total num ${side.length}`));
});

const mySendRequest = asyncHandler(async (req, res) => {
  try {
    const me = req.user._id;
    const myRequest = await friendship.find({
      requester: me,
      status: "PENDING",
    });

    console.log("my request", myRequest);

    const userWithProfile = Promise.all(
      myRequest.map(async (u) => {
        return u.recipient;
      })
    );
    return res.send(userWithProfile);
    if (userWithProfile < 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "no request has been send"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userWithProfile,
          `num of request: ${userWithProfile.length}`
        )
      );
  } catch (error) {
    throw new ApiError(404, `error : ${error}`);
  }
});

const searchFriends = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const searchQuery = req.query.name || ""; // Get search query from request
  console.log(searchQuery);

  // Fetch accepted friendships
  const friends = await friendship.find({
    $or: [{ requester: me }, { recipient: me }],
    status: "ACCEPTED",
  });

  if (friends.length < 1) {
    throw new ApiError(404, "Make friends first");
  }

  // Extract friend IDs
  const friendList = friends.map((friend) =>
    friend.requester._id.toString() === me.toString()
      ? friend.recipient
      : friend.requester
  );

  const uniqueFriendIds = [
    ...new Set(friendList.map((friend) => friend.toString())),
  ];

  // Fetch user details for friends matching the search query
  const users = await Promise.all(
    uniqueFriendIds.map(async (friendId) => {
      const name = await userDetail
        .findOne({
          _id: friendId,
          username: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
        })
        .select("username");

      if (!name) return null; // Skip if no match

      const profile = await userPost
        .findOne({
          user: friendId,
          present: true,
          is: "Profile",
        })
        .select("image");

      return { name, profile };
    })
  );

  // Filter out null values (users who didn't match the search query)
  const filteredUsers = users.filter((user) => user !== null);

  res.send(filteredUsers);
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  blockUser,
  searchFriends,
  getAllFriendRequest,
  sideBarforFriends,
  mySendRequest,
};
