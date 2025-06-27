// CaptainDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CaptainMap from "./CaptainMap";
import { useNavigate, Link } from "react-router-dom";

// 🔹 استخراج بيانات التوكن
const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

// 🔹 جلب الطلبات الخاصة بالكابتن
const fetchOrders = async (token, captainName) => {
  const res = await axios.get(
    "https://my-backend-dgp2.onrender.com/api/all/orders",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.filter(
    (order) =>
      order.captainName?.toLowerCase() === captainName.toLowerCase()
  );
};

// 🔹 جلب بيانات الكابتن (من خلال التوكن فقط)
const fetchCaptainProfile = async (token) => {
  const res = await axios.get(
    `https://my-backend-dgp2.onrender.com/api/captains/profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// 🔹 رفع صورة جديدة
const uploadCaptainImage = async (token, captainId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.put(
    `https://my-backend-dgp2.onrender.com/api/captains/upload-profile/${captainId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.profileImage;
};

// 🔹 تحديث حالة الكابتن (status)
const updateCaptainStatus = async (token, captainId, newStatus) => {
  const res = await axios.patch(
    `https://my-backend-dgp2.onrender.com/api/captains/${captainId}/status`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const CaptainDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainId, setCaptainId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 تحميل البيانات عند الدخول
  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("captainToken");
      if (!token) return navigate("/captain/login");

      const payload = parseJwt(token);
      if (!payload || !payload.id || !payload.name)
        return navigate("/captain/login");

      setCaptainName(payload.name);
      setCaptainId(payload.id);

      try {
        setLoading(true);

        const [ordersData, profileData] = await Promise.all([
          fetchOrders(token, payload.name),
          fetchCaptainProfile(token),
        ]);

        setOrders(ordersData);
        setProfileImage(profileData.profileImage || "");
        setStatus(profileData.status || "available"); // تعيين الحالة الافتراضية
      } catch (err) {
        setError("فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // 🔹 رفع صورة
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !captainId) return;

    const token = localStorage.getItem("captainToken");
    if (!token) return navigate("/captain/login");

    try {
      const imageUrl = await uploadCaptainImage(token, captainId, file);
      setProfileImage(imageUrl);
      alert("تم رفع الصورة بنجاح");
    } catch {
      alert("فشل رفع الصورة");
    }
  };

  // 🔹 تبديل حالة الكابتن بين available و resting
  const handleStatusToggle = async () => {
    const token = localStorage.getItem("captainToken");
    if (!token) return navigate("/captain/login");

    const newStatus = status === "available" ? "resting" : "available";

    try {
      const updatedCaptain = await updateCaptainStatus(token, captainId, newStatus);
      setStatus(updatedCaptain.status);
      alert(`تم تغيير الحالة إلى: ${updatedCaptain.status === "available" ? "متاح" : "استراحة"}`);
    } catch {
      alert("فشل تحديث الحالة");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("captainToken");
    navigate("/captain/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg font-semibold">
          جارٍ تحميل الطلبات...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

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

        {/* صورة الملف الشخصي */}
        <div className="mb-6 flex flex-col items-start gap-4">
          <div className="flex items-center gap-6">
            {profileImage ? (
              <img
                src={profileImage}
                alt="صورة الكابتن"
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                لا توجد صورة
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
          </div>

          {/* زر تبديل الحالة */}
          <button
            onClick={handleStatusToggle}
            className={`font-semibold px-4 py-2 rounded transition ${
              status === "available"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {status === "available" ? "ابدأ استراحة" : "أوقف الاستراحة"}
          </button>
        </div>

        {/* الطلبات */}
        <section>
          <h2 className="text-xl font-semibold mb-4">الطلبات المكتملة الخاصة بك</h2>
          {orders.length === 0 ? (
            <p>لا توجد طلبات مكتملة.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order._id} className="p-4 bg-white rounded shadow">
                  <p><strong>رقم الطلب:</strong> {order._id}</p>
                  <p><strong>اسم العميل:</strong> {order.customerName}</p>
                  <p><strong>العنوان:</strong> {order.address}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* الخريطة */}
        <section className="mt-8">
          <CaptainMap captainName={captainName} orders={orders} />
        </section>
      </main>
    </div>
  );
};

export default CaptainDashboard;
