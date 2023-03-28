const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        require: true,
      },
    ],
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "conversations",
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
