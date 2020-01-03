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

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

// route for photo upload
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), uploadPhoto);

router
  .route("/")
  .get(getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(viewBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
