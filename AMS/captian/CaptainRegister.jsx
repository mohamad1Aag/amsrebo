import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../src/ThemeContext"; // عدل حسب مسار مشروعك
import Header from "../src/components/Header"; // عدل حسب مكان ملف الهيدر

const CaptainRegister = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post(
        "https://my-backend-dgp2.onrender.com/api/captains/register",
        { name, phone, email, password }
      );

      if (res.status === 201) {
        setSuccessMsg(t("register_success") || "تم التسجيل بنجاح! سيتم تحويلك لتسجيل الدخول...");
        setTimeout(() => navigate("/captain/login"), 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(t("register_error") || "حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
      }
    }
  };

  // تغيير اللغة (en/ar)
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gray-900 text-black"  // نص أسود بالداكن
          : "bg-gradient-to-r from-purple-700 to-indigo-600 text-gray-900"
      }`}
    >
      {/* الهيدر الأساسي */}
      <Header toggleLanguage={toggleLanguage} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full transition-colors duration-300"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-black">
            {t("captain_register") || "تسجيل كابتن جديد"}
          </h2>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMsg}</div>
          )}

          <label htmlFor="name" className="block mb-2 font-semibold dark:text-black">
            {t("full_name") || "الاسم الكامل"}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("enter_full_name") || "أدخل الاسم الكامل"}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
          />

          <label htmlFor="phone" className="block mb-2 font-semibold dark:text-black">
            {t("phone_number") || "رقم الهاتف"}
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder={t("enter_phone") || "أدخل رقم الهاتف"}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
          />

          <label htmlFor="email" className="block mb-2 font-semibold dark:text-black">
            {t("email") || "البريد الإلكتروني"}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("enter_email") || "أدخل البريد الإلكتروني"}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
          />

          <label htmlFor="password" className="block mb-2 font-semibold dark:text-black">
            {t("password") || "كلمة المرور"}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("enter_password") || "أدخل كلمة المرور"}
            className="w-full p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
          />

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded font-semibold transition"
          >
            {t("register") || "تسجيل"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CaptainRegister;
