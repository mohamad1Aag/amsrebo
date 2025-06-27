import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../../src/ThemeContext";
import { useTranslation } from "react-i18next";

export default function AdminFeedbackTable() {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // إذا عندك API لكل التقييمات:
        const response = await axios.get("https://my-backend-dgp2.onrender.com/api/feedback");
        setFeedbacks(response.data);
      } catch (err) {
        setError(t("fetch_feedback_error") || "خطأ في جلب التقييمات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [t]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {t("loading_feedbacks") || "جاري تحميل التقييمات..."}
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {error}
      </div>
    );

  return (
    <div
      className={`p-4 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded shadow-md overflow-x-auto ${
        darkMode ? "text-gray-200" : "text-gray-900"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {t("all_feedbacks") || "جميع التقييمات"}
      </h2>
      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">{t("order_id") || "رقم الطلب"}</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">{t("user_id") || "رقم المستخدم"}</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">{t("captain_name") || "اسم الكابتن"}</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">{t("rating") || "التقييم"}</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">{t("comment") || "التعليق"}</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">{t("date") || "التاريخ"}</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                {t("no_feedbacks") || "لا توجد تقييمات حتى الآن"}
              </td>
            </tr>
          ) : (
            feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 break-words">{fb.orderId}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 break-words">{fb.userId}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{fb.captainName}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-yellow-400 font-bold">
                  {"★".repeat(fb.rating) + "☆".repeat(5 - fb.rating)}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{fb.comment || "-"}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  {new Date(fb.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
