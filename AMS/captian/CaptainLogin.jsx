import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainLogin = ({ onCaptainLogin }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("https://my-backend-dgp2.onrender.com/api/captains/login", {
        phone,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("captainToken", res.data.token);
        onCaptainLogin(); // ✅ نحدث الحالة فوراً بدون reload
        navigate("/CaptainDashboard");
      } else {
        setErrorMsg("فشل في تسجيل الدخول. حاول مرة أخرى.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("حدث خطأ أثناء تسجيل الدخول.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
          تسجيل دخول الكابتن
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>
        )}

        <label className="block mb-2 font-semibold" htmlFor="phone">
          رقم الهاتف
        </label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="أدخل رقم الهاتف"
        />

        <label className="block mb-2 font-semibold" htmlFor="password">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-6"
          placeholder="أدخل كلمة المرور"
        />

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded font-semibold transition"
        >
          تسجيل دخول
        </button>
      </form>
    </div>
  );
};

export default CaptainLogin;
