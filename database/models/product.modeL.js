import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "Name is too short"],
      maxLength: [50, "Name is too long"],
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
      required: true,
      min: [0, "Price must be positive"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Price after discount must be positive"],
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message:
          "Price after discount must be less than or equal to the original price",
      },
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
      required: true,
      min: [0, "Quantity must be positive"],
      default: 1,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold count must be positive"],
    },
    status: {
      type: String,
      enum: ["in-stock", "out-of-stock", "discontinued"],
      default: "in-stock",
    },

    ratings: {
      type: Number,
      default: 0,
      min: [0, "Ratings must be positive"],
      max: [5, "Ratings must be less than or equal to 5"],
    },
    rateCount: {
      type: Number,
      default: 0,
      min: [0, "Rate count must be positive"],
    },
    description: {
      type: String,
      required: true,
      minLength: [3, "Description is too short"],
      maxLength: [500, "Description is too long"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnails: {
      type: [String],
    },
  },
  { timestamps: true, versionKey: false }
);
schema.post("init", function (doc) {
  doc.thumbnails = doc.thumbnails?.map((doc) => {
    return `http://localhost:3000/uploads/${doc.thumbnails}`;
  });
});
const productModel = mongoose.model("Product", schema);
export default productModel;
