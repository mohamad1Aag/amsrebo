import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginForm from "./LoginForm";
import Header from "../Header";
import { ThemeContext } from "../../ThemeContext";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://my-backend-dgp2.onrender.com/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("فشل جلب بيانات المستخدم");

        const data = await res.json();
        setUserData(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading)
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
        <Header />
        <div className="flex-1 flex items-center justify-center font-semibold">
          {t("loading_data")}...
        </div>
      </div>
    );

  if (!userData) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200"}`}>
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className={`rounded-xl shadow-lg p-8 max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
              {t("please_login")}
            </h2>
            <LoginForm onLoginSuccess={() => window.location.reload()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200"}`}>
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`rounded-xl shadow-lg p-8 max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
            {t("edit_user_data")}
          </h2>
          {/* <PointsBlock points={userData.point ?? 0} />  تم إزالة عرض النقاط */}
          <EditUserForm userData={userData} setUserData={setUserData} />
        </div>
      </div>
    </div>
  );
}

// تمت إزالة مكون PointsBlock لأنه لم يعد مستخدماً

function EditUserForm({ userData, setUserData }) {
  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("userToken");

    try {
      const body = { name, email, phone };
      if (password) body.password = password;

      const res = await fetch("https://my-backend-dgp2.onrender.com/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(t("update_failed"));

      alert(t("update_success"));

      const updatedRes = await fetch("https://my-backend-dgp2.onrender.com/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setUserData(updatedData);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-purple-800">{t("name")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-purple-800">{t("email")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-purple-800">{t("phone")}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-purple-800">{t("new_password_optional")}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("enter_new_password_if_wanted")}
          className="px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {userData.googleId && (
        <div className="text-sm text-green-500">🟢 {t("logged_in_with_google")}</div>
      )}

      {userData.facebookId && (
        <div className="text-sm text-blue-600">🔵 {t("logged_in_with_facebook")}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-md font-semibold transition disabled:opacity-50"
      >
        {loading ? t("updating") + "..." : t("update_data")}
      </button>
    </form>
  );
}
