import React, { useState, useContext } from "react";
import axios from "axios";
import Header from "../../../src/components/Header";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../src/ThemeContext";

const AdminRegister = () => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage(t("fill_all_fields") || "يرجى تعبئة جميع الحقول");
      return;
    }

    try {
      const res = await axios.post(
        "https://my-backend-dgp2.onrender.com/api/admin/register",
        {
          username,
          email,
          password,
        }
      );

      setMessage(res.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || t("registration_error") || "حدث خطأ في التسجيل"
      );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 text-right">
        <form
          onSubmit={handleSubmit}
          className={`bg-white ${
            darkMode ? "bg-gray-800 text-black" : ""
          } p-8 rounded-lg shadow-md w-full max-w-md`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("admin_register") || "تسجيل أدمن جديد"}
          </h2>

          <input
            type="text"
            placeholder={t("username") || "اسم المستخدم"}
            className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300 text-right"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder={t("email") || "البريد الإلكتروني"}
            className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300 text-right"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t("password") || "كلمة المرور"}
            className="w-full p-3 mb-6 border rounded outline-none focus:ring focus:ring-blue-300 text-right"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-black p-3 rounded hover:bg-blue-700 transition"
          >
            {t("register") || "تسجيل"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("خطأ") || message.includes("error")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
};

export default AdminRegister;
