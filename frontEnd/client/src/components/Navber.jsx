import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const Navber = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setLoggedin } =
    useContext(AppContext);

  const logout = async () => {
    try {
      //axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      data.success && setLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerifaicationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div
      dir="rtl"
      className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0"
    >
      <div className="flex items-center justify-center">
        <img src={assets.image} className="w-28 sm:w-15" alt="" />
        <p className="text-2xl font-semibold">المشوار</p>
      </div>

      {userData ? (
        <div
          dir="rtl"
          className="w-8 h-8 rounded-full flex justify-center items-center bg-black text-white relative group"
        >
          {userData.name[0].toUpperCase()}
          <div className="w-30 absolute hidden group-hover:block top-0 right-0 z-20 text-black rounded pt-10 ">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm rounded">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerifaicationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer rounded"
                >
                  التحقق من الحساب{" "}
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                تسجيل الخروج
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-500 rounded-2xl px-6 py-2 cursor-pointer text-gray-800 
      hover:bg-gray-100 transition-all  hover:animate-pulse group duration-500 ease-in-out 
      "
          >
            تسجيل الدخول
            <img
              dir="ltr"
              className="rotate-180  group-hover:opacity-100 group-hover:translate-x-0 
             transition-all duration-300 ease-in-out"
              src={assets.arrow_icon}
              alt=""
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navber;
