const express = require("express");
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  viewBootcamp,
  deleteBootcamp
} = require("../controllers/bootcamps");
const router = express.Router();

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(viewBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
