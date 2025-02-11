import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enums: ["user", "admin"] },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },

  { timestamps: true, versionKey: false }
);
const userModel = mongoose.model("User", schema);
export default userModel;
