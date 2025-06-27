import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../ThemeContext";

function Header() {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [navVisible, setNavVisible] = useState(false);
  const [captainDropdownOpen, setCaptainDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleNav = () => setNavVisible(!navVisible);
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  // روابط عامة (أضفت رابط سجل النقاط هنا)
  const generalLinks = [
    { path: "/", label: "home" },
    { path: "/AdminDash", label: "admin_dashboard" },
    { path: "/services", label: "services" },
    { path: "/about", label: "about_us" },
    { path: "/contact", label: "contact" },
    { path: "/UserProfile", label: "user_profile" },
    { path: "/ProductList", label: "cart" },
    { path: "/UserEditProfile", label: "edit_profile" },
    { path: "/PointHistory", label: "point_history" }, // سجل النقاط
  ];

  // روابط خاصة بالكابتن داخل Dropdown
  const captainLinks = [
    { path: "/captain/login", label: "captain_login" },
    { path: "/captain/register", label: "captain_register" },
  ];

  // إغلاق الدروبداون عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCaptainDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-white"
      } shadow-md sticky top-0 z-50 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-6">

        {/* الشعار + روابط التنقل */}
        <div className="flex items-center space-x-8 flex-1">

          {/* الشعار */}
          <div className="font-bold text-xl md:text-2xl cursor-pointer select-none whitespace-nowrap">
            AMS
          </div>

          {/* روابط التنقل (تظهر في md وأكبر) */}
          <nav className="hidden md:flex gap-6 flex-1 items-center">
            {generalLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="px-3 py-2 hover:text-yellow-300 font-semibold whitespace-nowrap"
                onClick={() => setNavVisible(false)}
              >
                {t(label)}
              </Link>
            ))}

            {/* زر Dropdown الكابتن */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCaptainDropdownOpen(!captainDropdownOpen)}
                className="px-3 py-2 hover:text-yellow-300 font-semibold whitespace-nowrap flex items-center gap-1"
              >
                {t("captain")}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    captainDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {captainDropdownOpen && (
                <div
                  className={`absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded shadow-lg py-2 w-48 text-gray-900 dark:text-white`}
                >
                  {captainLinks.map(({ path, label }) => (
                    <Link
                      key={path}
                      to={path}
                      className="block px-4 py-2 hover:bg-yellow-300 hover:text-black transition font-semibold"
                      onClick={() => setCaptainDropdownOpen(false)}
                    >
                      {t(label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* أزرار اللغة + الثيم (يمين الشريط) - تظهر في md وأكبر */}
        <div className="hidden md:flex items-center gap-6 whitespace-nowrap">
          <button
            onClick={() => changeLanguage("en")}
            className="hover:text-yellow-300 font-semibold"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className="hover:text-yellow-300 font-semibold"
          >
            AR
          </button>
          <button
            onClick={toggleTheme}
            className="text-xl hover:text-yellow-300 transition"
            title="تبديل الوضع"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* زر الهامبرغر في الشاشات الصغيرة */}
        <button
          onClick={toggleNav}
          className="md:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 80"
            fill="#00b4db"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="15" rx="3"></rect>
            <rect y="30" width="100" height="15" rx="3"></rect>
            <rect y="60" width="100" height="15" rx="3"></rect>
          </svg>
        </button>
      </div>

      {/* روابط التنقل + أزرار اللغة + الثيم في الشاشات الصغيرة */}
      {navVisible && (
        <nav className="md:hidden bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-white px-4 pb-4">
          <div className="flex flex-col gap-3">
            {generalLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="block px-4 py-2 hover:text-yellow-300 font-semibold"
                onClick={() => setNavVisible(false)}
              >
                {t(label)}
              </Link>
            ))}

            {/* روابط الكابتن تظهر مباشرة في القائمة الصغيرة */}
            {captainLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="block px-4 py-2 hover:text-yellow-300 font-semibold"
                onClick={() => setNavVisible(false)}
              >
                {t(label)}
              </Link>
            ))}

            <div className="flex gap-4 mt-2 justify-center">
              <button
                onClick={() => changeLanguage("en")}
                className="hover:text-yellow-300 font-semibold"
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("ar")}
                className="hover:text-yellow-300 font-semibold"
              >
                AR
              </button>
              <button
                onClick={toggleTheme}
                className="text-xl hover:text-yellow-300 transition"
                title="تبديل الوضع"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
