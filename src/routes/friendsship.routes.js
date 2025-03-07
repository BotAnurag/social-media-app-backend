import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  searchFriends,
  getAllFriendRequest,
  sideBarforFriends,
} from "../controller/friendship.controller.js";

import verifyJWt from "../middleware/auth.middlewaer.js";

import { Router } from "express";

const router = Router();

// friendship route

router.route("/allrequest").get(verifyJWt, getAllFriendRequest);
router.route("/friendrequest").post(verifyJWt, sendFriendRequest);

router.route("/acceptfriendrequest").patch(verifyJWt, acceptFriendRequest);

router.route("/declinefriendrequest").patch(verifyJWt, declineFriendRequest);

router.route("/getallFriends").get(verifyJWt, sideBarforFriends);

router.route("/search").get(verifyJWt, searchFriends);

export default router;
