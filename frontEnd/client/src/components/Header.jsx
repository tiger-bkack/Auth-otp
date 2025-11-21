import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center mt-20 px-7 text-center text-gray-800"
    >
      <img
        src={assets.header_img}
        className="w-36 h-36 rounded-full mb-6"
        alt=""
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        مرحباً يا {userData ? userData.name : "صديقي"}{" "}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        أهلاً بك في تطبيقنا
      </h2>
      <p className="mb-8 max-w-md">
        نتمني لك تجربة متميز مقابل الحدمه المقدة, نحن نقدم تجربة تسجيل حساب بكل
        الخدمات المتاحة و تامين التسجيل.
      </p>
      <p className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 cursor-pointer transition-all duration-100 hover:animate-pulse">
        أبدء الرحلة
      </p>
    </div>
  );
};

export default Header;
