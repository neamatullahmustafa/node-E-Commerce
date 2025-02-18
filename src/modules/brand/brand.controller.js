import slugify from "slugify";
import { isValidObjectId } from "mongoose";
import brandModel from "../../../database/models/brand.model.js";
import { redis } from "../../../database/redisConnection.js";
import { AppError } from "../../utils/appError.js";
import fs from "fs";
import path from "path";
import { deleteOne, getAll } from "../handlers/handlers.js";
const addBrand = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name);

    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    let brand = new brandModel({
      ...req.body,
      logo: `/uploads/${req.file.filename}`,
    });

    await brand.save();
    res.status(201).json({ message: "Brand added successfully", brand });
  } catch (error) {
    next(error);
  }
};
const getBrands = getAll(brandModel, "brands");

const getBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid brand ID", 400));
    }

    const brand = await brandModel.findById(id);

    if (!brand) {
      return next(new AppError("Brand not found", 404));
    }

    res.status(200).json({ message: "Brand retrieved successfully", brand });
  } catch (error) {
    next(error);
  }
};

const updateBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid brand ID", 400));
    }

    const brand = await brandModel.findById(id);

    if (!brand) {
      return next(new AppError("Brand not found", 404));
    }

    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        brand.logo.split("/uploads/")[1]
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      req.body.logo = `/uploads/${req.file.filename}`;
    }

    const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Brand updated successfully", brand: updatedBrand });
  } catch (error) {
    next(error);
  }
};

const deleteBrandById = deleteOne(brandModel);

export { addBrand, getBrands, getBrandById, updateBrandById, deleteBrandById };
