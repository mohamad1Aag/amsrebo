import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/Sidebar";
import axios from "axios";

export default function User() {
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
      // تأكد من أن البيانات مصفوفة
      setUsers(
        Array.isArray(response.data)
          ? response.data
          : response.data.users || []
      );
    } catch (error) {
      console.error("خطأ أثناء جلب المستخدمين:", error);
      alert("فشل في جلب بيانات المستخدمين، تحقق من الاتصال أو التوثيق");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await axios.delete(
        `https://my-backend-dgp2.onrender.com/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert("تم حذف المستخدم بنجاح");
    } catch (error) {
      console.error("خطأ أثناء حذف المستخدم:", error);
      alert("حدث خطأ أثناء حذف المستخدم");
    }
  };

  const handleAddPointClick = (id) => {
    setEditingUserId(id);
    setPointToAdd(0);
  };

  const handlePointChange = (e) => {
    const value = e.target.value;
    // منع القيم السالبة أو الفارغة
    if (value === "" || Number(value) < 0) {
      setPointToAdd(0);
    } else {
      setPointToAdd(Number(value));
    }
  };

  const handlePointSubmit = async (e) => {
    e.preventDefault();
    if (pointToAdd <= 0) {
      alert("يجب إدخال قيمة نقاط صحيحة أكبر من صفر");
      return;
    }

    try {
      const user = users.find((u) => u._id === editingUserId);
      const newPoint = (user.point || 0) + pointToAdd;

      // تحديث النقاط في المستخدم (PATCH)
      const res = await axios.patch(
        `https://my-backend-dgp2.onrender.com/api/users/${editingUserId}/points`,
        { point: newPoint },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        // إضافة سجل في جدول PointHistory عبر POST
        await axios.post(
          "https://my-backend-dgp2.onrender.com/api/users/point-history/add",
          {
            userId: editingUserId,
            points: pointToAdd, // **هنا يجب أن يكون points وليس pointsChanged**
            description: `تمت إضافة ${pointToAdd} نقطة بواسطة الإدارة`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // تحديث الواجهة بدون إعادة جلب البيانات
        setUsers(
          users.map((u) =>
            u._id === editingUserId ? { ...u, point: newPoint } : u
          )
        );

        alert("تم تحديث النقاط بنجاح");
        setEditingUserId(null);
      } else {
        alert("فشل تحديث النقاط، حاول مرة أخرى");
      }
    } catch (error) {
      console.error("خطأ أثناء تحديث النقاط:", error);
      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء تحديث النقاط، تحقق من الخادم"
      );
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
          onClick={toggleSidebar}
          aria-label="فتح القائمة الجانبية"
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

      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="min-h-screen bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 p-6">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          إدارة المستخدمين
        </h2>

        <input
          type="text"
          placeholder="ابحث بالاسم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto mb-6 px-4 py-2 rounded shadow border focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="بحث المستخدمين"
        />

        <div className="overflow-x-auto bg-white bg-opacity-90 rounded-lg shadow">
          {/* جدول للأجهزة المتوسطة وما فوق */}
          <div className="hidden md:block">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">الاسم</th>
                  <th className="p-3">البريد</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">النقاط</th>
                  <th className="p-3">الدور</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id} className="text-center border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone || "-"}</td>
                      <td className="p-3">{user.point || 0}</td>
                      <td className="p-3">{user.role || "غير محدد"}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            user.status === "مفعل"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {user.status || "غير معروف"}
                        </span>
                      </td>
                      <td className="p-3 space-y-1">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-1"
                          onClick={() => alert("عرض المستخدم " + user._id)}
                        >
                          عرض
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-1"
                          onClick={() => alert("تعديل المستخدم " + user._id)}
                        >
                          تعديل
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mr-1"
                          onClick={() => handleDelete(user._id)}
                        >
                          حذف
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handleAddPointClick(user._id)}
                        >
                          نقاط +
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
                      لا توجد نتائج مطابقة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* شكل بطاقات للأجهزة الصغيرة */}
          <div className="md:hidden space-y-4" dir="rtl">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow p-4 space-y-2 text-sm text-right"
                >
                  <p>
                    <strong>الرقم:</strong> {index + 1}
                  </p>
                  <p>
                    <strong>الاسم:</strong> {user.name}
                  </p>
                  <p>
                    <strong>البريد:</strong> {user.email}
                  </p>
                  <p>
                    <strong>الهاتف:</strong> {user.phone || "-"}
                  </p>
                  <p>
                    <strong>النقاط:</strong> {user.point || 0}
                  </p>
                  <p>
                    <strong>الدور:</strong> {user.role || "غير محدد"}
                  </p>
                  <p>
                    <strong>الحالة:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        user.status === "مفعل"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {user.status || "غير معروف"}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 justify-start pt-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => alert("عرض المستخدم " + user._id)}
                    >
                      عرض
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => alert("تعديل المستخدم " + user._id)}
                    >
                      تعديل
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(user._id)}
                    >
                      حذف
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleAddPointClick(user._id)}
                    >
                      نقاط +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-white font-semibold">
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>

        {editingUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-80">
              <h3 className="text-lg font-semibold mb-4">
                زيادة النقاط للمستخدم
              </h3>
              <form onSubmit={handlePointSubmit} className="space-y-3">
                <input
                  type="number"
                  min="1"
                  value={pointToAdd}
                  onChange={handlePointChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="أدخل عدد النقاط"
                  aria-label="عدد النقاط المراد إضافتها"
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    تأكيد
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    إلغاء
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
