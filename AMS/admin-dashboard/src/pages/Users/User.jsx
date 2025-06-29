import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../../layouts/Sidebar";
import Header from "../../../../src/components/Header"; // استيراد الهيدر
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../../src/ThemeContext"; // استيراد ThemeContext عدل المسار حسب مشروعك

export default function User() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext); // استخدم darkMode بدلاً من theme

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [pointToAdd, setPointToAdd] = useState(0);
  const token = localStorage.getItem("token");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://my-backend-dgp2.onrender.com/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        Array.isArray(response.data)
          ? response.data
          : response.data.users || []
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(
        t("failed_fetch_users") ||
          "فشل في جلب بيانات المستخدمين، تحقق من الاتصال أو التوثيق"
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        t("confirm_delete_user") || "هل أنت متأكد من حذف هذا المستخدم؟"
      )
    )
      return;
    try {
      await axios.delete(
        `https://my-backend-dgp2.onrender.com/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert(t("user_deleted_success") || "تم حذف المستخدم بنجاح");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(t("error_deleting_user") || "حدث خطأ أثناء حذف المستخدم");
    }
  };

  const handleAddPointClick = (id) => {
    setEditingUserId(id);
    setPointToAdd(0);
  };

  const handlePointChange = (e) => {
    const value = e.target.value;
    setPointToAdd(value === "" || Number(value) < 0 ? 0 : Number(value));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePointSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return;
    if (pointToAdd <= 0) {
      alert(t("enter_valid_points") || "يجب إدخال قيمة نقاط صحيحة أكبر من صفر");
      return;
    }
  
    setIsSubmitting(true); // لمنع التكرار
  
    try {
      // 🔁 إرسال فقط قيمة الإضافة (وليس المجموع النهائي)
      const res = await axios.patch(
        `https://my-backend-dgp2.onrender.com/api/users/${editingUserId}/points`,
        { points: pointToAdd },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // ✅ إضافة سجل تاريخ النقاط
      await axios.post(
        "https://my-backend-dgp2.onrender.com/api/users/point-history/add",
        {
          userId: editingUserId,
          points: pointToAdd,
          description:
            t("points_added_by_admin", { count: pointToAdd }) ||
            `تمت إضافة ${pointToAdd} نقطة بواسطة الإدارة`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // ✅ تحديث الواجهة بالنقاط الجديدة
      if (res.status === 200 && res.data.user) {
        setUsers(
          users.map((u) =>
            u._id === editingUserId ? { ...u, point: res.data.user.point } : u
          )
        );
        alert(t("points_updated_success") || "تم تحديث النقاط بنجاح");
        setEditingUserId(null);
      } else {
        alert(t("points_update_failed") || "فشل تحديث النقاط، حاول مرة أخرى");
      }
    } catch (error) {
      console.error("Error updating points:", error);
      alert(
        error.response?.data?.message ||
          (t("points_update_error") || "حدث خطأ أثناء تحديث النقاط، تحقق من الخادم")
      );
    } finally {
      setIsSubmitting(false); // إعادة الحالة بعد الإرسال
    }
  };
  

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* الهيدر */}
      <Header />

      {/* زر الهامبرغر لفتح القائمة الجانبية */}
      {!sidebarOpen && (
        <button
          className="fixed top-20 left-4 z-50 bg-white p-2 rounded-md shadow"
          onClick={toggleSidebar}
          aria-label={t("open_sidebar") || "فتح القائمة الجانبية"}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#00b4db"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#00b4db" strokeWidth="2" />
          </svg>
        </button>
      )}

      {/* القائمة الجانبية */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* المحتوى مع تغيير الثيم */}
      <div
        className={`min-h-screen p-6 pt-24 ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("user_management") || "إدارة المستخدمين"}
        </h2>

        <input
          type="text"
          placeholder={t("search_by_name") || "ابحث بالاسم..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md mx-auto mb-6 px-4 py-2 rounded shadow border focus:outline-none focus:ring-2 ${
            darkMode
              ? "focus:ring-gray-400 bg-gray-800 text-white border-gray-700"
              : "focus:ring-purple-400 bg-white text-black border-gray-300"
          }`}
          aria-label={t("search_users") || "بحث المستخدمين"}
        />

        <div
          className={`overflow-x-auto rounded-lg shadow ${
            darkMode ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90"
          }`}
        >
          {/* جدول للأجهزة المتوسطة وما فوق */}
          <div className="hidden md:block">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead
                className={`${
                  darkMode ? "bg-gray-700 text-white" : "bg-purple-800 text-white"
                }`}
              >
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">{t("name") || "الاسم"}</th>
                  <th className="p-3">{t("email") || "البريد"}</th>
                  <th className="p-3">{t("phone") || "الهاتف"}</th>
                  <th className="p-3">{t("points") || "النقاط"}</th>
                  <th className="p-3">{t("role") || "الدور"}</th>
                  <th className="p-3">{t("status") || "الحالة"}</th>
                  <th className="p-3">{t("actions") || "الإجراءات"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`text-center border-b ${
                        darkMode ? "border-gray-700" : ""
                      }`}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone || "-"}</td>
                      <td className="p-3">{user.point || 0}</td>
                      <td className="p-3">
                        {user.role || (t("undefined") || "غير محدد")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            user.status === (t("active") || "مفعل")
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {user.status || (t("unknown") || "غير معروف")}
                        </span>
                      </td>
                      <td className="p-3 space-y-1">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-1"
                          onClick={() => alert(t("view_user") + " " + user._id)}
                        >
                          {t("view") || "عرض"}
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-1"
                          onClick={() => alert(t("edit_user") + " " + user._id)}
                        >
                          {t("edit") || "تعديل"}
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mr-1"
                          onClick={() => handleDelete(user._id)}
                        >
                          {t("delete") || "حذف"}
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handleAddPointClick(user._id)}
                        >
                          {t("add_points") || "نقاط +"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-6 text-center text-gray-500 font-semibold"
                    >
                      {t("no_results") || "لا توجد نتائج مطابقة"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* عرض البطاقات على الشاشات الصغيرة */}
          <div className="md:hidden space-y-4" dir="rtl">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  className={`rounded-lg shadow p-4 space-y-2 text-sm text-right ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                >
                  <p>
                    <strong>{t("number") || "الرقم"}:</strong> {index + 1}
                  </p>
                  <p>
                    <strong>{t("name") || "الاسم"}:</strong> {user.name}
                  </p>
                  <p>
                    <strong>{t("email") || "البريد"}:</strong> {user.email}
                  </p>
                  <p>
                    <strong>{t("phone") || "الهاتف"}:</strong> {user.phone || "-"}
                  </p>
                  <p>
                    <strong>{t("points") || "النقاط"}:</strong> {user.point || 0}
                  </p>
                  <p>
                    <strong>{t("role") || "الدور"}:</strong>{" "}
                    {user.role || (t("undefined") || "غير محدد")}
                  </p>
                  <p>
                    <strong>{t("status") || "الحالة"}:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        user.status === (t("active") || "مفعل")
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {user.status || (t("unknown") || "غير معروف")}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 justify-start pt-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => alert(t("view_user") + " " + user._id)}
                    >
                      {t("view") || "عرض"}
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => alert(t("edit_user") + " " + user._id)}
                    >
                      {t("edit") || "تعديل"}
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(user._id)}
                    >
                      {t("delete") || "حذف"}
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleAddPointClick(user._id)}
                    >
                      {t("add_points") || "نقاط +"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center font-semibold">
                {t("no_results") || "لا توجد نتائج"}
              </div>
            )}
          </div>
        </div>

        {/* نافذة زيادة النقاط */}
        {editingUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-lg shadow-xl w-80 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                {t("add_points_to_user") || "زيادة النقاط للمستخدم"}
              </h3>
              <form onSubmit={handlePointSubmit} className="space-y-3">
                <input
                  type="number"
                  min="1"
                  value={pointToAdd}
                  onChange={handlePointChange}
                  required
                  className={`w-full border rounded px-3 py-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-200 text-black border-gray-300"
                  }`}
                  placeholder={t("enter_points") || "أدخل عدد النقاط"}
                  aria-label={t("points_to_add") || "عدد النقاط المراد إضافتها"}
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {t("confirm") || "تأكيد"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    {t("cancel") || "إلغاء"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
