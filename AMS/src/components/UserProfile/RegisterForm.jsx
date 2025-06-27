import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";

export default function RegisterForm() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // ✅ الحقل الجديد
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://my-backend-dgp2.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }), // ✅ إضافة phone
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("register_success_message"));
        setName("");
        setEmail("");
        setPhone(""); // ✅ إعادة تعيين الحقل
        setPassword("");
      } else {
        alert(data.message || t("register_failed"));
      }
    } catch (error) {
      alert(t("error_occurred_try_again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {/* الاسم الكامل */}
      <div className="flex flex-col">
        <label className={`mb-2 font-semibold ${darkMode ? "text-yellow-400" : "text-purple-800"}`}>
          {t("full_name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-yellow-400 focus:ring-yellow-300 bg-gray-800 text-white"
              : "border-purple-300 focus:ring-purple-500 bg-white text-black"
          }`}
        />
      </div>

      {/* البريد الإلكتروني */}
      <div className="flex flex-col">
        <label className={`mb-2 font-semibold ${darkMode ? "text-yellow-400" : "text-purple-800"}`}>
          {t("email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-yellow-400 focus:ring-yellow-300 bg-gray-800 text-white"
              : "border-purple-300 focus:ring-purple-500 bg-white text-black"
          }`}
        />
      </div>

      {/* رقم الهاتف */}
      <div className="flex flex-col">
        <label className={`mb-2 font-semibold ${darkMode ? "text-yellow-400" : "text-purple-800"}`}>
          {t("phone") || "رقم الهاتف"}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-yellow-400 focus:ring-yellow-300 bg-gray-800 text-white"
              : "border-purple-300 focus:ring-purple-500 bg-white text-black"
          }`}
        />
      </div>

      {/* كلمة المرور */}
      <div className="flex flex-col">
        <label className={`mb-2 font-semibold ${darkMode ? "text-yellow-400" : "text-purple-800"}`}>
          {t("password")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-yellow-400 focus:ring-yellow-300 bg-gray-800 text-white"
              : "border-purple-300 focus:ring-purple-500 bg-white text-black"
          }`}
        />
      </div>

      {/* زر التسجيل */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md font-semibold transition ${
          darkMode
            ? "bg-yellow-400 hover:bg-yellow-300 text-purple-900"
            : "bg-purple-700 hover:bg-purple-800 text-white"
        }`}
      >
        {loading ? t("registering") : t("register")}
      </button>
    </form>
  );
}
