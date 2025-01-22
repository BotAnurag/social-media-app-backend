import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userDetail",
    required: true,
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
  Comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "userDetail",
        required: true,
      },
      say: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const ImagePost = mongoose.model("profileImage", profileSchema);
