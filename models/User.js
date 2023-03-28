const mongoose = require("mongoose");
const Event = require("./Event");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },

    pastEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    futureEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    avatarUrl: {
      type: String,
      require: false,
      default: "",
    },
    location: {
      name: { type: String },
      coordinates: {
        // [longtitude, latitude]
        type: [Number],
      },
    },
    biography: {
      type: String,
      require: false,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};

userSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
