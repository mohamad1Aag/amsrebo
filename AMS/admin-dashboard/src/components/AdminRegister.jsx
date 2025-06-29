import React, { useState } from 'react';
import axios from 'axios';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage('يرجى تعبئة جميع الحقول');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', {
        username,
        email,
        password,
      });

      setMessage(res.data.message);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'حدث خطأ في التسجيل');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-right"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل أدمن جديد</h2>

        <input
          type="text"
          placeholder="اسم المستخدم"
          className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full p-3 mb-6 border rounded outline-none focus:ring focus:ring-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          تسجيل
        </button>

        {message && (
          <p className="text-red-600 mt-4 text-center">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AdminRegister;
