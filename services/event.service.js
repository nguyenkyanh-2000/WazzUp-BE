const Event = require("../models/Event");
const User = require("../models/User");
const {
  AppError,
  timeUntilToday,
  latLngStringToLngLatArray,
} = require("../helpers/utils");
const userService = require("./user.service");
const Comment = require("../models/Comment");

const eventService = {};

eventService.getEventById = async (eventId) => {
  try {
    const event = await Event.findOne({ _id: eventId });
    if (!event)
      throw new AppError(400, "Event not found", "Get event by ID error");
    return event;
  } catch (error) {
    throw new AppError(400, error.message, "Get event by ID error");
  }
};

eventService.getEventsByFilter = async (filter, options) => {
  const { page, limit, sortBy } = options;
  const {
    keyword,
    latLng,
    from: fromDate,
    to: toDate,
    kmDistance: kmDistanceToLatLng = 5,
  } = filter;
  const filterConditions = [];

  // Filter based on keyword in event's name and location's name
  if (keyword)
    filterConditions.push({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { "location.name": { $regex: keyword, $options: "i" } },
      ],
    });

  // Filter event based on the time between 2 moments ("from" & "to")
  if (fromDate) {
    filterConditions.push({ ["time"]: { $gt: fromDate } });
  }
  if (toDate) {
    filterConditions.push({ ["time"]: { $lt: toDate } });
  }

  // Find nearby events based on the coordinates (latLng) provided. Default radius: 5km, Earth radius: 6378.1 km,
  if (latLng) {
    filterConditions.push({
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [
            latLngStringToLngLatArray(latLng),
            kmDistanceToLatLng / 6378.1,
          ],
        },
      },
    });
  }

  const filterCriteria =
    filterConditions.length > 0 ? { $and: filterConditions } : {};

  // Allowed sortBy: "nameAscending", "nameDescending", "timeAscending", "timeDescending", "nearestDate". Default: timeDescending
  switch (sortBy) {
    case "nameAscending":
      sortOrder = { name: "asc" };
      break;
    case "nameDescending":
      sortOrder = { name: "desc" };
      break;
    case "timeAscending":
      sortOrder = { time: "asc" };
      break;
    case "timeAscending":
      sortOrder = { time: "desc" };
      break;
    case "nearestDate":
      sortOrder = {};
    default:
      sortOrder = { time: "desc" };
      break;
  }

  // Pagination
  const count = await Event.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const events = await Event.find(filterCriteria)
    .sort(sortOrder)
    .skip(offset)
    .limit(limit);

  // Sort by Nearest Date
  if (sortBy === "nearestDate") {
    events.sort(function (event1, event2) {
      return timeUntilToday(event1.time) - timeUntilToday(event2.time);
    });
  }

  return { events, count, totalPages };
};

eventService.createEvent = async (userId, eventInfo) => {
  try {
    const { name, location, time, coverUrl, imagesUrls, description } =
      eventInfo;

    const newEvent = await Event.create({
      name,
      location,
      time,
      coverUrl,
      imagesUrls,
      description,
      organizer: userId,
      attendees: [userId],
    });

    return newEvent;
  } catch (error) {
    throw new AppError(400, error.message, "Create event error");
  }
};

eventService.updateEvent = async (userId, eventId, eventInfo) => {
  try {
    const event = await Event.findOne({
      _id: eventId,
      isFinished: false,
    });

    if (!event)
      throw new AppError(400, "Event not found", "Get event by ID error");

    if (event.organizer.toString() !== userId)
      throw new AppError(400, "Not an organizer", "Update event error");

    allowedFields = [
      "name",
      "location",
      "time",
      "coverUrl",
      "imagesUrls",
      "description",
    ];
    allowedFields.forEach((field) => {
      event[field] = eventInfo[field];
    });

    await event.save();

    return event;
  } catch (error) {
    throw new AppError(400, error.message, "Update event error");
  }
};

eventService.deleteEvent = async (userId, eventId) => {
  try {
    const event = await Event.findOne({ _id: eventId });
    if (!event)
      throw new AppError(400, "Event not found", "Get event by ID error");
    if (event.organizer.toString() !== userId)
      throw new Error("Not the organizer");

    await User.updateMany(
      { futureEvents: eventId },
      { $pull: { futureEvents: eventId } }
    );

    await User.updateMany(
      { pastEvents: eventId },
      { $pull: { pastEvents: eventId } }
    );

    await Comment.deleteMany({ event: eventId });

    const result = await Event.deleteOne({ _id: eventId });
    return result;
  } catch (error) {
    throw new AppError(400, error.message, "Delete event error");
  }
};

eventService.addUserToEvent = async function (userId, eventId) {
  try {
    const user = await userService.getUserById(userId);

    const event = await Event.findOne({
      _id: eventId,
      isFinished: false,
    });

    if (!event)
      throw new AppError(
        400,
        "Event not found or already finished",
        "Add user to event error"
      );

    if (user.futureEvents.includes(eventId) && event.attendees.includes(userId))
      throw new AppError(
        400,
        "User already in the event",
        "Add user to event error"
      );

    if (!user.futureEvents.includes(eventId)) user.futureEvents.push(eventId);

    if (!event.attendees.includes(userId)) event.attendees.push(userId);

    await user.save();
    await event.save();

    return true;
  } catch (error) {
    throw new AppError(400, error.message, "Add user to event error");
  }
};

eventService.removeUserFromEvent = async function (userId, eventId) {
  try {
    const user = await userService.getUserById(userId);
    const event = await Event.findOne({
      _id: eventId,
      isFinished: false,
    });

    if (!event)
      throw new AppError(
        400,
        "Event not found or already finished",
        "Remove user from event error"
      );

    if (
      !user.futureEvents.includes(eventId) &&
      !event.attendees.includes(userId)
    )
      throw new AppError(
        400,
        "User not in the event",
        "Remove user from event error"
      );

    // If user is the organizer of the event => Denied
    if (event.organizer === userId)
      throw new AppError(
        400,
        "User is the organizer, please delete event instead"
      );

    if (user.futureEvents.includes(eventId)) user.futureEvents.pull(eventId);
    if (event.attendees.includes(userId)) event.attendees.pull(userId);

    await user.save();
    await event.save();

    return true;
  } catch (error) {
    throw new AppError(400, error.message, "Remove user from event error");
  }
};

module.exports = eventService;
