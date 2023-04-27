const { AppError } = require("../helpers/utils");
const Comment = require("../models/Comment");
const Event = require("../models/Event");

const commentService = {};

commentService.createComment = async (userId, commentInfo) => {
  try {
    const { eventId, content } = commentInfo;

    const event = await Event.findOne({ _id: eventId, attendees: userId });

    if (!event)
      throw new Error("Event does not exist or commenter not in the event");

    const comment = await Comment.create({
      event: eventId,
      commenter: userId,
      content: content,
    });

    comment.save();
    return comment;
  } catch (error) {
    throw new AppError(400, error.message, "Create comment error");
  }
};

commentService.updateComment = async (userId, commentId, commentInfo) => {
  try {
    const { content } = commentInfo;
    const comment = await Comment.findById(commentId);

    if (!comment) throw new Error("Comment does not exist or deleted");

    if (comment.commenter.toString() !== userId)
      throw new Error("Insufficient right to update comment");

    comment.content = content;
    comment.save();

    return { comment };
  } catch (error) {
    throw new AppError(400, error.message, "Update comment error");
  }
};

commentService.getCommentsFromEvent = async (eventId) => {
  try {
    const comments = await Comment.find({ event: eventId }).populate(
      "commenter"
    );
    return comments;
  } catch (error) {
    throw new AppError(400, error.message, "Get comments from an event error");
  }
};

commentService.deleteCommentById = async (userId, commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment does not exist or deleted");

    if (comment.commenter.toString() !== userId)
      throw new Error("Insufficient right to update comment");

    const result = await Comment.findByIdAndDelete(commentId);
    return result;
  } catch (error) {
    throw new AppError(
      400,
      error.message,
      "Delete a comment from an event error"
    );
  }
};
module.exports = commentService;
