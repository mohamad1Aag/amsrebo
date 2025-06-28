import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CaptainMap from "./CaptainMap";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../src/ThemeContext";
import Header from "../src/components/Header";
import { useTranslation } from "react-i18next";

const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const fetchOrders = async (token, captainName) => {
  const res = await axios.get(
    "https://my-backend-dgp2.onrender.com/api/all/orders",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.filter(
    (order) => order.captainName?.toLowerCase() === captainName.toLowerCase()
  );
};

const fetchCaptainProfile = async (token) => {
  const res = await axios.get(
    `https://my-backend-dgp2.onrender.com/api/captains/profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const uploadCaptainImage = async (token, captainId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.put(
    `https://my-backend-dgp2.onrender.com/api/captains/upload-profile/${captainId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.profileImage;
};

const updateCaptainStatus = async (token, captainId, newStatus) => {
  const res = await axios.patch(
    `https://my-backend-dgp2.onrender.com/api/captains/${captainId}/status`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const CaptainDashboard = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainId, setCaptainId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة إظهار الـ sidebar في الشاشات الصغيرة
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("captainToken");
      if (!token) return navigate("/captain/login");

      const payload = parseJwt(token);
      if (!payload || !payload.id || !payload.name)
        return navigate("/captain/login");

      setCaptainName(payload.name);
      setCaptainId(payload.id);

      try {
        setLoading(true);

        const [ordersData, profileData] = await Promise.all([
          fetchOrders(token, payload.name),
          fetchCaptainProfile(token),
        ]);

        setOrders(ordersData);
        setProfileImage(profileData.profileImage || "");
        setStatus(profileData.status || "available");
      } catch (err) {
        setError(t("load_error") || "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, t]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !captainId) return;

    const token = localStorage.getItem("captainToken");
    if (!token) return navigate("/captain/login");

    try {
      const imageUrl = await uploadCaptainImage(token, captainId, file);
      setProfileImage(imageUrl);
      alert(t("upload_success") || "تم رفع الصورة بنجاح");
    } catch {
      alert(t("upload_fail") || "فشل رفع الصورة");
    }
  };

  const handleStatusToggle = async () => {
    const token = localStorage.getItem("captainToken");
    if (!token) return navigate("/captain/login");

    const newStatus = status === "available" ? "resting" : "available";

    try {
      const updatedCaptain = await updateCaptainStatus(token, captainId, newStatus);
      setStatus(updatedCaptain.status);
      alert(
        updatedCaptain.status === "available"
          ? t("status_available") || "تم تغيير الحالة إلى: متاح"
          : t("status_resting") || "تم تغيير الحالة إلى: استراحة"
      );
    } catch {
      alert(t("status_update_fail") || "فشل تحديث الحالة");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("captainToken");
    navigate("/captain/login");
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <p className={`${darkMode ? "text-white" : "text-gray-600"} text-lg font-semibold`}>
          {t("loading_orders") || "جارٍ تحميل الطلبات..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-black" : "bg-gray-100 text-gray-900"
      } min-h-screen flex flex-col`}
    >
      <Header
        toggleLanguage={() => {
          const newLang = i18n.language === "ar" ? "en" : "ar";
          i18n.changeLanguage(newLang);
          document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        }}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex flex-grow flex-col md:flex-row">
        {/* زر لإظهار وإخفاء sidebar في الشاشات الصغيرة */}
        <button
          className="md:hidden p-3 m-2 bg-purple-700 text-white rounded focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "إخفاء القائمة" : "عرض القائمة"}
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 p-6 flex flex-col shadow-md ${
            darkMode ? "bg-gray-800 text-black" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-2xl font-bold mb-8 text-purple-800 dark:text-purple-400">
            {t("captain_dashboard") || "لوحة الكابتن"}
          </h2>
          <nav className="flex flex-col gap-4">
            <Link
              to="/captain/dashboard/orders"
              className="text-purple-700 hover:text-purple-900 font-semibold dark:text-purple-300"
              onClick={() => setSidebarOpen(false)} // إغلاق القائمة بعد اختيار الرابط في الشاشات الصغيرة
            >
              {t("my_orders") || "الطلبات الخاصة بي"}
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            {t("logout") || "تسجيل خروج"}
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">
            {t("welcome") || "مرحباً"}{" "}
            <span className="text-purple-700 dark:text-purple-400">{captainName}</span>
          </h1>

          {/* صورة الملف الشخصي */}
          <div className="mb-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-6">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={t("captain_image_alt") || "صورة الكابتن"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {t("no_image") || "لا توجد صورة"}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={`cursor-pointer ${darkMode ? "text-black" : ""}`}
              />
            </div>

            {/* زر تبديل الحالة */}
            <button
              onClick={handleStatusToggle}
              className={`font-semibold px-4 py-2 rounded transition ${
                status === "available"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              {status === "available"
                ? t("start_rest") || "ابدأ استراحة"
                : t("stop_rest") || "أوقف الاستراحة"}
            </button>
          </div>

          {/* الطلبات */}
          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-black">
              {t("completed_orders") || "الطلبات المكتملة الخاصة بك"}
            </h2>
            {orders.length === 0 ? (
              <p className={darkMode ? "text-black" : ""}>
                {t("no_completed_orders") || "لا توجد طلبات مكتملة."}
              </p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className={`p-4 rounded shadow ${
                      darkMode ? "bg-gray-700 text-black" : "bg-white"
                    }`}
                  >
                    <p>
                      <strong>{t("order_number") || "رقم الطلب:"}</strong> {order._id}
                    </p>
                    <p>
                      <strong>{t("customer_name") || "اسم العميل:"}</strong>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <strong>{t("address") || "العنوان:"}</strong> {order.address}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* الخريطة */}
          <section className="mt-8">
            <CaptainMap captainName={captainName} orders={orders} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default CaptainDashboard;
