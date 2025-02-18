import { isValidObjectId } from "mongoose";
import reviewModel from "../../../database/models/reviews.model.js";
import { AppError } from "../../utils/appError.js";
import { deleteOne } from "../handlers/handlers.js";

const addReview = async (req, res, next) => {
  try {
    const { text, product, createdBy } = req.body;

    if (!text || !product || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const review = new reviewModel({ text, product, createdBy });
    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    let pageNumber = req.query.page * 1 || 1;
    if (pageNumber < 1) pageNumber = 1;

    const limit = req.query.limit || 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    const reviews = await reviewModel
      .find(req.query)
      .skip(skip)
      .limit(limit)

      .populate("product")
      .populate("createdBy");

    res
      .status(200)
      .json({ message: "Reviews retrieved successfully", reviews });
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid review ID", 400));
    }

    const review = await reviewModel
      .findById(id)
      .populate("product")
      .populate("createdBy");

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({ message: "Review retrieved successfully", review });
  } catch (error) {
    next(error);
  }
};

const updateReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid review ID", 400));
    }

    const review = await reviewModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    next(error);
  }
};

const deleteReviewById = deleteOne(reviewModel);

export {
  addReview,
  getReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
