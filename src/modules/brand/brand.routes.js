import { Router } from "express";
import {
  addBrand,
  getBrands,
  getBrandById,
  deleteBrandById,
  updateBrandById,
} from "./brand.controller.js";
import { uploadSingle } from "../../utils/multerConfig.js";
import { brandSValidation } from "./brand.validation.js";
import { validate } from "../../middleware/validate.js";

const brandRouter = Router();

brandRouter
  .route("/")
  .post(uploadSingle("logo"), validate(brandSValidation), addBrand)
  .get(getBrands);
brandRouter
  .route("/:id")
  .get(getBrandById)
  .delete(deleteBrandById)
  .put(uploadSingle("logo"), validate(brandSValidation), updateBrandById);

export default brandRouter;
