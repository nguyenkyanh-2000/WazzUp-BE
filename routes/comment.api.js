const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const commentController = require("../controllers/comment.controller");

/**
 * @route POST /comments
 * @description Create a comment
 * @access login required
 * @requiredBody: {content, eventId}
 * @defaultCommenter: currentUser
 */

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Empty comment not allowed").exists().notEmpty().isString(),
    body("eventId", "Invalid Event ID")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.createComment
);

/**
 * @route PUT /comments/:id
 * @description Update a comment
 * @access Login required, only commenter can update their own comments
 * @requiredBody: {content}
 */

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id", "Invalid Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
    body("content", "Invalid content").exists().notEmpty().isString(),
  ]),
  commentController.updateComment
);

/**
 * @route DELETE /comments/:id
 * @description Delete a comment from an event
 * @access Login required, Only commenter can delete their own comments
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id", "Invalid Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.deleteCommentById
);
module.exports = router;
