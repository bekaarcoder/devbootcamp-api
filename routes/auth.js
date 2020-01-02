const express = require("express");
const { register, login, getCurrentUser } = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/register").post(register);
router.post("/login", login);
router.get("/current", protect, getCurrentUser);

module.exports = router;
