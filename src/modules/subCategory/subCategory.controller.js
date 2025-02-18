import slugify from "slugify";
import { isValidObjectId } from "mongoose";
import subCategoryModel from "../../../database/models/subCategory.model.js";
import { AppError } from "../../utils/appError.js";
import fs from "fs";
import path from "path";
import { deleteOne } from "../handlers/handlers.js";

const addSubCategory = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name);
    req.body.createdBy = req.user._id;
    if (!req.file) {
      return next(new Error("No file uploaded"));
    }
    const subCategory = new subCategoryModel({
      ...req.body,
      thumbnail: `/uploads/${req.file.filename}`,
    });

    await subCategory.save();
    res
      .status(201)
      .json({ message: "Subcategory added successfully", subCategory });
  } catch (error) {
    next(error);
  }
};

const getSubCategories = async (req, res, next) => {
  try {
    let pageNumber = req.query.page * 1 || 1;
    if (pageNumber < 1) pageNumber = 1;

    const limit = req.query.limit || 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    let filterObj = {};
    if (req.params.category) {
      filterObj.category = req.params.category;
    }
    const subCategories = await subCategoryModel
      .find(filterObj)
      .skip(skip)
      .limit(limit)

      .populate("category", "name");
    res
      .status(200)
      .json({ message: "Subcategories retrieved successfully", subCategories });
  } catch (error) {
    next(error);
  }
};

const getSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid subcategory ID", 400));
    }

    const subCategory = await subCategoryModel
      .findById(id)
      .populate("category", "name");

    if (!subCategory) {
      return next(new AppError("Subcategory not found", 404));
    }

    res
      .status(200)
      .json({ message: "Subcategory retrieved successfully", subCategory });
  } catch (error) {
    next(error);
  }
};

const updateSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the subcategory ID
    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid subcategory ID", 400));
    }

    const subCategory = await subCategoryModel.findById(id);

    if (!subCategory) {
      return next(new AppError("Subcategory not found", 404));
    }

    // If new image is uploaded, delete the old one
    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        subCategory.thumbnail.split("/uploads/")[1]
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }

      req.body.thumbnail = `/uploads/${req.file.filename}`; // Update the thumbnail field
    }

    // If the subcategory name is updated, regenerate the slug
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    // Update the subcategory in the database
    const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Subcategory updated successfully",
      subCategory: updatedSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubCategoryById = deleteOne(subCategoryModel);

export {
  addSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
};
