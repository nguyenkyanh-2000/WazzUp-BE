const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    imageUrl: {
      type: String,
      require: false,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "messages",
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
