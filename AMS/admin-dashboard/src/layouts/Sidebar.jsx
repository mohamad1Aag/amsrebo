// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-800 via-pink-600 to-yellow-100 text-white shadow-lg z-50 transition-transform duration-300">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-xl font-bold">AMS Admin</h2>
            <button onClick={onClose} className="text-white hover:text-yellow-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#ffffff" strokeWidth="2" />
                <path d="M6 6L18 18" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col p-4 space-y-2 text-base font-medium">
            <li>
              <Link
                to="/Dashboard"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                المستخدمون
              </Link>
            </li>
            <li>
              <Link
                to="/Product"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                المنتجات
              </Link>
            </li>
            <li>
              <Link
                to="/Category"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                التصنيفات
              </Link>
            </li>
            <li>
              <Link
                to="/Orders"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                الطلبات
              </Link>
            </li>
            <li>
              <Link
                to="/Reports"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                التقارير
              </Link>
            </li>
            {/* إضافة رابط جديد لصفحة التقييمات */}
            <li>
              <Link
                to="/Feedback"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                التقييمات
              </Link>
            </li>
            <li>
              <Link
                to="/Settings"
                className="block px-3 py-2 rounded hover:bg-white hover:text-purple-800 transition"
                onClick={onClose}
              >
                الإعدادات
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Sidebar;
