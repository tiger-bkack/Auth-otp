import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const { backendUrl, setLoggedin, getUserData } = useContext(AppContext);
  const [state, setSate] = useState("أنشاء حساب");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "أنشاء حساب") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
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
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm  ">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "أنشاء حساب" ? "أنشاء حساب" : "تسجيل الدخول "}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "أنشاء حساب"
            ? "قم بأنشاء حسابك الجديد من هنا"
            : "قم بالدخول الي حسابك "}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "أنشاء حساب" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="الأسم"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="الباريد الالكتروني"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="كلة المرور"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer hover:text-white duration-100"
          >
            نسيت كلة المرور
          </p>

          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer
          hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-500  ease-in-out duration-200 
          "
          >
            {state}
          </button>
        </form>
        {state === "أنشاء حساب" ? (
          <p className="text-gary-400 text-center text-xs mt-4">
            أذا كان لديك حساب ؟{" "}
            <span
              onClick={() => setSate("تسجيل دخول")}
              className="text-blue-400 cursor-pointer underline hover:text-gray-300 duration-100"
            >
              تسجيل دخول
            </span>
          </p>
        ) : (
          <p className="text-gary-400 text-center text-xs mt-4">
            قم بأنشاء حساب جديد ؟{" "}
            <span
              onClick={() => setSate("أنشاء حساب")}
              className="text-blue-400 cursor-pointer underline hover:text-gray-300 duration-100"
            >
              أنشاء حساب
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
