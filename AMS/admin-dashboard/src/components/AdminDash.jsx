import React, { useState, useContext, useRef, useEffect } from "react";
import Sidebar from "../layouts/Sidebar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../src/ThemeContext"; // تأكد مسار ThemeContext عندك

// تسجيل مكونات ChartJS
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDash() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  // --- حالات الهيدر ---
  const [navVisible, setNavVisible] = useState(false);
  const [captainDropdownOpen, setCaptainDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const captainDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // روابط الهيدر
  const generalLinks = [
    { path: "/", label: "home" },
    { path: "/AdminDash", label: "admin_dashboard" },
    { path: "/about", label: "about_us" },
    { path: "/contact", label: "contact" },
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

  // إغلاق القوائم عند الضغط خارجها
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

  // تغيير اللغة
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  // بيانات المخططات
  const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const salesData = {
    labels,
    datasets: [
      {
        label: "المبيعات",
        data: [500, 700, 1200, 1800, 2200, 2700, 4000],
        borderColor: "#9333ea",
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersData = {
    labels,
    datasets: [
      {
        label: "الطلبات",
        data: [150, 200, 400, 600, 550, 700, 900],
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const visitorsData = {
    labels,
    datasets: [
      {
        label: "الزوار",
        data: [1000, 1200, 1500, 1700, 2000, 2500, 3000],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      {/* --- الهيدر --- */}
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

          {/* روابط الهيدر في شاشات كبيرة */}
          <nav className="hidden md:flex items-center space-x-6 font-medium text-lg">
            {generalLinks.map(({ path, label }) => (
              <a
                key={path}
                href={path}
                className="relative px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition duration-300"
              >
                {t(label)}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </a>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                    <a
                      key={path}
                      href={path}
                      className="block px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-yellow-300 hover:text-black transition rounded-lg"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      {t(label)}
                    </a>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                    <a
                      key={path}
                      href={path}
                      className="block px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-yellow-300 hover:text-black transition rounded-lg"
                      onClick={() => setCaptainDropdownOpen(false)}
                    >
                      {t(label)}
                    </a>
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

          {/* زر الهامبرغر للشاشات الصغيرة */}
          <button
            onClick={() => setNavVisible(!navVisible)}
            className="md:hidden focus:outline-none p-2 rounded-md hover:bg-yellow-300 hover:text-black transition duration-300"
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

        {/* قائمة الموبايل */}
        {navVisible && (
          <nav className="md:hidden bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 text-white px-5 pb-6 rounded-b-lg shadow-lg">
            <div className="flex flex-col gap-3 font-semibold text-lg">
              {/* روابط عامة */}
              {generalLinks.map(({ path, label }) => (
                <a
                  key={path}
                  href={path}
                  className="block px-3 py-3 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                  onClick={() => setNavVisible(false)}
                >
                  {t(label)}
                </a>
              ))}

              {/* روابط حساب المستخدم */}
              <div className="mt-4 border-t border-yellow-300 pt-3">
                <div className="px-3 mb-2 text-yellow-300 font-bold text-xl">
                  {t("account")}
                </div>
                {accountLinks.map(({ path, label }) => (
                  <a
                    key={path}
                    href={path}
                    className="block px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                    onClick={() => setNavVisible(false)}
                  >
                    {t(label)}
                  </a>
                ))}
              </div>

              {/* روابط الكابتن */}
              <div className="mt-4 border-t border-yellow-300 pt-3">
                <div className="px-3 mb-2 text-yellow-300 font-bold text-xl">
                  {t("captain")}
                </div>
                {captainLinks.map(({ path, label }) => (
                  <a
                    key={path}
                    href={path}
                    className="block px-3 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition"
                    onClick={() => setNavVisible(false)}
                  >
                    {t(label)}
                  </a>
                ))}
              </div>

              {/* إعدادات اللغة والثيم */}
              <div className="flex gap-5 mt-6 justify-center border-t border-yellow-300 pt-4">
                <button
                  onClick={() => changeLanguage("en")}
                  className="px-3 py-2 rounded-md hover:bg-yellow-300 hover:text-black transition"
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="px-3 py-2 rounded-md hover:bg-yellow-300 hover:text-black transition"
                >
                  AR
                </button>
                <button
                  onClick={toggleTheme}
                  className="text-3xl hover:text-yellow-300 transition"
                  aria-label="Toggle theme"
                  title="تبديل الوضع"
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* --- زر فتح السايدبار (يظهر فقط لو السايدبار مغلق) --- */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 bg-purple-600 rounded-md shadow-lg hover:bg-purple-700 transition z-50"
          aria-label="Toggle sidebar"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* --- الشريط الجانبي --- */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* --- المحتوى الرئيسي --- */}
      <div
        className={`min-h-screen p-8 ${
          darkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-200 text-black"
        }`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* مبيعات */}
          <div
            className={`rounded-xl shadow-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-center font-bold mb-2 ${
                darkMode ? "text-purple-400" : "text-purple-800"
              }`}
            >
              📊 المبيعات الأسبوعية
            </h3>
            <Line data={salesData} options={options} />
          </div>

          {/* الطلبات */}
          <div
            className={`rounded-xl shadow-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-center font-bold mb-2 ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              📦 الطلبات الأسبوعية
            </h3>
            <Line data={ordersData} options={options} />
          </div>

          {/* الزوار */}
          <div
            className={`rounded-xl shadow-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-center font-bold mb-2 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              👥 الزوار
            </h3>
            <Line data={visitorsData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}
