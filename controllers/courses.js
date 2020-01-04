const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc ---> Get all courses
// @route ---> GET /api/v1/courses
// @route ---> GET /api/v1/bootcamps/:bootcampId/courses
// @access ---> Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc ---> Get single courses
// @route ---> GET /api/v1/courses/:id
// @access ---> Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  let query;
  query = Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  const course = await query;
  if (!course) {
    return next(
      new ErrorResponse(`No courses found by id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc ---> Add course
// @route ---> POST /api/v1/bootcamps/:bootcampId/courses
// @access ---> Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc ---> Update course
// @route ---> PUT /api/v1/courses/:id
// @access ---> Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found by id ${req.parmas.id}`, 404)
    );
  }

  // check user is authorized
  if (course.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not Authorized", 401));
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedCourse
  });
});

// @desc ---> Delete course
// @route ---> DELETE /api/v1/courses/:id
// @access ---> Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No courses found by id ${req.params.id}`, 404)
    );
  }

  // check user is authorized
  if (course.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not Authorized", 401));
  }

  course.remove();

  res.status(200).json({
    success: true,
    message: "Course deleted."
  });
});
