const { sendResponse, AppError } = require("../helpers/utils");
const userService = require("../services/user.service");
const userController = {};

userController.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    return sendResponse(
      res,
      200,
      true,
      user,
      null,
      "Get user by ID successful"
    );
  } catch (error) {
    next(error);
  }
};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await userService.getUserById(userId);

    return sendResponse(
      res,
      200,
      true,
      user,
      null,
      "Get user by ID successful"
    );
  } catch (error) {
    next(error);
  }
};

userController.updateCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await userService.updateUserById(userId, req.body);
    return sendResponse(
      res,
      200,
      true,
      user,
      null,
      "Update current user successful"
    );
  } catch (error) {
    next(error);
  }
};

userController.deleteCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await userService.deleteUser(userId);

    return sendResponse(
      res,
      200,
      true,
      user,
      null,
      "Delete current user successful"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
