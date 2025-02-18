import mongoose from "mongoose";

const schema = mongoose.Schema(
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
    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);
schema.post("init", function (doc) {
  doc.thumbnail = `http://localhost:3000/uploads/${doc.thumbnail}`;
});
const subCategoryModel = mongoose.model("SubCategory", schema);
export default subCategoryModel;
