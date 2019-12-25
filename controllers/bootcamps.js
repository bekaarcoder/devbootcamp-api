// @desc ---> Get all bootcamps
// @route ---> GET /api/v1/bootcapms
// @access ---> Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Get all bootcapms" });
};

// @desc ---> Create a bootcamp
// @route ---> POST /api/v1/bootcamps
// @access ---> Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true });
};

// @desc ---> View a bootcamp
// @route ---> GET /api/v1/bootcamps/:id
// @access ---> Public
exports.viewBootcamp = (req, res, next) => {
  res.status(200).json({ status: true });
};

// @desc ---> Update a bootcamp
// @route ---> PUT /api/v1/bootcamps/:id
// @access ---> Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ status: true });
};

// @desc ---> Delete a bootcamp
// @route ---> DELETE /api/v1/bootcamps/:id
// @access ---> Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ status: true });
};
