const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const eventController = require("../controllers/event.controller");
const commentController = require("../controllers/comment.controller");

/**
 * @route POST /events
 * @description Organize an event
 * @access login required
 * @requiredBody: name, location: {name, coordinates: [Long, Lat]}, time
 * @allowedBody: coverUrl, imagesUrls, description
 * @defaultAttendee: currentUser
 */

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("location.name", "Invalid location name")
      .exists()
      .notEmpty()
      .isString(),
    body("location.coordinates", "Invalid location coordinates").custom(
      validators.isLongLatArray
    ),
    body("time", "Invalid time")
      .exists()
      .notEmpty()
      .isISO8601()
      .custom(validators.isInThePast),
    body("coverUrl", "Not an URL").optional({ checkFalsy: true }).isURL(),
    body("imagesUrls", "One of the URLs is invalid")
      .optional({ checkFalsy: true })
      .isURL(),
  ]),
  eventController.createEvent
);

/**
 * @route PUT /events/:id
 * @description Update information about an event
 * @access login required, only organizer can update
 * @requiredBody: name, location: {name, coordinates: [Long, Lat]}, time
 * @allowedBody: coverUrl, imagesUrls, description
 */

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("name", "Invalid name").exists().notEmpty(),
    body("location.name", "Invalid location name")
      .exists()
      .notEmpty()
      .isString(),
    body("location.coordinates", "Invalid location coordinates").custom(
      validators.isLongLatArray
    ),
    body("time", "Invalid time")
      .exists()
      .notEmpty()
      .isISO8601()
      .custom(validators.isInThePast),
    ,
    body("coverUrl", "Not an URL").optional({ checkFalsy: true }).isURL(),
    body("imagesUrls", "One of the URLs is invalid")
      .optional({ checkFalsy: true })
      .isURL(),
  ]),
  eventController.updateEvent
);

/**
 * @route DELETE /events/:id
 * @description Delete an event
 * @access login required, only organizer can delete
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
  eventController.deleteEvent
);

/**
 * @route GET /events/:id
 * @description Get an event by id.
 * @access Public
 */

router.get(
  "/:id",
  validators.validate([
    param("id", "Invalid Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  eventController.getEventById
);

/**
 * @route GET /events/
 * @description Get events by query
 * @access Public
 * @allowedQueries: keyword, latLng, kmDistance (default = 5km), from, to, sortBy (default = timeDescending), page (default = 1), limit (default = 1)
 * @allowedSortBy: "nameAscending","nameDescending", "timeAscending", "timeDescending", "nearestDate", "" (timeDescending)
 */

router.get(
  "/",
  validators.validate([
    query("keyword", "Invalid keyword")
      .optional({ checkFalsy: true })
      .isString(),
    query("latLng", "Invalid latitudes and longtitudes").optional().isLatLong(),
    query("kmDistance", "Invalid distance in kilometers to location")
      .optional({ checkFalsy: true })
      .isNumeric(),
    query("from", "Invalid (From) Date")
      .optional({ checkFalsy: true })
      .isISO8601(),
    query("to", "Invalid (To) Date").optional({ checkFalsy: true }).isISO8601(),
    query("sortBy", "Invalid Sort By")
      .optional()
      .isString()
      .isIn([
        "nameAscending",
        "nameDescending",
        "timeAscending",
        "timeDescending",
        "nearestDate",
        "",
      ]),
  ]),
  eventController.getEventsByFilter
);

/**
 * @router GET /events/:id/comments
 * @description Get all comments for an event
 * @access Public
 */

router.get(
  "/:id/comments",
  validators.validate([
    param("id", "Invalid Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.getCommentsFromEvent
);

/**
 * @route POST /events/attend/:id
 * @description Attend an event
 * @access login required
 * @defaultAttendee: currentUser
 */

router.post(
  "/attend/:id",
  authentication.loginRequired,
  validators.validate([
    param("id", "Invalid Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  eventController.attendEvent
);

/**
 * @route POST /events/attend/:id
 * @description Unattend an event
 * @access login required
 * @defaultAttendee: currentUser
 */

router.post(
  "/unattend/:id",
  authentication.loginRequired,
  validators.validate([
    param("id", "Invalid Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  eventController.unattendEvent
);

module.exports = router;
