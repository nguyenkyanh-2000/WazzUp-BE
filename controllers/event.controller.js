const { sendResponse, AppError } = require("../helpers/utils");
const eventService = require("../services/event.service");
const userService = require("../services/user.service");
const eventController = {};

eventController.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);

    return sendResponse(
      res,
      200,
      true,
      event,
      null,
      "Get event by ID successful"
    );
  } catch (error) {
    next(error);
  }
};

eventController.getEventsByFilter = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy, ...filter } = req.query;
    const options = { page, limit, sortBy };
    const events = await eventService.getEventsByFilter(filter, options);
    return sendResponse(
      res,
      200,
      true,
      events,
      null,
      "Get event by filters successful"
    );
  } catch (error) {
    next(error);
  }
};

eventController.attendEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    await eventService.addUserToEvent(userId, id);
    return sendResponse(res, 200, true, null, null, "Attend event successful");
  } catch (error) {
    next(error);
  }
};

eventController.unattendEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    await eventService.removeUserFromEvent(userId, id);
    return sendResponse(
      res,
      200,
      true,
      null,
      null,
      "Unattend event successful"
    );
  } catch (error) {
    next(error);
  }
};

eventController.createEvent = async (req, res, next) => {
  try {
    const userId = req.userId;
    const newEvent = await eventService.createEvent(userId, req.body);
    await eventService.addUserToEvent(userId, newEvent._id);

    sendResponse(
      res,
      200,
      true,
      { newEvent },
      null,
      "Create Event Successfully"
    );
  } catch (error) {
    next(error);
  }
};

eventController.updateEvent = async (req, res, next) => {
  try {
    // Get data
    const userId = req.userId;
    const eventId = req.params.id;
    const event = await eventService.updateEvent(userId, eventId, req.body);

    sendResponse(res, 200, true, event, null, "Update event successful");
  } catch (error) {
    next(error);
  }
};

eventController.deleteEvent = async (req, res, next) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    const result = await eventService.deleteEvent(userId, eventId);

    sendResponse(res, 200, true, result, null, "Delete event successful");
  } catch (error) {
    next(error);
  }
};

eventController.getAttendeesFromEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.getAttendeesFromEvent(eventId);

    sendResponse(
      res,
      200,
      true,
      event,
      null,
      "Get attendees from event successful"
    );
  } catch (error) {
    next(error);
  }
};

eventController.getOrganizerFromEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.getOrganizerFromEvent(eventId);

    sendResponse(
      res,
      200,
      true,
      event,
      null,
      "Get organizer from event successful"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = eventController;
