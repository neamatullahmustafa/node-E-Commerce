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
    description: {
      type: String,
      minLength: [3, "description is too short"],
      maxLength: [500, "description is too long"],
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true, versionKey: false }
);
schema.post("init", function (doc) {
  doc.logo = `http://localhost:3000/uploads/${doc.logo}`;
});
const brandModel = mongoose.model("Brand", schema);
export default brandModel;
