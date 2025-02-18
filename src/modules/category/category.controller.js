import slugify from "slugify";
import { isValidObjectId } from "mongoose";
import categoryModel from "../../../database/models/category.model.js";
import { redis } from "../../../database/redisConnection.js";
import { AppError } from "../../utils/appError.js";
import fs from "fs";
import path from "path";
import { deleteOne, getAll } from "../handlers/handlers.js";
const addCategory = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name);
    if (!req.file) {
      return next(new Error("No file uploaded"));
    }

    let category = new categoryModel({
      ...req.body,
      thumbnail: `/uploads/${req.file.filename}`,
    });
    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    next(error);
  }
};

const getCategories = getAll(categoryModel, "categories");

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid category ID", 400));
    }

    const category = await categoryModel.findById(id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res
      .status(200)
      .json({ message: "Category retrieved successfully", category });
  } catch (error) {
    next(error);
  }
};

const updateCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid category ID", 400));
    }

    const category = await categoryModel.findById(id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        category.thumbnail.split("/uploads/")[1]
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategoryById = deleteOne(categoryModel);

export {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
