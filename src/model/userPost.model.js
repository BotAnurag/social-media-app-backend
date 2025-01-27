import mongoose from "mongoose";

const commentScheam = new mongoose.Schema({
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
      replies: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "userDetail",
            required: true,
          },
          say: {
            type: String,
          },
        },
      ],
    },
  ],
});

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
  commenst: [commentScheam],
});

export const ImagePost = mongoose.model("profileImage", profileSchema);
