import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../src/ThemeContext";
import Header from "../src/components/Header";
import { useTranslation } from "react-i18next";

// دالة لفك تشفير JWT واستخراج البايلود
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function CaptainOrders() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [captainName, setCaptainName] = useState("");

  // تغيير اللغة (en/ar)
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const token = localStorage.getItem("captainToken");
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const payload = parseJwt(token);
    if (!payload || !payload.name) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const name = payload.name;
    setCaptainName(name);

    axios
      .get(
        `https://my-backend-dgp2.onrender.com/api/orders/captain/${encodeURIComponent(
          name
        )}`
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.warn(t("unexpected_response") || "الرد ليس مصفوفة كما هو متوقع:", response.data);
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error(t("fetch_error") || "خطأ في جلب الطلبات:", error);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

  if (loading)
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <p className={`${darkMode ? "text-white" : "text-gray-600"} text-lg font-semibold`}>
          {t("loading") || "جارٍ التحميل..."}
        </p>
      </div>
    );

  return (
    <div className={`${darkMode ? "bg-gray-900 text-black" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col`}>
      {/* الهيدر مع التحكم باللغتين والدارك مود */}
      <Header toggleLanguage={toggleLanguage} toggleDarkMode={toggleDarkMode} />

      <div className="max-w-4xl mx-auto p-6 shadow rounded w-full">
        {!orders.length ? (
          <p className={`${darkMode ? "text-black" : "text-red-500"} text-center text-lg font-semibold`}>
            {t("no_completed_orders_for") || "لا توجد طلبات مكتملة للكابتن"} {captainName}
          </p>
        ) : (
          <>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-green-600" : "text-green-700"}`}>
              {t("completed_orders_for") || "الطلبات المكتملة للكابتن"} {captainName}
            </h2>
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className={`border p-4 rounded-md shadow-sm ${
                    darkMode ? "bg-gray-700 text-black" : "bg-gray-50"
                  }`}
                >
                  <p>
                    <strong>{t("order_number") || "رقم الطلب:"}</strong> {order._id}
                  </p>
                  <p>
                    <strong>{t("total") || "المجموع:"}</strong> {order.total} ل.س
                  </p>
                  <p>
                    <strong>{t("address") || "العنوان:"}</strong>{" "}
                    {order.deliveryLocation
                      ? `Lat: ${order.deliveryLocation.lat}, Lng: ${order.deliveryLocation.lng}`
                      : t("not_available") || "غير متوفر"}
                  </p>
                  <p>
                    <strong>{t("status") || "الحالة:"}</strong> {order.status}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default CaptainOrders;
