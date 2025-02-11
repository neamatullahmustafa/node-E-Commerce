import { Router } from "express";

import {
  addCategory,
  getCategoryById,
  getCategories,
  deleteCategoryById,
  updateCategoryById,
} from "./category.controller.js";

const categoryRouter = Router();

categoryRouter.route("/").post(addCategory).get(getCategories);
categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .delete(deleteCategoryById)
  .update(updateCategoryById);

export { categoryRouter };

export default categoryRouter;
