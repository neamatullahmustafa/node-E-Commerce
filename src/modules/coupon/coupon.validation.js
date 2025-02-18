import Joi from "joi";

export const couponValidation = Joi.object({
  code: Joi.string().required().trim().messages({
    "string.base": "Code must be a string",
    "string.empty": "Code is required",
  }),

  discount: Joi.number().min(0).required().messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount must be at least 0",
    "number.required": "Discount is required",
  }),

  expiresAt: Joi.date().required().messages({
    "date.base": "Expiration date must be a valid date",
    "date.empty": "Expiration date is required",
  }),
});
