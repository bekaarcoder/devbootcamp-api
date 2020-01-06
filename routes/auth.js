const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateDetail,
  changePassword,
  logoutUser
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/register").post(register);
router.post("/login", login);
router.get("/current", protect, getCurrentUser);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.put("/update", protect, updateDetail);
router.put("/changepassword", protect, changePassword);
router.get("/logout", protect, logoutUser);

module.exports = router;
