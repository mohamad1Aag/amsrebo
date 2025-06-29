import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../ThemeContext';
import Header from '../../../src/components/Header'; // تأكد من المسار حسب مشروعك

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://my-backend-dgp2.onrender.com/api/admin/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setMessage(t('login_success') || '✅ تسجيل الدخول ناجح');
      onLogin({ email });
      navigate('/AdminDash');
    } catch (err) {
      setMessage(err.response?.data?.message || t('login_failed') || '❌ فشل تسجيل الدخول');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-gray-900'}`}>
      <Header />
      <div className="flex items-center justify-center p-6">
        <div className={`max-w-md w-full rounded-xl shadow-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-3xl font-bold mb-6 text-center">
            {t('admin_login') || 'تسجيل دخول الأدمن'}
          </h2>
          <form onSubmit={handleLogin} className="space-y-5 text-right" dir="rtl">
            <input
              type="email"
              placeholder={t('email') || 'البريد الإلكتروني'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder={t('password') || 'كلمة المرور'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded font-semibold transition"
            >
              {t('login') || 'تسجيل الدخول'}
            </button>
          </form>

          {message && (
            <p className={`mt-6 text-center font-semibold ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
