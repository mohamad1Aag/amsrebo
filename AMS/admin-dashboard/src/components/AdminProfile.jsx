import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../../../src/components/Header";
import Sidebar from "../../src/layouts/Sidebar";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../src/ThemeContext";

const AdminProfile = () => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [profile, setProfile] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setMessage(t("not_logged_in") || "لم يتم تسجيل الدخول");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://my-backend-dgp2.onrender.com/api/admin/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile({
          username: res.data.username,
          email: res.data.email,
          password: "",
        });
      } catch (err) {
        setMessage(err.response?.data?.message || t("fetch_error") || "خطأ في جلب البيانات");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token, t]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!profile.username || !profile.email) {
      setMessage(t("username_email_required") || "الاسم والبريد الإلكتروني مطلوبان");
      return;
    }

    try {
      const body = { username: profile.username, email: profile.email };
      if (profile.password.trim() !== "") {
        body.password = profile.password;
      }

      const res = await axios.put(
        "https://my-backend-dgp2.onrender.com/api/admin/profile",
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setProfile((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setMessage(err.response?.data?.message || t("update_error") || "خطأ في تحديث البيانات");
    }
  };

  if (loading) {
    return (
      <div
        className={`p-4 max-w-md mx-auto text-center ${
          darkMode ? "text-white" : "text-gray-700"
        }`}
      >
        {t("loading") || "جارٍ تحميل البيانات..."}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main
          className={`flex-1 p-6 max-w-md mx-auto mt-8 rounded shadow ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } text-right`}
          dir="rtl"
        >
          <h2 className="text-2xl font-bold mb-6">{t("admin_profile") || "ملف الأدمن"}</h2>

          {message && (
            <p
              className={`mb-4 text-center ${
                message.includes("خطأ") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold">{t("username") || "اسم المستخدم"}:</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300"
              required
            />

            <label className="block mb-2 font-semibold">{t("email") || "البريد الإلكتروني"}:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300"
              required
            />

            <label className="block mb-2 font-semibold">
              {t("new_password_optional") || "كلمة المرور الجديدة (اختياري):"}
            </label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              placeholder={t("leave_blank_if_no_change") || "اتركها فارغة إذا لا تريد التغيير"}
              className="w-full p-3 mb-6 border rounded outline-none focus:ring focus:ring-blue-300"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              {t("save_changes") || "حفظ التغييرات"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
