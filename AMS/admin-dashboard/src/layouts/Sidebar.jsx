import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../src/ThemeContext"; // عدل المسار حسب مشروعك
import { useTranslation } from "react-i18next";

function Sidebar({ isOpen, onClose }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed top-0 left-0 h-full w-64 shadow-lg z-50 transition-transform duration-300
            ${
              darkMode
                ? "bg-gray-900 text-gray-100"
                : "bg-gradient-to-b from-purple-800 via-pink-600 to-yellow-100 text-purple-900"
            }`}
        >
          <div
            className={`flex items-center justify-between p-4 border-b 
              ${darkMode ? "border-gray-700" : "border-white/20"}`}
          >
            <h2 className="text-xl font-bold select-none cursor-default">AMS Admin</h2>
            <button
              onClick={onClose}
              className={`hover:text-yellow-300 transition ${
                darkMode ? "text-gray-100" : "text-white"
              }`}
              aria-label="Close sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col p-4 space-y-2 text-base font-medium">
            <li>
              <Link
                to="/AdminDash"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("dashboard") || "Dashboard"}
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("users") || "المستخدمون"}
              </Link>
            </li>
            <li>
              <Link
                to="/SliderUpload"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("slider") || "إدارة السلايدر"}
              </Link>
            </li>
            <li>
              <Link
                to="/AdminList"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("AdminList") || "إدارة الادمن"}
              </Link>
            </li>
            <li>
              <Link
                to="/AdminProfile"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("AdminProfile") || "إدارة الحساب للادمن"}
              </Link>
            </li>

            <li>
              <Link
                to="/Product"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("products") || "المنتجات"}
              </Link>
            </li>
            <li>
              <Link
                to="/Category"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("categories") || "التصنيفات"}
              </Link>
            </li>
            <li>
              <Link
                to="/Orders"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("orders") || "الطلبات"}
              </Link>
            </li>
            <li>
              <Link
                to="/Reports"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("reports") || "التقارير"}
              </Link>
            </li>
            <li>
              <Link
                to="/Feedback"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("feedback") || "التقييمات"}
              </Link>
            </li>
            <li>
              <Link
                to="/Settings"
                className={`block px-3 py-2 rounded transition 
                  hover:bg-yellow-300 hover:text-black
                  ${darkMode ? "text-gray-100" : "text-purple-900"}`}
                onClick={onClose}
              >
                {t("settings") || "الإعدادات"}
              </Link>
            </li>
          </ul>

          {/* خيارات اللغة واللون */}
          <div
            className={`mt-auto p-4 border-t 
              ${darkMode ? "border-gray-700" : "border-white/20"}`}
          >
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 rounded-md transition
                  hover:bg-yellow-300 hover:text-black
                  ${i18n.language === "en" ? "bg-yellow-300 text-black" : darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-purple-900"}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("ar")}
                className={`px-3 py-1 rounded-md transition
                  hover:bg-yellow-300 hover:text-black
                  ${i18n.language === "ar" ? "bg-yellow-300 text-black" : darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-purple-900"}`}
              >
                AR
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={`w-full py-2 rounded-md font-semibold transition
                ${
                  darkMode
                    ? "bg-yellow-300 text-black hover:bg-yellow-400"
                    : "bg-purple-900 text-white hover:bg-purple-800"
                }`}
            >
              {darkMode ? "تبديل للوضع الفاتح" : "تبديل للوضع الداكن"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
