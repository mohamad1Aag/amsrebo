import React, { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import "./Settings.css";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [form, setForm] = useState({
    fullName: "أحمد الإداري",
    email: "admin@example.com",
    siteName: "متجري الإلكتروني",
    siteStatus: "active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("تم حفظ الإعدادات بنجاح!");
    // هنا ترسل البيانات إلى الخادم
  };

  return (
    <>
      {!sidebarOpen && (
        <button className="open-btn" onClick={toggleSidebar}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#00b4db">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#00b4db" strokeWidth="2" />
          </svg>
        </button>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="settings-container">
        <h2 className="title">الإعدادات</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <label>
            الاسم الكامل:
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            البريد الإلكتروني:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            اسم الموقع:
            <input
              type="text"
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
            />
          </label>

          <label>
            حالة الموقع:
            <select
              name="siteStatus"
              value={form.siteStatus}
              onChange={handleChange}
            >
              <option value="active">مفتوح</option>
              <option value="maintenance">صيانة</option>
            </select>
          </label>

          <button type="submit" className="btn-save">
            حفظ التعديلات
          </button>
        </form>
      </div>
    </>
  );
}
