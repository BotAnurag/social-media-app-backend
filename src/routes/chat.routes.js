import verifyJWt from "../middleware/auth.middlewaer.js";

import { sideBarforFriends, getChat } from "../controller/chat.controller.js";

import { Router } from "express";

const router = Router();

router.route("/").get(verifyJWt, sideBarforFriends);
router.route("/chat").post(verifyJWt, getChat);

export default router;
