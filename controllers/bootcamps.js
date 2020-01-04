const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc ---> Get all bootcamps
// @route ---> GET /api/v1/bootcapms
// @access ---> Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy re.query to reqQuery
  const reqQuery = { ...req.query };
  // remove the fields from reqQuery
  const removeFields = ["select", "sort", "limit", "page"];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: "courses",
    select: "title description"
  });

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  const pagination = {};

  if (lastIndex < total) {
    pagination.next = {
      page: page + 1
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
});

// @desc ---> Create a bootcamp
// @route ---> POST /api/v1/bootcamps
// @access ---> Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

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
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path: "courses",
    select: "title description"
  });
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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      message: "No bootcamp found."
    });
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    message: "Bootcamp deleted"
  });
});

// @desc ---> Upload a photo
// @route ---> PUT /api/v1/bootcamps/:id/photo
// @access ---> Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(new ErrorResponse(`No bootcamp found by id ${req.params.id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // check file type
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload a file with size less than ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem with file uploading", 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
