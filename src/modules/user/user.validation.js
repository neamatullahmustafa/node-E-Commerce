import Joi from "joi";

export const userValidation = Joi.object({
  username: Joi.string().required().trim().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),

  role: Joi.string().valid("user", "admin").default("user").messages({
    "string.base": "Role must be a string",
    "string.empty": "Role cannot be empty",
  }),

  profilePicture: Joi.object({
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

  isActive: Joi.boolean().optional(),
  isBlocked: Joi.boolean().default(false),
  isVerified: Joi.boolean().default(false),
  otp: Joi.string().optional(),
  otpExpires: Joi.date().optional(),
});
