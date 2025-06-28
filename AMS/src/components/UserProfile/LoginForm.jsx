import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";
import { Link } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://my-backend-dgp2.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userToken", data.token);
        onLoginSuccess();
      } else {
        alert(data.message || t("login_failed"));
      }
    } catch (error) {
      alert(t("error_occurred_try_again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto px-6 py-8 rounded-lg
      transition-colors
      border
      "
      style={{
        borderColor: darkMode ? "#FBBF24" : "#8B5CF6",
        backgroundColor: darkMode ? "#1F2937" : "#F3F4F6",
        color: darkMode ? "#FBBF24" : "#5B21B6"
      }}
    >
      <div className="flex flex-col">
        <label className={`mb-2 font-semibold`} style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}>
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

      <div className="flex flex-col">
        <label className={`mb-2 font-semibold`} style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}>
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
        <div className="text-right mt-2">
          <Link
            to="/forgot-password"
            className={`text-sm underline`}
            style={{ color: darkMode ? "#FBBF24" : "#8B5CF6" }}
          >
            {t("forgot_password") || "هل نسيت كلمة المرور؟"}
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md font-semibold transition`}
        style={{
          backgroundColor: darkMode ? "#FBBF24" : "#8B5CF6",
          color: darkMode ? "#4B235E" : "#FFFFFF",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? t("logging_in") : t("login")}
      </button>
    </form>
  );
}
