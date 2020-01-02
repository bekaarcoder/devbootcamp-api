const express = require("express");
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  viewBootcamp,
  deleteBootcamp,
  uploadPhoto
} = require("../controllers/bootcamps");

// Include other resource router
const courseRouter = require("./courses");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

// route for photo upload
router.route("/:id/photo").put(protect, uploadPhoto);

router
  .route("/")
  .get(getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(viewBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
