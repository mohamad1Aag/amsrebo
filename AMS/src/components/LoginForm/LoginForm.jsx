import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label
          className={`mb-2 font-semibold ${
            darkMode ? "text-yellow-400" : "text-purple-800"
          }`}
        >
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

      <div className="flex flex-col">
        <label
          className={`mb-2 font-semibold ${
            darkMode ? "text-yellow-400" : "text-purple-800"
          }`}
        >
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

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md font-semibold transition ${
          darkMode
            ? "bg-yellow-400 hover:bg-yellow-300 text-purple-900"
            : "bg-purple-700 hover:bg-purple-800 text-white"
        }`}
      >
        {loading ? t("logging_in") : t("login")}
      </button>
    </form>
  );
}
