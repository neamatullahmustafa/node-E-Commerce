import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isActive: { type: Boolean, default: true },
    profilePicture: { type: String },

    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true, versionKey: false }
);
schema.post("init", function (doc) {
  doc.profilePicture = `http://localhost:3000/uploads/${doc.profilePicture}`;
});
schema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
});
schema.pre("findOneAndUpdate", function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 10);
  }
});
const userModel = mongoose.model("User", schema);
export default userModel;
