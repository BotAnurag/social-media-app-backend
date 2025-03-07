import asyncHandler from "express-async-handler";

import userDetail from "../model/userDetails.model.js";
import { userPost } from "../model/userPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

import Chat from "../model/chat.model.js";

const getChat = asyncHandler(async (req, res) => {
  try {
    const me = req.user._id;
    const chat = await Chat.find({});
  } catch (error) {}
});

const createGroupChat = asyncHandler(async (req, res) => {
  try {
    const { users } = req.body;
    // Validate ObjectIds
    users.push(req.user._id);
    const validUsers = users.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validUsers.length < 2) {
      throw new ApiError(400, "must be  2 or more users");
    }
    const name = validUsers.join(",");

    const chat = await Chat.create({
      chatImage:
        "https://pixabay.com/photos/ring-tailed-lemur-lemur-group-cub-6954076/",
      chatname: name,
      isGroupchat: true,
      participants: validUsers, // Assign only valid ObjectIds
    });

    await chat.save();

    res.status(200).json(new ApiResponse(200, chat._id, "chat created"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "error while creating a group", error: error.message });
  }
});

const myChatSidebar = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id; // Your user ID

    console.log("hello");

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

        if (chat.isGroupchat === true) {
          return {
            chatname: chat.chatname,
            chatImage: chat.chatImage,
            lastMessage: chat.lastMessage,
          };
        }

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
  } catch (error) {
    console.log(`my chat error`, error);
    throw new ApiError(500, `error while retriving your chats  ${error} `);
  }
});

const getAllChats = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.find();
    res.status(200).json(new ApiResponse(200, { chat }, `${chat.length}`));
  } catch (error) {
    throw new ApiError(500, `${error}`);
  }
});

export { getChat, myChatSidebar, createGroupChat, getAllChats };
