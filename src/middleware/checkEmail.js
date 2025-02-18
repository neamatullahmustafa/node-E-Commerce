import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const checkEmail = async (req, res, next) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  req.body.password = hash;
  next();
};
