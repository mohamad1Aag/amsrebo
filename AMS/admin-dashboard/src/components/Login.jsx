import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://my-backend-dgp2.onrender.com/api/admin/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setMessage('✅ تسجيل الدخول ناجح');
      onLogin({ email });
      navigate('/AdminDash');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ فشل تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-900">تسجيل دخول الأدمن</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded font-semibold transition"
          >
            تسجيل الدخول
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-semibold ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
