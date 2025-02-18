import { Router } from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "./product.controller.js";
import { uploadMultiple } from "../../utils/multerConfig.js";
import { validate } from "../../middleware/validate.js";
import { productValidation } from "./product.validation.js";

const productRouter = Router();

productRouter
  .route("/")
  .post(uploadMultiple("thumbnails"), validate(productValidation), addProduct)
  .get(getProducts);
productRouter
  .route("/:id")
  .get(getProductById)
  .put(
    uploadMultiple("thumbnails"),
    validate(productValidation),
    updateProductById
  )
  .delete(deleteProductById);

export default productRouter;
