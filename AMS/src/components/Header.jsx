import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../ThemeContext";

function Header() {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const [navVisible, setNavVisible] = useState(false);
  const [captainDropdownOpen, setCaptainDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const captainDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const toggleNav = () => setNavVisible(!navVisible);
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  // روابط لوحة الإدارة فقط
  const adminLinks = [
    { path: "/AdminDash", label: "admin_dashboard" },
    { path: "/AdminRegister", label: "AdminRegister" },
  ];

  // روابط عامة بدون روابط لوحة الإدارة والتسجيل
  const generalLinks = [
    { path: "/", label: "home" },
    { path: "/about", label: "about_us" },
    { path: "/contact", label: "contact" },
    { path: "/wallet", label: "wallet" },
  ];

  const captainLinks = [
    { path: "/captain/login", label: "captain_login" },
    { path: "/captain/register", label: "captain_register" },
  ];

  const accountLinks = [
    { path: "/UserProfile", label: "user_profile" },
    { path: "/UserEditProfile", label: "edit_profile" },
    { path: "/PointHistory", label: "point" },
    { path: "/ProductList", label: "cart" },
    { path: "/services", label: "services" },
    { path: "/my-orders", label: "my_orders" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        captainDropdownRef.current &&
        !captainDropdownRef.current.contains(event.target)
      ) {
        setCaptainDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`${
        darkMode
          ? "bg-gray-900 text-gray-100 shadow-lg"
          : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 text-white shadow-lg"
      } sticky top-0 z-50 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4 md:py-6">
        {/* شعار */}
        <div className="text-2xl font-extrabold tracking-wide select-none cursor-default">
          AMS
        </div>

        {/* روابط لوحة الإدارة فقط في شاشات كبيرة */}
        <nav className="hidden md:flex items-center space-x-6 font-medium text-lg">
          {adminLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="relative px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition duration-300"
            >
              {t(label)}
            </Link>
          ))}

          {/* روابط عامة */}
          {generalLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="relative px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition duration-300"
            >
              {t(label)}
            </Link>
          ))}

          {/* Dropdown حساب المستخدم */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold hover:bg-yellow-300 hover:text-black transition duration-300"
            >
              {t("account")}
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  userDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2
                ring-1 ring-black ring-opacity-5
                dark:ring-gray-700
                z-50"
              >
                {accountLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-yellow-300 hover:text-black transition rounded-lg"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    {t(label)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown كابتن */}
          <div className="relative" ref={captainDropdownRef}>
            <button
              onClick={() => setCaptainDropdownOpen(!captainDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold hover:bg-yellow-300 hover:text-black transition duration-300"
            >
              {t("captain")}
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  captainDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {captainDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2
                ring-1 ring-black ring-opacity-5
                dark:ring-gray-700
                z-50"
              >
                {captainLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-yellow-300 hover:text-black transition rounded-lg"
                    onClick={() => setCaptainDropdownOpen(false)}
                  >
                    {t(label)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* إعدادات اللغة والثيم في الشاشات الكبيرة */}
        <div className="hidden md:flex items-center space-x-5 text-lg font-semibold select-none">
          <button
            onClick={() => changeLanguage("en")}
            className="px-2 py-1 rounded-md hover:bg-yellow-300 hover:text-black transition duration-300"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className="px-2 py-1 rounded-md hover:bg-yellow-300 hover:text-black transition duration-300"
          >
            AR
          </button>
          <button
            onClick={toggleTheme}
            className="text-2xl hover:text-yellow-300 transition duration-300"
            aria-label="Toggle theme"
            title="تبديل الوضع"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* الشريط الصغير - أزرار اللغة والثيم بجانب الهامبرغر */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => changeLanguage("en")}
            className="px-2 py-1 rounded-md hover:bg-yellow-300 hover:text-black transition duration-300"
            aria-label="Change language to English"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className="px-2 py-1 rounded-md hover:bg-yellow-300 hover:text-black transition duration-300"
            aria-label="Change language to Arabic"
          >
            AR
          </button>
          <button
            onClick={toggleTheme}
            className="text-2xl hover:text-yellow-300 transition duration-300"
            aria-label="Toggle theme"
            title="تبديل الوضع"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* زر الهامبرغر للشاشات الصغيرة */}
          <button
            onClick={toggleNav}
            className="focus:outline-none p-2 rounded-md hover:bg-yellow-300 hover:text-black transition duration-300"
            aria-label="Toggle navigation menu"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 100 80"
              fill={darkMode ? "#facc15" : "#1f2937"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="15" rx="3" />
              <rect y="30" width="100" height="15" rx="3" />
              <rect y="60" width="100" height="15" rx="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {navVisible && (
        <nav
          className={`md:hidden px-5 pb-6 rounded-b-lg shadow-lg ${
            darkMode
              ? "bg-gray-900 text-gray-100"
              : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 text-white"
          }`}
        >
          <div className="flex flex-col gap-3 font-semibold text-lg">
            {/* روابط لوحة الإدارة فقط */}
            {adminLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="block px-3 py-3 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                onClick={() => setNavVisible(false)}
              >
                {t(label)}
              </Link>
            ))}

            {/* روابط عامة */}
            {generalLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="block px-3 py-3 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                onClick={() => setNavVisible(false)}
              >
                {t(label)}
              </Link>
            ))}

            {/* روابط حساب المستخدم */}
            <div className="mt-4 border-t border-yellow-300 pt-3">
              <div className="px-3 mb-2 text-yellow-300 font-bold text-xl">
                {t("account")}
              </div>
              {accountLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="block px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                  onClick={() => setNavVisible(false)}
                >
                  {t(label)}
                </Link>
              ))}
            </div>

            {/* روابط الكابتن */}
            <div className="mt-4 border-t border-yellow-300 pt-3">
              <div className="px-3 mb-2 text-yellow-300 font-bold text-xl">
                {t("captain")}
              </div>
              {captainLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="block px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                  onClick={() => setNavVisible(false)}
                >
                  {t(label)}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
