import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../src/ThemeContext"; // عدل حسب مسار مشروعك
import Header from "../src/components/Header"; // عدل المسار حسب مكان الهيدر عندك

const CaptainLogin = ({ onCaptainLogin }) => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(
        "https://my-backend-dgp2.onrender.com/api/captains/login",
        {
          phone,
          password,
        }
      );

      if (res.data.token) {
        localStorage.setItem("captainToken", res.data.token);
        onCaptainLogin();
        navigate("/CaptainDashboard");
      } else {
        setErrorMsg(t("login_failed") || "فشل في تسجيل الدخول. حاول مرة أخرى.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(t("login_error") || "حدث خطأ أثناء تسجيل الدخول.");
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
          ? "bg-gray-900 text-black"  // هنا النص أسود بالداكن
          : "bg-gradient-to-r from-purple-700 to-indigo-600 text-gray-900"
      }`}
    >
      {/* استدعاء الهيدر الأساسي */}
      <Header toggleLanguage={toggleLanguage} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className={`bg-white dark:bg-gray-800 p-8 rounded shadow-md max-w-md w-full transition-colors duration-300`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-black">
            {t("captain_login") || "تسجيل دخول الكابتن"}
          </h2>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>
          )}

          <label className="block mb-2 font-semibold dark:text-black" htmlFor="phone">
            {t("phone_number") || "رقم الهاتف"}
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
            placeholder={t("enter_phone") || "أدخل رقم الهاتف"}
          />

          <label className="block mb-2 font-semibold dark:text-black" htmlFor="password">
            {t("password") || "كلمة المرور"}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-6 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
            placeholder={t("enter_password") || "أدخل كلمة المرور"}
          />

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded font-semibold transition"
          >
            {t("login") || "تسجيل دخول"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CaptainLogin;
