import userModel from "../models/userModel.js";
import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemiler.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTempalte.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: fales, message: "Missing detalis" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists ",
      });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 160 * 60 * 1000,
    });

    /* sending welcome email */
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcom to mohamed ali company",
      text: `welcom to mohamed ali company your acount has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalied email" });
    }

    const isMatch = await bycrpt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalied Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 160 * 60 * 1000,
    });
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 160 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (user.verifyOTPVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOtpion = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your OTP is ${otp}. Verifiy your account using this OTP.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace(
        "{{otp}}",
        otp
      ),
    };

    await transporter.sendMail(mailOtpion);
    res.json({
      success: true,
      message: "Verification OTP send to the user Email",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Detalis" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if ((user.verifyOTP = "" || user.verifyOTP != otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.verifyOTPVerified = true;
    user.verifyOTPExpireAt = 0;
    user.verifyOTP = "";

    await user.save();
    res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check if user authentication
export const isAuthanticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOtpion = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      // text: `Your OTP for reseting password is ${otp}. use this OTP to proceed with reseting your password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        email
      ),
    };

    await transporter.sendMail(mailOtpion);
    res.json({
      success: true,
      message: "Reseting OTP Password send to the user Email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset user password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing Detlies" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.resetOTP === "" || user.resetOTP != otp) {
      return res.json({ success: false, message: "Invalied OTP" });
    }

    if (user.resetOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bycrpt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetOTP = "";
    user.resetOTPExpireAt = 0;

    await user.save();

    res.json({ success: true, message: "Password has been reset successfuly" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
