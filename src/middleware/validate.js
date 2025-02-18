import { AppError } from "../utils/appError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    let fileField;
    if (schema === "brand") {
      fileField = "logo";
    } else if (schema === "user") {
      fileField = "profilePicture";
    } else if (schema === "product") {
      fileField = "thumbnails";
    } else if (schema === "category" || schema === "subCategory") {
      fileField = "thumbnail";
    } else {
      fileField = "thumbnail";
    }

    let { error } = schema.validate({
      ...req.body,
      ...req.params,
      ...req.query,
      [fileField]: req.files,
    });

    if (error) {
      return next(
        new AppError(
          error.details.map((err) => err.message),
          401
        )
      );
    }
    next();
  };
};
