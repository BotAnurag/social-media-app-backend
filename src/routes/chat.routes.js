import verifyJWt from "../middleware/auth.middlewaer.js";

import {
  sideBarforFriends,
  getChat,
  myChat,
} from "../controller/chat.controller.js";

import { Router } from "express";

const router = Router();

router.route("/").get(verifyJWt, sideBarforFriends);

// router.route("/createChat").post(verifyJWt, createchate);
router.route("/chat").get(verifyJWt, getChat);
router.route("/mychat").get(verifyJWt, myChat);

export default router;
