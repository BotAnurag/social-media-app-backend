import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
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
