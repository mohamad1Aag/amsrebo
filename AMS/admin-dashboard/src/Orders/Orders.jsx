import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../layouts/Sidebar";
import Header from "../../../src/components/Header"; // استيراد الهيدر - عدل المسار حسب مشروعك
import { ThemeContext } from "../../../src/ThemeContext";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../../src/i18n";
import { useParams } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// استيراد صور الأيقونات بطريقة import بدل require
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// إصلاح مشكلة أيقونة Marker في Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default function Orders() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
        setError(t("failed_fetch_orders") || "فشل في جلب الطلبات. حاول مرة أخرى لاحقاً.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, t]);

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await axios.get(
          "https://my-backend-dgp2.onrender.com/api/captains"
        );
        setCaptains(response.data);
      } catch (error) {
        console.error(t("failed_fetch_captains") || "فشل جلب الكباتن", error.message);
      }
    };
    fetchCaptains();
  }, [t]);

  const updateStatus = async (orderId, newStatus) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    if (order.status === t("completed") || order.status === "مكتمل") {
      alert(t("order_completed_cant_change") || "الطلب مكتمل ولا يمكن تغيير حالته.");
      return;
    }

    try {
      if (newStatus === t("completed") || newStatus === "مكتمل") {
        if (order.captainName) {
          await axios.patch(
            `https://my-backend-dgp2.onrender.com/api/orders/${orderId}/assign-captain-name`,
            { captainName: order.captainName }
          );
        }
      }

      await axios.patch(
        `https://my-backend-dgp2.onrender.com/api/orders/${orderId}/status`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      alert(t("failed_update_order_status") || "فشل تحديث حالة الطلب.");
    }
  };

  const assignCaptain = async (orderId, captainName) => {
    const order = orders.find((o) => o._id === orderId);
    if (order.status === t("completed") || order.status === "مكتمل") {
      alert(t("cant_change_captain_completed_order") || "لا يمكن تغيير اسم الكابتن للطلبات المكتملة.");
      return;
    }
    try {
      await axios.patch(
        `https://my-backend-dgp2.onrender.com/api/orders/${orderId}/assign-captain-name`,
        { captainName }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, captainName } : o))
      );
    } catch (error) {
      alert(t("failed_assign_captain") || "فشل تعيين اسم الكابتن.");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm(t("confirm_delete_order") || "هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await axios.delete(`https://my-backend-dgp2.onrender.com/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(t("error_deleting_order") || "حدث خطأ أثناء الحذف.");
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.text(t("invoice") || "فاتورة الطلب", 14, 10);
    doc.autoTable({
      head: [[t("product") || "المنتج", t("quantity") || "الكمية", t("price") || "السعر"]],
      body: order.products.map((p) => [p.name, p.quantity || 1, `${p.price.toFixed(2)} ر.س`]),
    });
    doc.text(`${t("total") || "الإجمالي"}: ${order.total.toFixed(2)} ر.س`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`${t("client") || "العميل"}: ${order.userId?.name || t("unknown") || "مجهول"}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(t("date") || `التاريخ: ${new Date(order.createdAt).toLocaleDateString("ar-EG")}`, 14, doc.lastAutoTable.finalY + 30);
    doc.save(`فاتورة-${order._id}.pdf`);
  };

  const openMapModal = (location, orderStatus) => {
    if (orderStatus === t("completed") || orderStatus === "مكتمل") {
      alert(t("order_completed_cant_edit_location") || "هذا الطلب مكتمل ولا يمكن تعديل موقعه.");
      return;
    }
    if (!location) {
      alert(t("no_order_location") || "لا يوجد موقع للطلب.");
      return;
    }
    setSelectedLocation(location);
    setModalOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.includes(searchTerm) ||
      (order.userId?.name && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userPhone && order.userPhone.includes(searchTerm));
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (<>
    {/* الهيدر */}
    <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

    {/* السايدبار */}
    <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
    <div
      className={`min-h-screen flex flex-col lg:flex-row ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >

      {/* المحتوى */}
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        {/* العنوان وزر القائمة للهاتف */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h1 className={`text-xl sm:text-2xl font-bold`}>
            {t("orders_management") || "إدارة الطلبات"}
          </h1>
          <button
            onClick={toggleSidebar}
            className={`lg:hidden px-3 py-2 rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-blue-600 text-black"
            }`}
            aria-label={t("toggle_menu") || "تبديل القائمة"}
          >
            {/* أيقونة هامبرغر */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder={t("search_orders") || "ابحث برقم الطلب أو اسم العميل..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            aria-label={t("search_orders") || "بحث الطلبات"}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`p-2 rounded border border-gray-300 dark:border-gray-700 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            aria-label={t("filter_by_status") || "فلترة حسب الحالة"}
          >
            <option value="">{t("all_statuses") || "كل الحالات"}</option>
            <option value="جديد">{t("new") || "جديد"}</option>
            <option value="قيد التنفيذ">{t("in_progress") || "قيد التنفيذ"}</option>
            <option value="بانتظار التوصيل">{t("waiting_delivery") || "بانتظار التوصيل"}</option>
            <option value="قيد التوصيل">{t("delivering") || "قيد التوصيل"}</option>
            <option value="مكتمل">{t("completed") || "مكتمل"}</option>
            <option value="مرفوض">{t("rejected") || "مرفوض"}</option>
          </select>
        </div>

        {/* حالات التحميل والخطأ */}
        {loading && (
          <p className="mb-4 text-center">
            {t("loading") || "جارٍ التحميل..."}
          </p>
        )}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        {/* جدول الطلبات */}
        <div
          className={`overflow-x-auto rounded shadow ${
            darkMode ? "bg-gray-800" : "bg-white"
          } text-sm`}
        >
          <table className="min-w-full text-right">
            <thead
              className={`${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <tr>
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1">{t("order_number") || "رقم الطلب"}</th>
                <th className="px-2 py-1">{t("client") || "العميل"}</th>
                <th className="px-2 py-1">{t("phone") || "رقم الهاتف"}</th>
                <th className="px-2 py-1">{t("products_count") || "عدد المنتجات"}</th>
                <th className="px-2 py-1">{t("total") || "الإجمالي"}</th>
                <th className="px-2 py-1">{t("status") || "الحالة"}</th>
                <th className="px-2 py-1">{t("captain") || "كابتن التوصيل"}</th>
                <th className="px-2 py-1">{t("notes") || "ملاحظات"}</th>
                <th className="px-2 py-1">{t("location") || "الموقع"}</th>
                <th className="px-2 py-1">{t("date") || "التاريخ"}</th>
                <th className="px-2 py-1">{t("actions") || "الإجراءات"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className={`border-b border-gray-300 dark:border-gray-600 ${
                        darkMode ? "bg-gray-900" : "bg-white"
                      } shadow-sm`}
                    >
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1">{order._id}</td>
                      <td className="px-2 py-1">{order.userId?.name || t("unknown") || "مجهول"}</td>
                      <td className="px-2 py-1">{order.userPhone || "-"}</td>
                      <td className="px-2 py-1">{order.products?.length || 0}</td>
                      <td className="px-2 py-1">{order.total?.toFixed(2)} ر.س</td>
                      <td className="px-2 py-1">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`px-2 py-1 rounded text-black cursor-pointer text-xs
                            ${
                              order.status === (t("completed") || "مكتمل")
                                ? "bg-green-600"
                                : order.status === (t("rejected") || "مرفوض")
                                ? "bg-red-600"
                                : order.status === (t("in_progress") || "قيد التنفيذ")
                                ? "bg-yellow-500"
                                : order.status === (t("waiting_delivery") || "بانتظار التوصيل")
                                ? "bg-purple-600"
                                : order.status === (t("delivering") || "قيد التوصيل")
                                ? "bg-blue-600"
                                : "bg-gray-500"
                            }`}
                        >
                          <option value="جديد">{t("new") || "جديد"}</option>
                          <option value="قيد التنفيذ">{t("in_progress") || "قيد التنفيذ"}</option>
                          <option value="بانتظار التوصيل">{t("waiting_delivery") || "بانتظار التوصيل"}</option>
                          <option value="قيد التوصيل">{t("delivering") || "قيد التوصيل"}</option>
                          <option value="مكتمل">{t("completed") || "مكتمل"}</option>
                          <option value="مرفوض">{t("rejected") || "مرفوض"}</option>
                        </select>
                      </td>
                      <td className="px-2 py-1">
                        <select
                          value={order.captainName || ""}
                          onChange={(e) => assignCaptain(order._id, e.target.value)}
                          className="p-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-black"
                          disabled={order.status === (t("completed") || "مكتمل")}
                        >
                          <option value="">-- {t("select_captain") || "اختر كابتن"} --</option>
                          {captains.map((captain) => (
                            <option key={captain._id} value={captain.name}>
                              {captain.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1 max-w-xs truncate">{order.notes || "-"}</td>
                      <td className="px-2 py-1">
                        {order.deliveryLocation
                          ? `${order.deliveryLocation.lat.toFixed(4)}, ${order.deliveryLocation.lng.toFixed(4)}`
                          : "-"}
                      </td>
                      <td className="px-2 py-1">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-2 py-1 space-y-1 flex flex-wrap gap-1">
                        <button
                          onClick={() => updateStatus(order._id, "قيد التنفيذ")}
                          className="bg-green-600 hover:bg-green-700 text-black px-2 py-1 rounded text-xs"
                          disabled={order.status === (t("completed") || "مكتمل")}
                        >
                          {t("accept_order") || "قبول الطلب"}
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "قيد التوصيل")}
                          className="bg-purple-600 hover:bg-purple-700 text-black px-2 py-1 rounded text-xs"
                          disabled={order.status === (t("completed") || "مكتمل")}
                        >
                          {t("start_delivery") || "بدء التوصيل"}
                        </button>
                        <button
                          onClick={() => generateInvoice(order)}
                          className="bg-green-500 hover:bg-green-600 text-black px-2 py-1 rounded text-xs"
                        >
                          {t("print") || "طباعة"}
                        </button>
                        <button
                          onClick={() => openMapModal(order.deliveryLocation, order.status)}
                          className="bg-blue-500 hover:bg-blue-600 text-black px-2 py-1 rounded text-xs"
                        >
                          {t("view") || "عرض"}
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs"
                          disabled
                        >
                          {t("edit") || "تعديل"}
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="bg-red-500 hover:bg-red-600 text-black px-2 py-1 rounded text-xs"
                        >
                          {t("delete") || "حذف"}
                        </button>
                      </td>
                    </tr>

                    {/* تفاصيل المنتجات */}
                    <tr className={darkMode ? "bg-gray-700 text-white" : "bg-gray-50"}>
                      <td colSpan="12" className="px-4 py-3 text-sm">
                        <strong>{t("products") || "المنتجات"}:</strong>
                        <div className="overflow-x-auto mt-2">
                          <table
                            className={`min-w-full border ${
                              darkMode ? "border-gray-600" : "border-gray-300"
                            } text-right text-xs sm:text-sm rounded-md`}
                          >
                            <thead
                              className={darkMode ? "bg-gray-600" : "bg-gray-200 rounded-t-md"}
                            >
                              <tr>
                                <th className="border px-2 py-1 rounded-tl-md">{t("name") || "الاسم"}</th>
                                <th className="border px-2 py-1">{t("type") || "النوع"}</th>
                                <th className="border px-2 py-1">{t("quantity") || "الكمية"}</th>
                                <th className="border px-2 py-1 rounded-tr-md">{t("price") || "السعر"}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((product, i) => (
                                <tr
                                  key={i}
                                  className={`border px-2 py-1 ${
                                    i % 2 === 0
                                      ? darkMode
                                        ? "bg-gray-800"
                                        : "bg-white"
                                      : darkMode
                                      ? "bg-gray-700"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  <td className="border px-2 py-1">{product.name}</td>
                                  <td className="border px-2 py-1">{product.type || "-"}</td>
                                  <td className="border px-2 py-1">{product.quantity || 1}</td>
                                  <td className="border px-2 py-1">{product.price.toFixed(2)} ر.س</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    {t("no_orders_to_show") || "لا توجد طلبات لعرضها"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* مودال الخريطة */}
        {modalOpen && selectedLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`rounded-lg p-4 max-w-lg w-full ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            >
              <h2 className="text-lg font-bold mb-4">{t("delivery_location") || "موقع التوصيل"}</h2>
              <div style={{ height: "300px", width: "100%" }}>
                <MapContainer
                  center={[selectedLocation.lat, selectedLocation.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                    <Popup>{t("delivery_location") || "موقع التوصيل"}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  {t("close") || "إغلاق"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div></>
  );
}
