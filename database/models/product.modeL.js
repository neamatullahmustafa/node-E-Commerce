import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "name is too short"],
      maxLength: [50, "name is too long"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      min: [0, "price must be positive"],
      required: true,
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "priceAfterDiscount must be positive"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    quantity: {
      type: Number,
      min: [0, "quantity must be positive"],
      required: true,
      default: 1,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["in-stock", "out-of-stock", "discontinued"],
      default: "in-stock",
    },
    thumbnail: {
      type: String,
      required: true,
    },

    ratings: {
      type: Number,
      min: [0, "ratings must be positive"],
      max: [5, "ratings must be less than or equal to 5"],
    },
    rateCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      minLength: [3, "description is too short"],
      maxLength: [500, "description is too long"],
      required: true,
    },
    imageCover: {
      type: String,
      //   required: true,
    },
    images: {
      type: [string],
      // required: true,
    },
  },

  { timestamps: true, versionKey: false }
);
const productModel = mongoose.model("Product", schema);
export default productModel;
