const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc ---> Get all bootcamps
// @route ---> GET /api/v1/bootcapms
// @access ---> Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    data: bootcamps
  });
});

// @desc ---> Create a bootcamp
// @route ---> POST /api/v1/bootcamps
// @access ---> Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc ---> View a bootcamp
// @route ---> GET /api/v1/bootcamps/:id
// @access ---> Public
exports.viewBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      message: "No bootcamp found"
    });
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc ---> Update a bootcamp
// @route ---> PUT /api/v1/bootcamps/:id
// @access ---> Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return res
      .status(400)
      .json({ success: false, message: "No bootcamp found." });
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc ---> Delete a bootcamp
// @route ---> DELETE /api/v1/bootcamps/:id
// @access ---> Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      message: "No bootcamp found."
    });
  }

  res.status(200).json({
    success: true,
    message: "Bootcamp deleted"
  });
});
