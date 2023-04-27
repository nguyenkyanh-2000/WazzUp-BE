const User = require("../models/User");
const Event = require("../models/Event");
const { AppError, sendResponse } = require("../helpers/utils");

const userService = {};

userService.doesUserExist = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user) return true;
    else return false;
  } catch (error) {
    throw new AppError(400, error.message, "Check user existence error");
  }
};

userService.getUserById = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user)
      throw new AppError(400, "User not found", "Get user by ID error");
    return user;
  } catch (error) {
    throw new AppError(400, error.message, "Get user by ID error");
  }
};

userService.getUserByFilter = async (filter, options) => {
  try {
    const user = await User.findOne(filter, options);
    if (!user)
      throw new AppError(400, "User not found", "Get user by filter error");
    return user;
  } catch (error) {
    throw new AppError(400, error.message, "Get user by filter error");
  }
};

userService.updateUserById = async function (userId, updatedInfo) {
  try {
    const user = await this.getUserById(userId);
    // Allowed fields based on User schema / api
    const allowedFields = ["name", "biography", "avatarUrl", "location"];
    allowedFields.forEach((field) => {
      user[field] = updatedInfo[field];
    });

    await user.save();
    return user;
  } catch (error) {
    throw new AppError(400, error.message, "Update user by ID error");
  }
};

userService.deleteUser = async function (userId) {
  try {
    // Check whether user exists?
    await this.getUserById(userId);
    const result = await User.deleteOne({ _id: userId });
    await Event.deleteMany({ organizer: userId });
    await Event.updateMany(
      { attendees: userId },
      { $pull: { attendees: userId } }
    );
    return result;
  } catch (error) {
    throw new AppError(400, error.message, "Delete user error");
  }
};

userService.createUser = async (userInfo) => {
  try {
    const { name, email, password } = userInfo;
    const user = await User.create({ name, email, password });

    await user.save();
    return user;
  } catch (error) {
    throw new AppError(400, error.message, "Update user by ID error");
  }
};

module.exports = userService;
