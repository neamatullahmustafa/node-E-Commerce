import { isValidObjectId } from "mongoose";
import couponModel from "../../../database/models/coupon.model.js";
import { AppError } from "../../utils/appError.js";
import { deleteOne, getAll } from "../handlers/handlers.js";

const addCoupon = async (req, res, next) => {
  try {
    const { code, discount, expiresAt } = req.body;

    if (!code || discount == null || !expiresAt) {
      return next(new AppError("All fields are required", 400));
    }

    const existingCoupon = await couponModel.findOne({ code });
    if (existingCoupon) {
      return next(new AppError("Coupon code already exists", 400));
    }

    const coupon = new couponModel({ code, discount, expiresAt });
    await coupon.save();

    res.status(201).json({ message: "Coupon added successfully", coupon });
  } catch (error) {
    next(error);
  }
};

const getCoupons = getAll(couponModel, "coupons");

const getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid coupon ID", 400));
    }

    const coupon = await couponModel.findById(id);
    if (!coupon) {
      return next(new AppError("Coupon not found", 404));
    }

    res.status(200).json({ message: "Coupon retrieved successfully", coupon });
  } catch (error) {
    next(error);
  }
};

const updateCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid coupon ID", 400));
    }

    const coupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!coupon) {
      return next(new AppError("Coupon not found", 404));
    }

    res.status(200).json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    next(error);
  }
};

const deleteCouponById = deleteOne(couponModel);

export {
  addCoupon,
  getCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
};
