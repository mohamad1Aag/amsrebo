import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [currentRole, setCurrentRole] = useState(''); // دور الأدمن الحالي
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // تأكد من وجود التوكن

  useEffect(() => {
    fetchAdmins();
    decodeToken(); // لمعرفة دور الأدمن الحالي
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('https://my-backend-dgp2.onrender.com/api/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      setMessage('فشل في تحميل الأدمنات');
    }
  };

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentRole(payload.role);
    } catch {
      setCurrentRole('');
    }
  };

  const upgradeToAdmin = async (id) => {
    try {
      await axios.patch(`https://my-backend-dgp2.onrender.com/api/admin/update-role/${id}`,
        { role: 'admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('تمت ترقية المستخدم بنجاح');
      fetchAdmins(); // إعادة تحميل
    } catch (err) {
      setMessage(err.response?.data?.message || 'فشل في الترقية');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-right">قائمة الأدمنات</h2>
      {message && <p className="mb-4 text-red-500 text-center">{message}</p>}
      <div className="grid gap-4">
        {admins.map((admin) => (
          <div
            key={admin._id}
            className="flex items-center justify-between p-4 bg-white rounded shadow text-right"
          >
            <div>
              <p className="font-semibold">{admin.username}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
              <p className="text-sm">الدور: {admin.role}</p>
            </div>

            {currentRole === 'admin' && admin.role === 'miniadmin' && (
              <button
                onClick={() => upgradeToAdmin(admin._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ترقية إلى أدمن
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
