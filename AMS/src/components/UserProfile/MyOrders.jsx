import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../Header";  // الهيدر الأساسي اللي بدك ياه
import { ThemeContext } from "../../ThemeContext";
import { useTranslation } from "react-i18next";

const statusTranslation = {
  pending: { ar: "قيد الانتظار", en: "Pending" },
  confirmed: { ar: "تم التأكيد", en: "Confirmed" },
  delivered: { ar: "مكتمل", en: "Delivered" },
  canceled: { ar: "ملغى", en: "Canceled" },
};

function StarRating({ rating, setRating, readOnly = false }) {
  return (
    <div className="flex space-x-1 rtl:space-x-reverse justify-center sm:justify-start">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && setRating(star)}
          className={`text-2xl focus:outline-none ${
            star <= rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-600"
          }`}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function MyOrders() {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [captainsImages, setCaptainsImages] = useState({});
  const [modalImage, setModalImage] = useState(null);

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return null;
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      const decoded = JSON.parse(payload);
      return decoded.userId || decoded.id || decoded._id;
    } catch (err) {
      console.error("خطأ في فك التوكن:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError(t("user_not_known"));
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://my-backend-dgp2.onrender.com/api/orders/user/${userId}`
        );
        const ordersData = response.data;

        const feedbackPromises = ordersData.map((order) =>
          axios
            .get(`https://my-backend-dgp2.onrender.com/api/feedback/${order._id}`)
            .then(
              (res) => ({ orderId: order._id, feedback: res.data }),
              (err) => {
                if (err.response && err.response.status === 404) {
                  return { orderId: order._id, feedback: null };
                } else {
                  throw err;
                }
              }
            )
        );

        const uniqueCaptainNames = [
          ...new Set(ordersData.map((order) => order.captainName).filter(Boolean)),
        ];

        const captainImagePromises = uniqueCaptainNames.map((name) =>
          axios
            .get(`https://my-backend-dgp2.onrender.com/api/captains/by-name/${encodeURIComponent(name)}`)
            .then(
              (res) => ({ name, profileImage: res.data.profileImage }),
              () => ({ name, profileImage: "" })
            )
        );

        const feedbacks = await Promise.all(feedbackPromises);
        const captainImagesData = await Promise.all(captainImagePromises);

        const ratingsData = {};
        feedbacks.forEach(({ orderId, feedback }) => {
          if (feedback && feedback.rating) {
            ratingsData[orderId] = {
              rating: feedback.rating,
              comment: feedback.comment || "",
              readOnly: true,
            };
          }
        });

        const imagesData = {};
        captainImagesData.forEach(({ name, profileImage }) => {
          imagesData[name] = profileImage || "";
        });

        setOrders(ordersData);
        setRatings(ratingsData);
        setCaptainsImages(imagesData);
      } catch (err) {
        setError(t("fetch_orders_error"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [t]);

  const handleRatingChange = (orderId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        rating,
      },
    }));
  };

  const handleCommentChange = (orderId, comment) => {
    setRatings((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        comment,
      },
    }));
  };

  const handleSubmitFeedback = async (orderId, userId, captainName) => {
    const feedback = ratings[orderId];
    if (!feedback || !feedback.rating) {
      alert(t("please_rate_first") || "يرجى اختيار التقييم أولاً");
      return;
    }
    setSubmitting((prev) => ({ ...prev, [orderId]: true }));
    try {
      await axios.post("https://my-backend-dgp2.onrender.com/api/feedback", {
        orderId,
        userId,
        captainName,
        rating: feedback.rating,
        comment: feedback.comment || "",
      });
      alert(t("thank_you_feedback") || "تم حفظ التقييم بنجاح");
      setRatings((prev) => ({
        ...prev,
        [orderId]: { ...prev[orderId], readOnly: true },
      }));
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "تم إرسال تقييم لهذا الطلب مسبقًا"
      ) {
        alert(t("feedback_already_submitted") || "لقد قمت بالتقييم مسبقًا");
        setRatings((prev) => ({
          ...prev,
          [orderId]: { ...prev[orderId], readOnly: true },
        }));
      } else {
        alert(t("feedback_submission_error") || "حدث خطأ أثناء إرسال التقييم");
      }
      console.error(error);
    } finally {
      setSubmitting((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div
          className="p-6 text-center text-gray-500 dark:text-gray-400"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          style={{
            backgroundColor: darkMode ? "#121212" : "#f9fafb",
            minHeight: "100vh",
          }}
        >
          {t("loading_orders")}
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div
          className="p-6 text-center text-red-600 font-semibold"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          style={{
            backgroundColor: darkMode ? "#121212" : "#f9fafb",
            minHeight: "100vh",
          }}
        >
          {error}
        </div>
      </>
    );

  return (
    <>
      {/* الهيدر الأساسي برا كل شيء */}
      <Header />

      {/* المحتوى */}
      <main
        className={`p-4 sm:p-6 max-w-5xl mx-auto transition-colors duration-500 min-h-screen ${
          i18n.language === "ar" ? "text-right" : "text-left"
        }`}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        style={{
          backgroundColor: darkMode ? "#121212" : "#f9fafb",
          color: darkMode ? "#e0e0e0" : "#1f2937",
        }}
      >
        {orders.length === 0 ? (
          <p className={`text-center text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t("no_orders_yet")}
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const feedback = ratings[order._id] || {};
              const isReadOnly = feedback.readOnly;
              const captainImage = captainsImages[order.captainName] || "";

              const statusColors = {
                pending: {
                  light: "bg-yellow-200 text-yellow-800",
                  dark: "bg-yellow-700 text-yellow-300",
                },
                confirmed: {
                  light: "bg-blue-200 text-blue-800",
                  dark: "bg-blue-700 text-blue-300",
                },
                delivered: {
                  light: "bg-green-200 text-green-800",
                  dark: "bg-green-700 text-green-300",
                },
                canceled: {
                  light: "bg-red-200 text-red-800",
                  dark: "bg-red-700 text-red-300",
                },
                default: {
                  light: "bg-gray-200 text-gray-800",
                  dark: "bg-gray-700 text-gray-300",
                },
              };

              const statusKey = order.status.toLowerCase();
              const statusClass =
                statusColors[statusKey]?.[darkMode ? "dark" : "light"] ||
                statusColors.default[darkMode ? "dark" : "light"];

              return (
                <div
                  key={order._id}
                  className={`border rounded-lg shadow-sm hover:shadow-lg p-6 ${
                    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                    <h3
                      className={`text-lg font-semibold break-all ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {t("order_number")}:{" "}
                      <span className={`font-normal ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {order._id}
                      </span>
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
                    >
                      {(statusTranslation[order.status] &&
                        statusTranslation[order.status][i18n.language]) ||
                        order.status}
                    </span>
                  </div>

                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{t("total")}:</p>
                      <p className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        {order.total.toFixed(2)} ر.س
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("date")}:</p>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString(
                          i18n.language === "ar" ? "ar-EG" : "en-US"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("product_count")}:</p>
                      <p>{order.products.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse">
                        {t("captain_name") || "اسم الكابتن"}:
                        {captainImage && (
                          <img
                            src={captainImage}
                            alt={order.captainName}
                            className="w-8 h-8 rounded-full ml-2 rtl:mr-2 object-cover cursor-pointer"
                            onClick={() => setModalImage(captainImage)}
                          />
                        )}
                      </p>
                      <p className={`font-semibold truncate ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        {order.captainName || t("no_captain_assigned") || "لم يتم تعيين كابتن"}
                      </p>
                    </div>
                  </div>

                  <details className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    <summary className="cursor-pointer font-semibold mb-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                      {t("show_products_details")} ▼
                    </summary>
                    <ul className="list-disc list-inside space-y-1 max-h-48 overflow-auto">
                      {order.products.map((product, index) => (
                        <li key={index} className="text-sm break-words">
                          {product.name} — {product.quantity} ×{" "}
                          {product.price.toFixed(2)} ر.س
                        </li>
                      ))}
                    </ul>
                  </details>

                  {order.status === "مكتمل" && (
                    <div className="mt-6 p-4 border-t border-gray-300 dark:border-gray-700">
                      <h4
                        className={`text-lg font-semibold mb-2 ${
                          darkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {t("rate_your_order")}
                      </h4>
                      <StarRating
                        rating={feedback.rating || 0}
                        setRating={(rating) => handleRatingChange(order._id, rating)}
                        readOnly={isReadOnly}
                      />
                      <textarea
                        className="w-full mt-2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder={t("leave_comment")}
                        rows={3}
                        value={feedback.comment || ""}
                        onChange={(e) => handleCommentChange(order._id, e.target.value)}
                        disabled={isReadOnly}
                      />
                      {!isReadOnly && (
                        <button
                          disabled={submitting[order._id]}
                          onClick={() =>
                            handleSubmitFeedback(
                              order._id,
                              getUserIdFromToken(),
                              order.captainName
                            )
                          }
                          className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
                        >
                          {submitting[order._id]
                            ? t("submitting") || "جارٍ الإرسال..."
                            : t("submit_feedback") || "إرسال التقييم"}
                        </button>
                      )}
                      {isReadOnly && (
                        <p className="mt-2 text-green-600 dark:text-green-400 font-semibold">
                          {t("feedback_already_submitted") || "لقد قمت بالتقييم مسبقًا"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={() => setModalImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative max-w-lg max-h-full p-4 bg-white rounded-md dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-red-600 text-2xl font-bold"
                aria-label="Close image modal"
              >
                &times;
              </button>
              <img
                src={modalImage}
                alt="كابتن"
                className="max-w-full max-h-[80vh] rounded-md object-contain"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
