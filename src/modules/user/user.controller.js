import userModel from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/appError.js";
import sendMail from "../../utils/sendMail.js";
import fs from "fs";
import path from "path";
import { deleteOne } from "../handlers/handlers.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return next(new AppError("Email already exists", 400));

    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(req.file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(req.file.mimetype);

    if (!extname || !mimetype) {
      return next(
        new AppError("Only images (jpg, jpeg, png) are allowed", 400)
      );
    }

    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      profilePicture: `/uploads/${req.file.filename}`,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return next(new AppError("Invalid email or password", 401));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid email or password", 401));

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    let pageNumber = req.query.page * 1 || 1;
    if (pageNumber < 1) pageNumber = 1;

    const limit = req.query.limit || 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    const users = await userModel
      .find(req.query)
      .skip(skip)
      .limit(limit)
      .select("-password");
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return next(new AppError("Invalid user ID", 400));

    const user = await userModel.findById(id).select("-password");
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return next(new AppError("Invalid user ID", 400));

    const user = await userModel.findById(id);

    if (!user) return next(new AppError("User not found", 404));

    // If a new image is uploaded, delete the old one
    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        user.profilePicture.split("/uploads/")[1] // Assuming 'profilePicture' is the field storing image path
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old profile image
      }

      req.body.profilePicture = `/uploads/${req.file.filename}`; // Update the image field with the new one
    }

    // Update the user data in the database
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
      select: "-password", // Don't return password in the response
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
const deleteUserById = deleteOne(userModel);

const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return next(new AppError("Invalid user ID", 400));

    const user = await userModel.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return next(new AppError("Invalid user ID", 400));

    const user = await userModel.findById(id);
    if (!user) return next(new AppError("User not found", 404));

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return next(new AppError("User not found", 404));

    const otp = generateOTP();
    const otpExpires = new Date(
      Date.now() + process.env.OTP_EXPIRATION * 60000
    );

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendMail(email, "Your OTP Code", `Your OTP code is: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return next(new AppError("User not found", 404));

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return next(new AppError("Invalid or expired OTP", 400));
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    next(error);
  }
};

export {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyUser,
  blockUser,
};
