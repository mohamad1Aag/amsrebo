import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../../../src/components/Header";
import Sidebar from "../../src/layouts/Sidebar";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../src/ThemeContext"; // بافتراض عندك ThemeContext للتحكم بالثيم

const AdminList = () => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [admins, setAdmins] = useState([]);
  const [currentRole, setCurrentRole] = useState(""); // دور الأدمن الحالي
  const [currentId, setCurrentId] = useState(""); // id الأدمن الحالي
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // تأكد من وجود التوكن

  useEffect(() => {
    fetchAdmins();
    decodeToken(); // لمعرفة دور الأدمن الحالي وid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "https://my-backend-dgp2.onrender.com/api/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins(res.data);
    } catch (err) {
      setMessage(t("failed_to_load_admins") || "فشل في تحميل الأدمنات");
    }
    setLoading(false);
  };

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentRole(payload.role);
      setCurrentId(payload.id || payload._id); // حسب ما مخزن في التوكن
    } catch {
      setCurrentRole("");
      setCurrentId("");
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await axios.patch(
        `https://my-backend-dgp2.onrender.com/api/admin/update-role/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(
        t("role_changed_success", { role: newRole }) ||
          `تم تغيير الدور بنجاح إلى "${newRole}"`
      );
      fetchAdmins(); // إعادة تحميل
    } catch (err) {
      setMessage(
        err.response?.data?.message || t("role_change_failed") || "فشل في تغيير الدور"
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 text-right">
          <h2
            className={`text-2xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {t("admin_list") || "قائمة الأدمنات"}
          </h2>

          {message && (
            <p
              className={`mb-4 text-center ${
                message.includes("فشل") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}

          {loading ? (
            <div
              className={`text-center ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              {t("loading") || "جارٍ تحميل البيانات..."}
            </div>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className={`flex items-center justify-between p-4 rounded shadow ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{admin.username}</p>
                    <p className="text-sm text-gray-400">{admin.email}</p>
                    <p className="text-sm">
                      {t("role") || "الدور"}: {admin.role}
                    </p>
                  </div>

                  {currentRole === "admin" && admin._id !== currentId && (
                    <div className="flex space-x-2">
                      {admin.role === "miniadmin" && (
                        <button
                          onClick={() => changeRole(admin._id, "admin")}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          {t("promote_to_admin") || "ترقية إلى أدمن"}
                        </button>
                      )}
                      {admin.role === "admin" && (
                        <button
                          onClick={() => changeRole(admin._id, "miniadmin")}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          {t("demote_to_miniadmin") || "تخفيض إلى miniadmin"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminList;
