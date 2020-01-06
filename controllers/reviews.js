const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

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

// @desc ---> Get single review
// @route ---> GET /api/v1/reviews/:id
// @access ---> Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("No review found", 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc ---> Add review
// @route ---> POST /api/v1/bootcamps/:bootcampId/reviews
// @access ---> Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    );
  }

  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc ---> PUT Update review
// @route ---> PUT /api/v1/reviews/:id
// @access ---> Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("No review found", 404));
  }

  if (review.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to update this review", 401)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc ---> DELETE Delete review
// @route ---> DELETE /api/v1/reviews/:id
// @access ---> Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("No review found", 404));
  }

  if (review.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to delete this review", 401)
    );
  }

  review.remove();

  res.status(200).json({
    success: true,
    message: "Review deleted"
  });
});
