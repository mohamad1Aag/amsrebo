import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../../../src/components/Header";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../src/ThemeContext";

export default function Feedback() {
  const { t, i18n } = useTranslation(); 
  const { darkMode } = useContext(ThemeContext);  // <--- هنا تعريف darkMode

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        "https://my-backend-dgp2.onrender.com/api/feedback",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks(res.data);
    } catch (err) {
      setError(t("fetch_feedback_error") || "خطأ في جلب التقييمات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // فلتر البحث باسم الكابتن أو التعليق
  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      fb.captainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
      
      return (
        <>
      
        <Header toggleSidebar={toggleSidebar} />
      {/* زر الهامبرغر لفتح القائمة الجانبية */}
      {!sidebarOpen && (
        <button
          className="fixed top-20 left-4 z-50 bg-white p-2 rounded-md shadow"
          onClick={toggleSidebar}
          aria-label={t("open_sidebar") || "فتح القائمة الجانبية"}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#00b4db"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#00b4db" strokeWidth="2" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* المحتوى */}
      <div
        className={`min-h-screen p-6 pt-24 ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black"
        }`}
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("all_feedbacks") || "جميع التقييمات"}
        </h2>

        {/* بحث */}
        <input
          type="text"
          placeholder={t("search_feedbacks") || "ابحث باسم الكابتن أو تعليق..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md mx-auto mb-6 px-4 py-2 rounded shadow border focus:outline-none focus:ring-2 ${
            darkMode
              ? "focus:ring-gray-400 bg-gray-800 text-white border-gray-700"
              : "focus:ring-purple-400 bg-white text-black border-gray-300"
          }`}
          aria-label={t("search_feedbacks") || "بحث التقييمات"}
        />

        {loading ? (
          <div className="text-center">{t("loading_feedbacks") || "جاري تحميل التقييمات..."}</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center font-semibold">
            {t("no_feedbacks") || "لا توجد تقييمات مطابقة"}
          </div>
        ) : (
          <div
            className={`overflow-x-auto rounded-lg shadow ${
              darkMode ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90"
            }`}
          >
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead
                className={`${
                  darkMode ? "bg-gray-700 text-white" : "bg-purple-800 text-white"
                }`}
              >
                <tr>
                  <th className="p-3 border border-gray-300">#</th>
                  <th className="p-3 border border-gray-300">{t("order_id") || "رقم الطلب"}</th>
                  <th className="p-3 border border-gray-300">{t("user_id") || "رقم المستخدم"}</th>
                  <th className="p-3 border border-gray-300">{t("captain_name") || "اسم الكابتن"}</th>
                  <th className="p-3 border border-gray-300">{t("rating") || "التقييم"}</th>
                  <th className="p-3 border border-gray-300">{t("comment") || "التعليق"}</th>
                  <th className="p-3 border border-gray-300">{t("date") || "التاريخ"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((fb, index) => (
                  <tr
                    key={fb._id}
                    className={`text-center border-b ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    } hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 break-words">{fb.orderId}</td>
                    <td className="p-3 break-words">{fb.userId}</td>
                    <td className="p-3">{fb.captainName}</td>
                    <td className="p-3 text-yellow-400 font-bold text-center">
                      {"★".repeat(fb.rating) + "☆".repeat(5 - fb.rating)}
                    </td>
                    <td className="p-3">{fb.comment || "-"}</td>
                    <td className="p-3">
                      {new Date(fb.createdAt).toLocaleDateString(
                        i18n.language === "ar" ? "ar-EG" : "en-US"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
