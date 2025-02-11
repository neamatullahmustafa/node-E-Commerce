import { number } from "joi";
import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount: {
      type: number,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },

  { timestamps: true, versionKey: false }
);
const couponModel = mongoose.model("Coupon", schema);
export default couponModel;
