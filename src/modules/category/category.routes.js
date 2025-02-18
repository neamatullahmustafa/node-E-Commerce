import { Router } from "express";

import {
  addCategory,
  getCategoryById,
  getCategories,
  deleteCategoryById,
  updateCategoryById,
} from "./category.controller.js";
import { uploadSingle } from "../../utils/multerConfig.js";
import { validate } from "../../middleware/validate.js";
import { categoryValidation } from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";

const categoryRouter = Router();
categoryRouter.use("/:category/subCategories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(uploadSingle("thumbnail"), validate(categoryValidation), addCategory)
  .get(getCategories);
categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .delete(deleteCategoryById)
  .put(
    uploadSingle("thumbnail"),
    validate(categoryValidation),
    updateCategoryById
  );

export default categoryRouter;
