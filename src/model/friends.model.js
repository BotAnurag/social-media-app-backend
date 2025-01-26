import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.ObjectId,
      ref: "userDetail",
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: "userDetail",
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "PENDING", "DECLINED", "BLOCKED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export const friendship = mongoose.model("friendship", friendshipSchema);
