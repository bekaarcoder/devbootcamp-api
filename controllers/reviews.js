const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/Review");

// @desc ---> Get reviews
// @route ---> GET /api/v1/reviews
// @route ---> GET /api/v1/bootcamps/:bootcampId/reviews
// @access ---> Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let reviews;

  if (req.params.bootcampId) {
    reviews = await Review.find({ bootcamp: req.params.bootcampId });
  } else {
    reviews = await Review.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});
