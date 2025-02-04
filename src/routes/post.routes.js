import {
  uploadProfilePicture,
  comment,
  postPicture,
  like,
  postDetails,
  postStatus,
  getMyPosts,
} from "../controller/userPost.controller.js";

// post routes

import { Router } from "express";

import upload from "../middleware/multer.middleware.js";

import verifyJWt from "../middleware/auth.middlewaer.js";
const router = Router();

//  /profile
router.route("/me").get(verifyJWt, getMyPosts);

// /post
router
  .route("/uploadProfilePic")
  .post(verifyJWt, upload.single("image"), uploadProfilePicture);

router.route("/uploadPic").post(verifyJWt, upload.single("image"), postPicture);

router.route("/statu").post(verifyJWt, postStatus);

router.route("/comment").patch(verifyJWt, comment);

router.route("/like").patch(verifyJWt, like);

router.route("/:id").get(verifyJWt, postDetails);
export default router;
