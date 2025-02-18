import Joi from "joi";

export const reviewValidation = Joi.object({
  text: Joi.string().required().trim().messages({
    "string.base": "Text must be a string",
    "string.empty": "Text is required",
  }),

  product: Joi.string().required().messages({
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID is required",
  }),

  createdBy: Joi.string().required().messages({
    "string.base": "User ID must be a string",
    "string.empty": "User ID is required",
  }),
});
