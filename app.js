var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const { AppError, sendResponse } = require("./helpers/utils");

var indexRouter = require("./routes/index");
const authRouter = require("./routes/auth.api");
const userRouter = require("./routes/user.api");
const eventRouter = require("./routes/event.api");
const commentRouter = require("./routes/comment.api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/comments", commentRouter);

/* DB connection*/
const mongoURI = process.env.MONGODB_URI;
const dbName = "wazzupDB";

mongoose
  .connect(mongoURI, { dbName: dbName })
  .then(() => console.log(`DB connected: ${dbName}`))
  .catch((err) => console.log(err));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;
