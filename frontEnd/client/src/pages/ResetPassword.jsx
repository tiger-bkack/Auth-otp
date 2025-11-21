import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSend, setIsEmailSend] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSend, setIsOtpSubmited] = useState(false);

  const inputRefs = React.useRef([]);

  const handelInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = async (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handelPaste = async (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitToSendOtpHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSend(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtpHandler = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400"
    >
      <img
        onClick={() => navigate("/")}
        src={assets.image}
        className="w-28 sm:w-15 absolute left-5 sm:left-20 top-5  cursor-pointer"
        alt=""
      />
      {/* form to enter email and send otp */}

      {!isEmailSend && (
        <form
          onSubmit={onSubmitToSendOtpHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            قم بأدخال الباريد الكتروني الخاص بك
          </p>
          <div className="flex justify-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} className="w-3 h3" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="الباريد الألكتروني"
              className=" w-full outline-none bg-transparent text-white "
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-500  ease-in-out duration-200 ">
            Submit
          </button>
        </form>
      )}
      {/* from to enter otp  */}
      {isEmailSend && !isOtpSend && (
        <form
          onSubmit={onSubmitOtpHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            إعادة تعيين كلمة المرور OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            أدخل الرمز المكون من 4 أرقام المرسل إلى البريد الإلكتروني الخاص بك.
          </p>
          <div className="flex justify-center mb-8 gap-2" onPaste={handelPaste}>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handelInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer
          hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-500  ease-in-out duration-200 
          "
          >
            نأكيد التحقيق
          </button>
        </form>
      )}
      {/* from to enter new password */}
      {isEmailSend && isOtpSend && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            كلمة المرور الجديدة
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            أدخل كلمة المرور الجديدة
          </p>
          <div className="flex justify-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} className="w-3 h3" />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="كلة المرور"
              className=" w-full outline-none bg-transparent text-white "
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-500  ease-in-out duration-200 ">
            حفظ كلة المرور
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
