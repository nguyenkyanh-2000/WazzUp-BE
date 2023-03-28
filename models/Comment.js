const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    commenter: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "comments",
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
