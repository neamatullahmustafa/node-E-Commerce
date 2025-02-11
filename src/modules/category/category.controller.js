import slugify from "slugify";
import categoryModel from "../../../database/models/category.model.js";
const addCategory = async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  let category = new categoryModel(req.body);
  await category.save();
  // .then((data) => {
  res.status(200).json({ message: "Category added successfully", data });
  // })
  // .catch((error) => {
  //   res.status(200).json({ message: "Category added have error", error });
  // });
};
const getCategories = async (req, res, next) => {
  let categories = await categoryModel.find();
  // .then((data) => {
  res.status(200).json({ message: "categories get successfully", categories });
  // })
  // .catch((error) => {
  //   res.status(200).json({ message: "Category get have error", error });
  // });
};
const getCategoryById = async (req, res, next) => {
  let category = await categoryModel.findById(req.params.id);
  // .then((data) => {
  res.status(200).json({ message: "Category get successfully", category });
  // })
  // .catch((error) => {
  //   res.status(200).json({ message: "Category get have error", error });
  // });
};
const updateCategoryById = async (req, res, next) => {
  let category = await categoryModel.findByIdAndUpdate(
    req.params.id,
    res.body,
    { new: true }
  );
  // .then((data) => {
  res.status(200).json({ message: "Category update successfully", category });
  // })
  // .catch((error) => {
  //   res.status(200).json({ message: "Category get have error", error });
  // });
};
const deleteCategoryById = async (req, res, next) => {
  let category = await categoryModel.findByIdAndDelete(req.params.id);
  // .then((data) => {
  res.status(200).json({ message: "Category delete successfully", category });
  // })
  // .catch((error) => {
  //   res.status(200).json({ message: "Category get have error", error });
  // });
};
export {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
