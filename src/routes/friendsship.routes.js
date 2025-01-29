import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "../controller/friendship.controller.js";

import verifyJWt from "../middleware/auth.middlewaer.js";

import { Router } from "express";

const router = Router();

// friendship route

router.route("/friendrequest").post(verifyJWt, sendFriendRequest);

router.route("/acceptfriendrequest").patch(verifyJWt, acceptFriendRequest);

router.route("/declinefriendrequest").patch(verifyJWt, declineFriendRequest);

export default router;
