import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../Header";
import { ThemeContext } from "../../ThemeContext";
import { useTranslation } from "react-i18next";

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function translateDescriptionDynamic(desc, lang) {
  if (!desc) return "";

  if (lang === "ar") {
    // خصم نقاط شراء: -5000 points
    if (/خصم نقاط شراء: -\d+ points/.test(desc)) {
      const points = desc.match(/-\d+/)[0].replace("-", "");
      return `خصم نقاط شراء: ${points} نقطة`;
    }
    // تم خصم النقاط بعد تأكيد طلب الشراء
    if (desc === "Points were deducted after order confirmation") {
      return "تم خصم النقاط بعد تأكيد طلب الشراء";
    }
    // شحن نقاط: +100 points
    if (/شحن نقاط: \+\d+ points/.test(desc)) {
      const points = desc.match(/\+\d+/)[0].replace("+", "");
      return `شحن نقاط: ${points} نقطة`;
    }
    // تمت إضافة 100 نقطة بواسطة الإدارة
    if (/^\d+ points added by admin$/.test(desc)) {
      const points = desc.match(/^\d+/)[0];
      return `تمت إضافة ${points} نقطة بواسطة الإدارة`;
    }
  } else if (lang === "en") {
    // Purchase points deducted: -5000 نقطة
    if (/خصم نقاط شراء: -\d+ نقطة/.test(desc)) {
      const points = desc.match(/-\d+/)[0];
      return `Purchase points deducted: ${points} points`;
    }
    // Points were deducted after order confirmation
    if (desc === "تم خصم النقاط بعد تأكيد طلب الشراء") {
      return "Points were deducted after order confirmation";
    }
    // Points recharged: +100 نقطة
    if (/شحن نقاط: \+\d+ نقطة/.test(desc)) {
      const points = desc.match(/\+\d+/)[0];
      return `Points recharged: ${points} points`;
    }
    // 100 نقطة تمت إضافتها بواسطة الإدارة
    if (/^تمت إضافة \d+ نقطة بواسطة الإدارة$/.test(desc)) {
      const points = desc.match(/\d+/)[0];
      return `${points} points added by admin`;
    }
  }

  return desc;
}

export default function PointHistory() {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [history, setHistory] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("userToken");
  const decoded = token ? parseJwt(token) : null;
  const userId = decoded ? decoded.id : null;

  useEffect(() => {
    async function fetchData() {
      if (!token || !userId) {
        setError(t("not_logged_in") || "لم يتم تسجيل الدخول أو معرف المستخدم غير موجود");
        setLoading(false);
        return;
      }

      try {
        const [historyRes, userRes] = await Promise.all([
          axios.get(`https://my-backend-dgp2.onrender.com/api/users/point-history/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://my-backend-dgp2.onrender.com/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setHistory(historyRes.data);
        setUserPoints(userRes.data.point ?? 0);
      } catch (err) {
        setError(t("failed_fetch_point_history") || "فشل في جلب سجل النقاط");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, userId, t]);

  if (loading)
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
        <Header />
        <main className="flex-1 flex items-center justify-center font-semibold text-lg">
          {t("loading_data") || "...جاري التحميل"}
        </main>
      </div>
    );

  if (error)
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
        <Header />
        <main className="flex-1 flex items-center justify-center text-red-600 font-semibold p-6">
          {error}
        </main>
      </div>
    );

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200"
      }`}
    >
      <Header />
      <main className="flex-1 max-w-4xl mx-auto p-6 w-full">
        {/* نقاط المستخدم */}
        <div
          className={`mb-8 p-5 rounded-lg shadow-lg flex items-center justify-center gap-4 text-2xl font-bold
          ${
            darkMode
              ? "bg-yellow-400 text-purple-900 shadow-yellow-500/50"
              : "bg-purple-100 text-purple-800 shadow-purple-300"
          }
          `}
          aria-label={t("your_points") || "نقاطك الحالية"}
        >
          <span>⭐</span>
          <span>{t("your_points") || "نقاطك الحالية"}:</span>
          <span>{userPoints}</span>
        </div>

        {/* عنوان سجل النقاط */}
        <h2
          className={`text-3xl font-extrabold mb-6 text-center select-none
          ${darkMode ? "text-yellow-300" : "text-purple-900"}`}
        >
          {t("point_history") || "سجل النقاط"}
        </h2>

        {/* سجل النقاط */}
        {history.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">{t("no_point_history") || "لا يوجد سجل للعمليات."}</p>
        ) : (
          <ul className="space-y-5">
            {history.map((item) => {
              const isPositive = item.pointsChanged > 0;
              return (
                <li
                  key={item._id}
                  className={`p-5 rounded-lg shadow-md border flex flex-col gap-3
                  ${
                    isPositive
                      ? "bg-green-100 text-green-900 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                      : "bg-red-100 text-red-900 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                  }
                  `}
                >
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <time dateTime={item.date}>{new Date(item.date).toLocaleString()}</time>
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs select-none
                      ${
                        isPositive
                          ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                          : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"
                      }
                    `}
                    >
                      {isPositive ? (t("increase") || "زيادة +") : (t("deduction") || "خصم -")}
                    </span>
                  </div>

                  <div className="text-lg font-semibold">
                    {item.type}: {isPositive ? "+" : ""}
                    {item.pointsChanged} {t("points") || "نقطة"}
                  </div>

                  <div className="text-base leading-relaxed">
                    {translateDescriptionDynamic(item.description, i18n.language)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
