import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../../../src/components/Header";
import Sidebar from "../../src/layouts/Sidebar";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../src/ThemeContext";

const AdminList = () => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [admins, setAdmins] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAdmins();
    decodeToken();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "https://my-backend-dgp2.onrender.com/api/admin/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(res.data);
    } catch (err) {
      setMessage("فشل في تحميل الأدمنات");
    }
    setLoading(false);
  };

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentRole(payload.role);
      setCurrentId(payload.id || payload._id);
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
      setMessage(`✅ تم تغيير الدور إلى ${newRole}`);
      fetchAdmins();
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ فشل في تغيير الدور");
    }
  };

  const renderRoleSelector = (admin) => {
    if (currentRole !== "admin" || admin._id === currentId) return null;

    return (
      <select
        value={admin.role}
        onChange={(e) => changeRole(admin._id, e.target.value)}
        className="bg-white text-gray-900 border border-gray-300 rounded px-2 py-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="miniadmin">miniadmin</option>
        <option value="middleadmin">middleadmin</option>
        <option value="admin">admin</option>
      </select>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 text-right">
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
            قائمة الأدمنات
          </h2>

          {message && (
            <p className={`mb-4 text-center ${message.includes("❌") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}

          {loading ? (
            <div className={`text-center ${darkMode ? "text-white" : "text-gray-700"}`}>
              جارٍ تحميل البيانات...
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
                    <p className="text-sm">الدور الحالي: {admin.role}</p>
                  </div>

                  {renderRoleSelector(admin)}
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
