import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const userProfileSchema = new mongoose.model("userProfileSchema", userSchema);

export default userProfileSchema;
