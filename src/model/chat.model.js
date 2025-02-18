import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  friendshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "friendship",
  },
  isGroupchat: {
    type: Boolean,
    default: false,
  },
  chatname: {
    type: String,
    trim: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDetail",
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
});
const Chat = mongoose.model("chat", chatSchema);

export default Chat;
