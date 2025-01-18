import mongoose from "mongoose";

import jwt from "jsonwebtoken";

import bcryptjs from "bcryptjs";
import { strict } from "assert";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Femail"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.method.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

const userProfileSchema = new mongoose.model("userProfileSchema", userSchema);

export default userProfileSchema;
