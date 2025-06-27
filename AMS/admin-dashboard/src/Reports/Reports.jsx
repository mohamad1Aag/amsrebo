import React, { useState } from "react";
import "./Reports.css"; // لاحظ غيرت اسم ملف CSS لتخصيصه
import Sidebar from "../layouts/Sidebar";

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [searchTerm, setSearchTerm] = useState("");

  // بيانات تقارير كمثال (تقدر تغيرها حسب نوع التقارير اللي بدك)
  const reports = [
    {
      id: 1,
      title: "تقرير مبيعات يناير",
      date: "2025-01-31",
      generatedBy: "أحمد محمد",
      status: "مكتمل",
    },
    {
      id: 2,
      title: "تقرير نشاط العملاء",
      date: "2025-04-15",
      generatedBy: "سارة علي",
      status: "قيد المعالجة",
    },
    // أضف تقارير أكثر حسب الحاجة
  ];

  // تصفية التقارير حسب العنوان فقط كمثال
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* زر فتح القائمة */}
      {!sidebarOpen && (
        <button className="open-btn" onClick={toggleSidebar}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#00b4db">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#00b4db" strokeWidth="2" />
          </svg>
        </button>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="reports-container">
        <h2 className="title">التقارير</h2>

        <input
          type="text"
          placeholder="ابحث عن تقرير..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>#</th>
                <th>عنوان التقرير</th>
                <th>تاريخ الإنشاء</th>
                <th>تم إنشاؤه بواسطة</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={report.id}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="عنوان التقرير">{report.title}</td>
                    <td data-label="تاريخ الإنشاء">{report.date}</td>
                    <td data-label="تم إنشاؤه بواسطة">{report.generatedBy}</td>
                    <td data-label="الحالة">
                      <span
                        className={`status ${
                          report.status === "مكتمل" ? "active" : "inactive"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td data-label="إجراءات">
                      <button className="btn btn-view">عرض</button>
                      <button className="btn btn-download">تحميل</button>
                      <button className="btn btn-delete">حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
