import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProfile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setMessage('لم يتم تسجيل الدخول');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('https://my-backend-dgp2.onrender.com/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // نعبّي البيانات (لكن بدون الباسوورد)
        setProfile({ 
          username: res.data.username, 
          email: res.data.email, 
          password: ''  // كلمة المرور فارغة افتراضيًا
        });
      } catch (err) {
        setMessage(err.response?.data?.message || 'خطأ في جلب البيانات');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!profile.username || !profile.email) {
      setMessage('الاسم والبريد الإلكتروني مطلوبان');
      return;
    }

    try {
      const body = { username: profile.username, email: profile.email };
      // نرسل الباسوورد فقط لو فيه تغيير (غير فارغ)
      if (profile.password.trim() !== '') {
        body.password = profile.password;
      }

      const res = await axios.put('https://my-backend-dgp2.onrender.com/api/admin/profile', body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);
      // نمسح الباسوورد بعد الحفظ
      setProfile(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage(err.response?.data?.message || 'خطأ في تحديث البيانات');
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        جارٍ تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow mt-8 text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">ملف الأدمن</h2>

      {message && (
        <p className={`mb-4 text-center ${message.includes('خطأ') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">اسم المستخدم:</label>
        <input
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300"
          required
        />

        <label className="block mb-2 font-semibold">البريد الإلكتروني:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded outline-none focus:ring focus:ring-blue-300"
          required
        />

        <label className="block mb-2 font-semibold">كلمة المرور الجديدة (اختياري):</label>
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          placeholder="اتركها فارغة إذا لا تريد التغيير"
          className="w-full p-3 mb-6 border rounded outline-none focus:ring focus:ring-blue-300"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          حفظ التغييرات
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
