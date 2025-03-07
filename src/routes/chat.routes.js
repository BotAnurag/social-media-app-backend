import verifyJWt from "../middleware/auth.middlewaer.js";

import {
  getChat,
  myChatSidebar,
  createGroupChat,
  getAllChats,
} from "../controller/chat.controller.js";

import { Router } from "express";

const router = Router();

// router.route("/createChat").post(verifyJWt, createchate);
router.route("/chat").get(verifyJWt, getChat);
router.route("/mychat").get(verifyJWt, myChatSidebar);
router.route("/creategroupchat").post(verifyJWt, createGroupChat);

router.route("/all").get(getAllChats);

export default router;
