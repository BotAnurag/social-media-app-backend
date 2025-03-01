import asyncHandler from "express-async-handler";
import { friendship } from "../model/friends.model.js";

import userDetail from "../model/userDetails.model.js";
import { userPost } from "../model/userPost.model.js";
import { ApiError } from "../utils/ApiError.js";

import Chat from "../model/chat.model.js";

const sideBarforFriends = asyncHandler(async (req, res) => {
  const me = req.user._id;

  // Find friendships where the user is either requester or recipient
  const friends = await friendship.find({
    $or: [{ requester: me }, { recipient: me }],
  });

  if (friends.length < 1) {
    throw new ApiError(404, "make friends first");
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
      const chat = await Chat.find();
      return { name, profile };
    })
  );

  res.send(side);
});

const getChat = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const chat = await Chat.find({});
});

const myChat = asyncHandler(async (req, res) => {
  const user = req.user._id; // Your user ID

  // Retrieve chats where the user is a participant
  const chats = await Chat.find({ participants: user }).populate(
    "participants",
    "_id username"
  );

  // Process each chat to extract the other user's details
  const chatsWithOtherUser = await Promise.all(
    chats.map(async (chat) => {
      // Find the other participant (excluding the logged-in user)
      const otherParticipant = chat.participants.find(
        (participant) => participant._id.toString() !== user.toString()
      );

      // Retrieve the profile image from userPost
      const profilePost = await userPost.findOne({
        user: otherParticipant._id,
        present: true,
        is: "Profile",
      });

      return {
        chatId: chat._id,
        userId: otherParticipant._id, // Other participant's ID
        chatname: otherParticipant.username, // Other participant's username
        image: profilePost ? profilePost.image : null, // Other participant's profile image
        lastMessage: chat.lastMessage, // Optional: Include last message if needed
      };
    })
  );

  res.send(chatsWithOtherUser);
});

export { sideBarforFriends, getChat, myChat };
