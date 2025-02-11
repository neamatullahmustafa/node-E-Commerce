import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,

      trim: true,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true, versionKey: false }
);
const reviewModel = mongoose.model("Review", schema);
export default reviewModel;
