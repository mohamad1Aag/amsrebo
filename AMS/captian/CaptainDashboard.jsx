import React, { useEffect, useState } from "react";
import axios from "axios";
import CaptainMap from "./CaptainMap";
import { useNavigate, Link, Outlet } from "react-router-dom";

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const CaptainDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [captainName, setCaptainName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("captainToken");
      if (!token) {
        navigate("/captain/login");
        return;
      }

      const payload = parseJwt(token);
      if (!payload || !payload.name) {
        navigate("/captain/login");
        return;
      }
      setCaptainName(payload.name);

      try {
        setLoading(true);
        // جلب الطلبات من السيرفر مع الفلترة (هنا تأكد أن API يرجع فقط طلبات الكابتن نفسه)
        const res = await axios.get("https://my-backend-dgp2.onrender.com/api/all/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(
          res.data.filter(order =>
            order.captainName?.toLowerCase() === payload.name.toLowerCase()
          )
        )} catch (err) {
        setError("فشل تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("captainToken");
    navigate("/captain/login");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg font-semibold">جارٍ تحميل الطلبات...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-purple-800">لوحة الكابتن</h2>

        <nav className="flex flex-col gap-4">
          <Link
            to="/captain/dashboard/orders"
            className="text-purple-700 hover:text-purple-900 font-semibold"
          >
            الطلبات الخاصة بي
          </Link>
          {/* يمكن تضيف روابط أخرى هنا */}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          تسجيل خروج
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-800">
          مرحباً <span className="text-purple-700">{captainName}</span>
        </h1>

        {/* هنا نعرض الطلبات في قائمة */}
        <section>
          <h2 className="text-xl font-semibold mb-4">الطلبات المكتملة الخاصة بك</h2>

          {orders.length === 0 ? (
            <p>لا توجد طلبات مكتملة.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="p-4 bg-white rounded shadow">
                  <p><strong>رقم الطلب:</strong> {order.id}</p>
                  <p><strong>اسم العميل:</strong> {order.customerName}</p>
                  <p><strong>العنوان:</strong> {order.address}</p>
                  {/* ممكن تضيف تفاصيل إضافية */}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* لو تحب تعرض الخريطة أسفل الطلبات */}
        <section className="mt-8">
          <CaptainMap captainName={captainName} orders={orders} />
        </section>
      </main>
    </div>
  );
};

export default CaptainDashboard;