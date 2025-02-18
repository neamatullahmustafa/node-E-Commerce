import { Router } from "express";
import {
  addReview,
  getReviews,
  getReviewById,
  deleteReviewById,
  updateReviewById,
} from "./review.controller.js";
import { validate } from "../../middleware/validate.js";
import { reviewValidation } from "./review.validation.js";

const reviewRouter = Router();

reviewRouter
  .route("/")
  .post(validate(reviewValidation), addReview)
  .get(getReviews);
reviewRouter
  .route("/:id")
  .get(getReviewById)
  .delete(deleteReviewById)
  .put(validate(reviewValidation), updateReviewById);

export default reviewRouter;
