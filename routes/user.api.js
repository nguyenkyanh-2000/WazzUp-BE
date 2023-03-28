const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");

/**
 * @route DELETE /users/me
 * @description Delete the user profile
 * @access Login required
 */

router.delete(
  "/me",
  authentication.loginRequired,
  userController.deleteCurrentUser
);

/**
 * @route GET /users/me
 * @description Get profile of the current user.
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route PUT /users/me
 * @description Update the profile of the current user.
 * @access Login required
 * @allowedBody biography, avatarUrl, location = {name, coordinates} (coordinates: LongLat)
 * @requiredBody name
 */

router.put(
  "/me",
  authentication.loginRequired,
  validators.validate([
    body("name", "Invalid name").exists().isString().notEmpty(),
    body("location.name", "Invalid location name").optional().isString(),
    body("location.coordinates", "Invalid location coordinates")
      .optional({ checkFalsy: true })
      .custom(validators.isLongLatArray),
    body("avatarUrl", "Invalid URL for avatar")
      .optional({ checkFalsy: true })
      .isURL(),
  ]),
  userController.updateCurrentUser
);

/**
 * @route GET /users/:id
 * @description Get a user by id.
 * @access Public
 */

router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getUserById
);

module.exports = router;
