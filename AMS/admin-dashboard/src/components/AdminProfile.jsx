import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('لم يتم تسجيل الدخول');
        return;
      }

      try {
        const res = await axios.get('https://my-backend-dgp2.onrender.com/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || 'خطأ في جلب البيانات');
      }
    };

    fetchProfile();
  }, []);

  if (message) {
    return (
      <div className="p-4 max-w-md mx-auto text-center text-red-600">
        {message}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        جارٍ تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow mt-8 text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-4">ملف الأدمن</h2>
      <p><strong>الاسم:</strong> {profile.username}</p>
      <p><strong>البريد الإلكتروني:</strong> {profile.email}</p>
      <p><strong>الدور:</strong> {profile.role}</p>
    </div>
  );
};

export default AdminProfile;
