const { AppError, sendResponse } = require("../helpers/utils");
const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");

const authService = {};

authService.loginWithEmail = async (email, password) => {
  const user = await userService.getUserByFilter({ email }, "+password");
  if (!user || !(await user.isPasswordMatched(password)))
    throw new AppError(400, "Invalid credentials", "Login with email error");
  const accessToken = await user.generateToken();

  return { user, accessToken };
};

authService.registerWithEmail = async (accountInfo) => {
  let { name, email, password } = accountInfo;

  if (await userService.doesUserExist(email))
    throw new AppError(400, "Duplicate user", "Register with email error");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const newUser = await userService.createUser({ name, email, password });

  const accessToken = await newUser.generateToken();

  return { newUser, accessToken };
};

module.exports = authService;
