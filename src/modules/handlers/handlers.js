import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/appError.js";
import { redis } from "../../../database/redisConnection.js";
import { ApiFeatures } from "./../../utils/apiFeature.js";

export const deleteOne = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return next(new AppError("Invalid document ID", 400));
      const document = await model.findByIdAndDelete(id);
      if (!document) return next(new AppError("document not found", 404));

      res.status(200).json({ message: "document deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
};
export const getAll = (model, name) => {
  return async (req, res, next) => {
    try {
      // let document = await redis.get(name);
      let apiFeatures = new ApiFeatures(model.find(), req.query)
        .pagination()
        .filter()
        .search()
        .select()
        .sort();

      const document = await apiFeatures.queryObj;

      // if (!document) {

      //   await redis.set(name, JSON.stringify(document), "EX", 3600);
      // } else {
      //   document = JSON.parse(document);
      // }
      res.status(200).json({
        message: "document retrieved successfully",
        page: apiFeatures.pageNumber,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  };
};
