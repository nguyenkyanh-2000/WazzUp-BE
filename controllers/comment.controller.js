const { sendResponse, AppError } = require("../helpers/utils");
const commentService = require("../services/comment.service");

const commentController = {};

commentController.createComment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const comment = await commentService.createComment(userId, req.body);

    return sendResponse(
      res,
      200,
      true,
      comment,
      null,
      "Create comment successful"
    );
  } catch (error) {
    next(error);
  }
};

commentController.updateComment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const comment = await commentService.updateComment(userId, id, req.body);

    return sendResponse(
      res,
      200,
      true,
      comment,
      null,
      "Update comment successful"
    );
  } catch (error) {
    next(error);
  }
};

commentController.getCommentsFromEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await commentService.getCommentsFromEvent(id);

    return sendResponse(
      res,
      200,
      true,
      { comments },
      null,
      "Get comments from event successful"
    );
  } catch (error) {
    next(error);
  }
};

commentController.deleteCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await commentService.deleteCommentById(userId, id);

    return sendResponse(
      res,
      200,
      true,
      comment,
      null,
      "Delete comment by ID successful"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = commentController;
