import asyncHandler from "express-async-handler";
import { friendship } from "../model/friends.model.js";

import userDetail from "../model/userDetails.model.js";
import { userPost } from "../model/userPost.model.js";
import { ApiError } from "../utils/ApiError.js";

const sideBarforFriends = asyncHandler(async (req, res) => {
  const me = req.user._id;
  console.log(me);

  // Find friendships where the user is either requester or recipient
  const friends = await friendship.find({
    $or: [{ requester: me }, { recipient: me }],
  });

  console.log(friends);

  if (friends.length < 1) {
    throw new ApiError(404, "make friends first");
  }

  // Extract unique friend IDs and store friendshipId
  const friendList = friends.map((friend) => ({
    friendId:
      friend.requester._id.toString() === me.toString()
        ? friend.recipient._id
        : friend.requester._id,
    friendshipId: friend._id,
  }));

  const uniqueFriends = [
    ...new Map(friendList.map((f) => [f.friendId.toString(), f])).values(),
  ];

  console.log(uniqueFriends);

  // Fetch user details and profile pictures
  const side = await Promise.all(
    uniqueFriends.map(async ({ friendId, friendshipId }) => {
      const name = await userDetail.findById(friendId).select("_id username");
      const profile = await userPost.findOne({
        user: friendId,
        present: true,
        is: "Profile",
      });

      return { friendshipId, name, profile };
    })
  );

  res.send(side);
});

const getChat = asyncHandler(async (req, res) => {});

export { sideBarforFriends, getChat };
