import React, { useEffect, useState } from "react";
import axios from "axios";

// دالة لفك تشفير JWT واستخراج البيانات منه
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function PointHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("userToken");
  const decoded = token ? parseJwt(token) : null;
  const userId = decoded ? decoded.id : null;

  useEffect(() => {
    async function fetchHistory() {
      if (!token || !userId) {
        setError("لم يتم تسجيل الدخول أو معرف المستخدم غير موجود");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://my-backend-dgp2.onrender.com/api/users/point-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        setError("فشل في جلب سجل النقاط");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [token, userId]);

  if (loading) return <p>...جاري التحميل</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!history.length) return <p>لا يوجد سجل للعمليات.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">سجل النقاط</h2>
      <ul className="space-y-3">
        {history.map((item) => {
          const isPositive = item.pointsChanged > 0;

          return (
            <li
              key={item._id}
              className={`border p-4 rounded shadow-sm ${
                isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="text-sm mb-1 text-gray-600">
                {new Date(item.date).toLocaleString()}
              </div>
              <div className="font-semibold">
                {item.type}: {item.pointsChanged} نقطة
              </div>
              <div>{item.description}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PointHistory;
