const mongoose = require("mongoose");
const dayjs = require("dayjs");
const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    location: {
      name: { type: String, require: true },
      coordinates: {
        // [longtitude, latitude]
        type: [Number],
        require: true,
      },
    },
    time: {
      type: Date,
      require: true,
    },

    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    coverUrl: {
      type: String,
      require: false,
      default: "",
    },
    imagesUrls: [
      {
        type: String,
        require: false,
      },
    ],

    description: {
      type: String,
      require: false,
      default: "",
    },
    isFinished: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "events",
  }
);

// Auto update if the event is in the past.
eventSchema.pre("save", function (next) {
  this.isFinished = dayjs(Date.now()).isAfter(this.time) ? true : false;
  next();
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
