const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendmail");

// @desc ---> Register User
// @route ---> PoST /api/v1/auth/register
// @access ---> Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
});

// @desc ---> Login User
// @route ---> PoST /api/v1/auth/login
// @access ---> Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email & password
  if (!email && !password) {
    return next(
      new ErrorResponse("Please provide a valid email and password", 400)
    );
  }

  // check if user exists
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc ---> Get Logged In User
// @route ---> GET /api/v1/auth/current
// @access ---> Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc ---> Logout user
// @route ---> GET /api/v1/auth/logout
// @access ---> Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc ---> POST Reset Password
// @route ---> POST /api/v1/auth/forgotPassword
// @access ---> Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`No user exists with email id ${req.body.email}`, 404)
    );
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `You are receiving this email because you have requested for a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password Request",
      message
    });
    res.status(200).json({
      success: true,
      message: "Email sent"
    });
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc ---> PUT Reset Password
// @route ---> PUT /api/v1/auth/resetPassword/:resetToken
// @access ---> Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc ---> PUT Update user details
// @route ---> PUT /api/v1/auth/update
// @access ---> Private
exports.updateDetail = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorResponse("Not Authorized.", 401));
  }

  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc ---> PUT Update user password
// @route ---> PUT /api/v1/auth/changepassword
// @access ---> Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse("Current password does not match.", 401));
  }

  user.password = req.body.password;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token
    });
};
