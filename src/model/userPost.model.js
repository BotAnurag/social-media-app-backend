import mongoose from "mongoose";

const commentScheam = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userDetail",
    required: true,
  },
  say: {
    type: String,
    required: true,
  },
});

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "userDetail",
    },
    present: {
      type: Boolean,
      default: false,
    },
    is: {
      type: String,
      enum: ["Profile", "Post"],
    },
    image: {
      type: String,
    },
    discripion: {
      type: String,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "userDetail",
        },
      },
    ],
    comments: [commentScheam],
  },
  {
    timestamps: true,
  }
);

export const userPost = mongoose.model("userPost", PostSchema);
