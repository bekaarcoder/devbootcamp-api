const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title."],
    maxlength: [50, "Title cannote be more than 50 characters."]
  },
  text: {
    type: String,
    trim: true,
    required: [true, "Please add a review text."]
  },
  rating: {
    type: Number,
    min: [1, "Cannot rate less than 1"],
    max: [10, "Cannot rate more than 10"],
    required: [true, "Please add a rating."]
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
