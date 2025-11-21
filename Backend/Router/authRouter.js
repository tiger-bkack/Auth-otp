import express from "express";
import {
  isAuthanticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register); // D
authRouter.post("/login", login); // D
authRouter.post("/logout", logout); // D
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp); // D
authRouter.post("/verify-account", userAuth, verifyEmail); // D
authRouter.post("/is-auth", userAuth, isAuthanticated); // D
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
