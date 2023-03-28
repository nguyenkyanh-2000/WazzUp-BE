const { sendResponse, AppError } = require("../helpers/utils");
const authService = require("../services/auth.service");

const authController = {};

// Register a new user
authController.register = async (req, res, next) => {
  try {
    const { newUser, accessToken } = await authService.registerWithEmail(
      req.body
    );
    sendResponse(
      res,
      200,
      true,
      { newUser, accessToken },
      null,
      "Register User Successfully"
    );
  } catch (error) {
    next(error);
  }
};

authController.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.loginWithEmail(
      email,
      password
    );
    sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Login Successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = authController;
