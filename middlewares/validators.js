const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const { mongoose } = require("mongoose");
const dayjs = require("dayjs");

const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  let message = errors.array().map((error) => error.msg);
  message = new Set(message);
  message = [...message].join(" & ");

  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ID");
  }
  return true;
};

validators.isLongLatArray = (bodyParam) => {
  if (!Array.isArray(bodyParam)) throw new Error("Not an array of coordinates");
  const longtitude = bodyParam[0];
  const latitude = bodyParam[1];

  if (typeof longtitude !== "number" && typeof latitude !== "number")
    throw new Error("Invalid Coordinates");

  if (longtitude < -180 || longtitude > 180) {
    throw new Error("Invalid longtitude");
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }
  return true;
};

validators.isInThePast = (dateTime) => {
  if (dayjs(Date.now()).isAfter(dateTime))
    throw new Error("The time is in the past");
  return true;
};

module.exports = validators;
