import { Router } from "express";
import {
  addSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
} from "./subCategory.controller.js";
import { uploadSingle } from "../../utils/multerConfig.js";
import { validate } from "../../middleware/validate.js";
import { subCategoryValidation } from "./subCategory.validation.js";

const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post(
    uploadSingle("thumbnail"),
    validate(subCategoryValidation),
    addSubCategory
  )
  .get(getSubCategories);

subCategoryRouter
  .route("/:id")
  .get(getSubCategoryById)
  .put(
    uploadSingle("thumbnail"),
    validate(subCategoryValidation),
    updateSubCategoryById
  )
  .delete(deleteSubCategoryById);

export default subCategoryRouter;
