import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainRegister = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // ✅ حقل البريد الإلكتروني
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post(
        "https://my-backend-dgp2.onrender.com/api/captains/register",
        { name, phone, email, password } // ✅ أرسل البريد الإلكتروني مع البيانات
      );

      if (res.status === 201) {
        setSuccessMsg("تم التسجيل بنجاح! سيتم تحويلك لتسجيل الدخول...");
        setTimeout(() => navigate("/captain/login"), 2000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
          تسجيل كابتن جديد
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMsg}</div>
        )}

        {/* الاسم الكامل */}
        <label htmlFor="name" className="block mb-2 font-semibold">
          الاسم الكامل
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="أدخل الاسم الكامل"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* رقم الهاتف */}
        <label htmlFor="phone" className="block mb-2 font-semibold">
          رقم الهاتف
        </label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="أدخل رقم الهاتف"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* البريد الإلكتروني */}
        <label htmlFor="email" className="block mb-2 font-semibold">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="أدخل البريد الإلكتروني"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* كلمة المرور */}
        <label htmlFor="password" className="block mb-2 font-semibold">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="أدخل كلمة المرور"
          className="w-full p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded font-semibold transition"
        >
          تسجيل
        </button>
      </form>
    </div>
  );
};

export default CaptainRegister;
