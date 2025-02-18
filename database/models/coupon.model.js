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
      type: Number,
      required: true,
      min: [0, "Discount must be at least 0"],
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
