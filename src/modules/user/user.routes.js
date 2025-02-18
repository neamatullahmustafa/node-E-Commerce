import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyUser,
  blockUser,
  sendOTP,
  verifyOTP,
} from "./user.controller.js";
import { uploadSingle } from "../../utils/multerConfig.js";
import { validate } from "../../middleware/validate.js";
import { userValidation } from "./user.validation.js";

const userRouter = Router();
userRouter.post(
  "/register",
  uploadSingle("profilePicture"),
  validate(userValidation),
  registerUser
);
userRouter.post("/login", loginUser);
userRouter.get("/", getUsers);
userRouter
  .route("/:id")
  .get(getUserById)
  .put(uploadSingle("profilePicture"), validate(userValidation), updateUserById)
  .delete(deleteUserById);
userRouter.patch("/:id/verify", verifyUser);
userRouter.patch("/:id/block", blockUser);

userRouter.post("/send-otp", sendOTP);
userRouter.post("/verify-otp", verifyOTP);

export { userRouter };
export default userRouter;
