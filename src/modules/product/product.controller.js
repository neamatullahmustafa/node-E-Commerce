import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/appError.js";
import slugify from "slugify";
import productModel from "../../../database/models/product.modeL.js";
import fs from "fs";
import path from "path";
import { deleteOne } from "../handlers/handlers.js";
const addProduct = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name);
    let images = [];

    if (!req.file) {
      return next(new Error("No file uploaded"));
    }
    if (req.files) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.file) {
      images = [`/uploads/${req.file.filename}`];
    }

    const product = new productModel({
      ...req.body,

      thumbnail: images[0],
      images: images,
    });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    let pageNumber = req.query.page * 1 || 1;
    if (pageNumber < 1) pageNumber = 1;

    const limit = req.query.limit || 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    const products = await productModel
      .find(req.query)
      .skip(skip)
      .limit(limit)

      .populate("category subCategory brand");
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return next(new AppError("Invalid product ID", 400));

    const product = await productModel
      .findById(id)
      .populate("category subCategory brand");
    if (!product) return next(new AppError("Product not found", 404));

    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id))
      return next(new AppError("Invalid product ID", 400));

    const product = await productModel.findById(id);

    if (!product) return next(new AppError("Product not found", 404));

    if (req.files || req.file) {
      const oldImagePaths = [product.thumbnail, ...product.images];
      oldImagePaths.forEach((imagePath) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          imagePath.split("/uploads/")[1]
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      let images = [];
      if (req.files) {
        images = req.files.map((file) => `/uploads/${file.filename}`);
      } else if (req.file) {
        images = [`/uploads/${req.file.filename}`];
      }

      req.body.thumbnail = images[0];
      req.body.images = images;
    }

    if (req.body.name) req.body.slug = slugify(req.body.name);

    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProductById = deleteOne(productModel);

export {
  addProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
