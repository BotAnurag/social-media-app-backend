import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userDetail from "../model/userDetails.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWt = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req.cookies);

    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "unauthorize request");
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userDetail
      .findById(decodeToken._id)
      .select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "invalid user");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("verify TOken ", error);

    throw new ApiError(401, "error varifying token");
  }
});
export default verifyJWt;
