import { Router } from "express";
import {
  addCoupon,
  getCoupons,
  getCouponById,
  deleteCouponById,
  updateCouponById,
} from "./coupon.controller.js";
import { validate } from "../../middleware/validate.js";
import { couponValidation } from "./coupon.validation.js";

const couponRouter = Router();

couponRouter
  .route("/")
  .post(validate(couponValidation), addCoupon)
  .get(getCoupons);
couponRouter
  .route("/:id")
  .get(getCouponById)
  .delete(deleteCouponById)
  .put(validate(couponValidation), updateCouponById);

export default couponRouter;
