import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../layouts/Sidebar";
import { ThemeContext } from "../../../src/ThemeContext";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../../src/i18n";
import { useParams } from "react-router-dom";

export default function Orders() {
  const { userId } = useParams(); // استخدم useParams لجلب userId من الرابط إذا موجود
  const [orders, setOrders] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // جلب الطلبات
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "https://my-backend-dgp2.onrender.com/api/all/orders";
        if (userId) {
          url = `https://my-backend-dgp2.onrender.com/api/orders/user/${userId}`;
        }
        const response = await axios.get(url);
        setOrders(response.data);
      } catch (error) {
        setError("فشل في جلب الطلبات. حاول مرة أخرى لاحقاً.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  // جلب الكباتن
  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await axios.get(
          "https://my-backend-dgp2.onrender.com/api/captains"
        );
        setCaptains(response.data);
      } catch (error) {
        console.error("فشل جلب الكباتن", error.message);
      }
    };
    fetchCaptains();
  }, []);

  // تحديث حالة الطلب
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`https://my-backend-dgp2.onrender.com/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (error) {
      alert("فشل تحديث حالة الطلب.");
    }
  };

  // تعيين كابتن للطلب
  const assignCaptain = async (orderId, captainName) => {
    try {
      await axios.patch(
        `https://my-backend-dgp2.onrender.com/api/orders/${orderId}/assign-captain-name`,
        { captainName }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, captainName } : o))
      );
    } catch (error) {
      alert("فشل تعيين اسم الكابتن.");
    }
  };

  // حذف الطلب
  const deleteOrder = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await axios.delete(`https://my-backend-dgp2.onrender.com/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  // طباعة الفاتورة
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.text("فاتورة الطلب", 14, 10);
    doc.autoTable({
      head: [["المنتج", "الكمية", "السعر"]],
      body: order.products.map((p) => [p.name, p.quantity || 1, `${p.price.toFixed(2)} ر.س`]),
    });
    doc.text(`الإجمالي: ${order.total.toFixed(2)} ر.س`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`العميل: ${order.userId?.name || "مجهول"}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(
      `التاريخ: ${new Date(order.createdAt).toLocaleDateString("ar-EG")}`,
      14,
      doc.lastAutoTable.finalY + 30
    );
    doc.save(`فاتورة-${order._id}.pdf`);
  };

  // تصفية الطلبات
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.includes(searchTerm) ||
      (order.userId?.name && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      <div className="flex-1 p-4 sm:p-6">
        {/* العنوان وزر القائمة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h1
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-black" : "text-gray-900"
            }`}
          >
            {t("orders_management") || "إدارة الطلبات"}
          </h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden px-3 py-2 bg-blue-600 text-black rounded"
          >
            {t("menu") || "القائمة"}
          </button>
        </div>

        {/* البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder={t("search_orders") || "ابحث برقم الطلب أو اسم العميل..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${
              darkMode ? "text-black" : "text-gray-900"
            }`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${
              darkMode ? "text-black" : "text-gray-900"
            }`}
          >
            <option value="">كل الحالات</option>
            <option value="جديد">جديد</option>
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="بانتظار التوصيل">بانتظار التوصيل</option>
            <option value="قيد التوصيل">قيد التوصيل</option>
            <option value="مكتمل">مكتمل</option>
            <option value="مرفوض">مرفوض</option>
          </select>
        </div>

        {/* عرض الحالة */}
        {loading && (
          <p className={`mb-4 text-center ${darkMode ? "text-black" : "text-gray-900"}`}>
            {t("loading") || "جارٍ التحميل..."}
          </p>
        )}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        {/* جدول الطلبات */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow text-sm">
          <table className="min-w-full text-right">
            <thead
              className={`bg-gray-200 dark:bg-gray-700 ${
                darkMode ? "text-black" : "text-gray-700"
              }`}
            >
              <tr>
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1">رقم الطلب</th>
                <th className="px-2 py-1">العميل</th>
                <th className="px-2 py-1">عدد المنتجات</th>
                <th className="px-2 py-1">الإجمالي</th>
                <th className="px-2 py-1">الحالة</th>
                <th className="px-2 py-1">كابتن التوصيل</th>
                <th className="px-2 py-1">ملاحظات</th>
                <th className="px-2 py-1">الموقع</th>
                <th className="px-2 py-1">التاريخ</th>
                <th className="px-2 py-1">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm">
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {idx + 1}
                      </td>
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {order._id}
                      </td>
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {order.userId?.name || "مجهول"}
                      </td>
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {order.products?.length || 0}
                      </td>
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {order.total?.toFixed(2)} ر.س
                      </td>
                      <td className="px-2 py-1">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`px-2 py-1 rounded text-black cursor-pointer text-xs
                            ${
                              order.status === "مكتمل"
                                ? "bg-green-600"
                                : order.status === "مرفوض"
                                ? "bg-red-600"
                                : order.status === "قيد التنفيذ"
                                ? "bg-yellow-500"
                                : order.status === "بانتظار التوصيل"
                                ? "bg-purple-600"
                                : order.status === "قيد التوصيل"
                                ? "bg-blue-600"
                                : "bg-gray-500"
                            }`}
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد التنفيذ">قيد التنفيذ</option>
                          <option value="بانتظار التوصيل">بانتظار التوصيل</option>
                          <option value="قيد التوصيل">قيد التوصيل</option>
                          <option value="مكتمل">مكتمل</option>
                          <option value="مرفوض">مرفوض</option>
                        </select>
                      </td>

                      {/* اختيار كابتن التوصيل */}
                      <td className="px-2 py-1">
                        <select
                          value={order.captainName || ""}
                          onChange={(e) => assignCaptain(order._id, e.target.value)}
                          className="p-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-black"
                        >
                          <option value="">-- اختر كابتن --</option>
                          {captains.map((captain) => (
                            <option key={captain._id} value={captain.name}>
                              {captain.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td
                        className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1 max-w-xs truncate`}
                      >
                        {order.notes || "-"}
                      </td>
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {order.deliveryLocation
                          ? `${order.deliveryLocation.lat.toFixed(4)}, ${order.deliveryLocation.lng.toFixed(4)}`
                          : "-"}
                      </td>
                      <td className={`${darkMode ? "text-black" : "text-gray-900"} px-2 py-1`}>
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-2 py-1 space-y-1 flex flex-wrap gap-1">
                        <button
                          onClick={() => updateStatus(order._id, "قيد التنفيذ")}
                          className="bg-green-600 hover:bg-green-700 text-black px-2 py-1 rounded text-xs"
                        >
                          قبول الطلب
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "قيد التوصيل")}
                          className="bg-purple-600 hover:bg-purple-700 text-black px-2 py-1 rounded text-xs"
                        >
                          بدء التوصيل
                        </button>
                        <button
                          onClick={() => generateInvoice(order)}
                          className="bg-green-500 hover:bg-green-600 text-black px-2 py-1 rounded text-xs"
                        >
                          طباعة
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-black px-2 py-1 rounded text-xs">
                          عرض
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs">
                          تعديل
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="bg-red-500 hover:bg-red-600 text-black px-2 py-1 rounded text-xs"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                    {/* تفاصيل المنتجات */}
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan="11" className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        <strong>المنتجات:</strong>
                        <div className="overflow-x-auto mt-2">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600 text-right text-xs sm:text-sm rounded-md">
                            <thead className="bg-gray-200 dark:bg-gray-600 rounded-t-md">
                              <tr>
                                <th className="border px-2 py-1 rounded-tl-md">الاسم</th>
                                <th className="border px-2 py-1">النوع</th>
                                <th className="border px-2 py-1">الكمية</th>
                                <th className="border px-2 py-1 rounded-tr-md">السعر</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((product, i) => (
                                <tr
                                  key={i}
                                  className={`border px-2 py-1 ${
                                    i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"
                                  }`}
                                >
                                  <td className="border px-2 py-1">{product.name}</td>
                                  <td className="border px-2 py-1">{product.type || "مفرق"}</td>
                                  <td className="border px-2 py-1">{product.quantity || 1}</td>
                                  <td className="border px-2 py-1">{product.price.toFixed(2)} ر.س</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    {/* فاصل بين الطلبات */}
                    <tr>
                      <td colSpan="11">
                        <div
                          className="my-8 h-2 rounded-lg"
                          style={{
                            background: darkMode
                              ? "linear-gradient(90deg, #4c51bf, #667eea)"
                              : "linear-gradient(90deg, #667eea, #63b3ed)",
                          }}
                        ></div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className={`text-center py-4 ${darkMode ? "text-black" : "text-gray-500"}`}
                  >
                    لا توجد طلبات مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
