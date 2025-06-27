import React, { useEffect, useState } from "react";
import axios from "axios";

// دالة لفك تشفير JWT واستخراج البايلود
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function CaptainOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [captainName, setCaptainName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("captainToken");
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const payload = parseJwt(token);
    if (!payload || !payload.name) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const name = payload.name;
    setCaptainName(name);

    axios
      .get(`https://my-backend-dgp2.onrender.com/api/orders/captain/${encodeURIComponent(name)}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.warn("الرد ليس مصفوفة كما هو متوقع:", response.data);
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error("خطأ في جلب الطلبات:", error);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">جارٍ التحميل...</p>;
  if (!orders.length)
    return (
      <p className="text-center text-red-500">
        لا توجد طلبات مكتملة للكابتن {captainName}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        الطلبات المكتملة للكابتن {captainName}
      </h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order._id}
            className="border p-4 rounded-md shadow-sm bg-gray-50"
          >
            <p><strong>رقم الطلب:</strong> {order._id}</p>
            <p><strong>المجموع:</strong> {order.total} ل.س</p>
            <p>
              <strong>العنوان:</strong>{" "}
              {order.deliveryLocation
                ? `Lat: ${order.deliveryLocation.lat}, Lng: ${order.deliveryLocation.lng}`
                : "غير متوفر"}
            </p>
            <p><strong>الحالة:</strong> {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CaptainOrders;
