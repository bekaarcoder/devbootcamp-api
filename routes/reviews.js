const express = require("express");
const {
  getReviews,
  addReview,
  getReview,
  updateReview,
  deleteReview
} = require("../controllers/reviews");
const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(getReviews)
  .post(protect, addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
