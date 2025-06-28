import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";

export default function RegisterForm() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://my-backend-dgp2.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("register_success_message"));
        setName("");
        setEmail("");
        setPhone("");
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
    <form
      onSubmit={handleRegister}
      className="space-y-6 max-w-md mx-auto px-6 py-8 rounded-lg
                 transition-colors border
                 sm:w-full sm:px-4"
      style={{
        borderColor: darkMode ? "#FBBF24" : "#8B5CF6",
        backgroundColor: darkMode ? "#1F2937" : "#F3F4F6",
        color: darkMode ? "#FBBF24" : "#5B21B6",
      }}
    >
      {/* الاسم الكامل */}
      <div className="flex flex-col">
        <label
          className="mb-2 font-semibold"
          style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}
        >
          {t("full_name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition`}
          style={{
            borderColor: darkMode ? "#FBBF24" : "#8B5CF6",
            backgroundColor: darkMode ? "#374151" : "#FFFFFF",
            color: darkMode ? "#FBBF24" : "#4C1D95",
          }}
        />
      </div>

      {/* البريد الإلكتروني */}
      <div className="flex flex-col">
        <label
          className="mb-2 font-semibold"
          style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}
        >
          {t("email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition`}
          style={{
            borderColor: darkMode ? "#FBBF24" : "#8B5CF6",
            backgroundColor: darkMode ? "#374151" : "#FFFFFF",
            color: darkMode ? "#FBBF24" : "#4C1D95",
          }}
        />
      </div>

      {/* رقم الهاتف */}
      <div className="flex flex-col">
        <label
          className="mb-2 font-semibold"
          style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}
        >
          {t("phone") || "رقم الهاتف"}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition`}
          style={{
            borderColor: darkMode ? "#FBBF24" : "#8B5CF6",
            backgroundColor: darkMode ? "#374151" : "#FFFFFF",
            color: darkMode ? "#FBBF24" : "#4C1D95",
          }}
        />
      </div>

      {/* كلمة المرور */}
      <div className="flex flex-col">
        <label
          className="mb-2 font-semibold"
          style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}
        >
          {t("password")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition`}
          style={{
            borderColor: darkMode ? "#FBBF24" : "#8B5CF6",
            backgroundColor: darkMode ? "#374151" : "#FFFFFF",
            color: darkMode ? "#FBBF24" : "#4C1D95",
          }}
        />
      </div>

      {/* زر التسجيل */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md font-semibold transition`}
        style={{
          backgroundColor: darkMode ? "#FBBF24" : "#8B5CF6",
          color: darkMode ? "#4B235E" : "#FFFFFF",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? t("registering") : t("register")}
      </button>
    </form>
  );
}
