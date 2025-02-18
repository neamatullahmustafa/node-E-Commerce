import Joi from "joi";

export const brandSValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name is too short (minimum 3 characters)",
    "string.max": "Name is too long (maximum 50 characters)",
  }),

  slug: Joi.string().required().lowercase().messages({
    "string.base": "Slug must be a string",
    "string.empty": "Slug is required",
  }),

  description: Joi.string().min(3).max(500).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description is too short (minimum 3 characters)",
    "string.max": "Description is too long (maximum 500 characters)",
  }),

  logo: Joi.object({
    originalname: Joi.string().required().messages({
      "string.base": "Original name must be a string",
      "string.empty": "Original name is required",
    }),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg")
      .required()
      .messages({
        "string.base": "Mimetype must be a string",
        "string.empty": "Mimetype is required",
        "any.only": "Allowed mimetypes are jpeg, png, gif, webp",
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        "number.base": "Size must be a number",
        "number.max": "File size must be less than 5MB",
      }),
    path: Joi.string().required().messages({
      "string.base": "Path must be a string",
      "string.empty": "Path is required",
    }),
    fieldname: Joi.string().required().messages({
      "string.base": "Fieldname must be a string",
      "string.empty": "Fieldname is required",
    }),
    filename: Joi.string().required().messages({
      "string.base": "Filename must be a string",
      "string.empty": "Filename is required",
    }),
    destination: Joi.string().required().messages({
      "string.base": "Destination must be a string",
      "string.empty": "Destination is required",
    }),
    encoding: Joi.string().required().messages({
      "string.base": "Encoding must be a string",
      "string.empty": "Encoding is required",
    }),
  })
    .required()
    .messages({
      "object.base": "File must be provided",
      "object.empty": "File cannot be empty",
      "any.required": "File is required",
    }),

  status: Joi.boolean(),
  createdBy: Joi.string().optional(),
});
