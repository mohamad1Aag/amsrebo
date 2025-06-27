import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // جلب الإيميل باستخدام التوكن
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch(`https://my-backend-dgp2.onrender.com/api/users/reset-password-info/${token}`);
        const data = await res.json();
        if (res.ok) {
          setEmail(data.email);
        } else {
          setError(data.message || 'فشل جلب البريد الإلكتروني');
        }
      } catch (err) {
        setError('فشل الاتصال بالخادم');
      }
    };
    fetchEmail();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch(`https://my-backend-dgp2.onrender.com/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000); // توجيه تلقائي بعد 3 ثواني
      } else {
        setError(data.message || 'فشل إعادة تعيين كلمة المرور');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-center">كلمة مرور جديدة</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
        />

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          تأكيد
        </button>

        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>

      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          العودة إلى تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
