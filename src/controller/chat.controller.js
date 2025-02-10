import asyncHandler from "express-async-handler";
import { friendship } from "../model/friends.model.js";

import userDetail from "../model/userDetails.model.js";
import { userPost } from "../model/userPost.model.js";
import { ApiError } from "../utils/ApiError.js";

const sideBarforFriends = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const friends = await friendship.find({
    $or: [{ requester: me }, { recipient: me }],
    status: "ACCEPTED",
  });

  if (friends.length < 1) {
    throw new ApiError(404, "make friends first");
  }
  const friendList = friends.map((friend) => {
    return friend.requester._id.toString() === me.toString()
      ? friend.recipient
      : friend.requester;
  });

  const uniqueFriendId = [...new Set(friendList)];

  console.log(uniqueFriendId);

  const friendDetail = await userDetail
    .find({ _id: { $in: uniqueFriendId } })
    .select("username");
  const userPosts = await userPost.find({
    user: {
      $in: { uniqueFriendId },
    },
    is: "Profile",
  });
  const combineResult = friendDetail.map((user) => {
    const userImage = userPosts.find(
      (post) => post.user.toString() === user._id.toString()
    );
    return { ...user.toObject(), image: userImage ? userImage.image : null };
  });
  res.send(combineResult);
});

export { sideBarforFriends };
