import verifyJWt from "../middleware/auth.middlewaer.js";

import { sideBarforFriends } from "../controller/chat.controller.js";

import { Router } from "express";

const router = Router();

router.route("/").get(verifyJWt, sideBarforFriends);

export default router;
