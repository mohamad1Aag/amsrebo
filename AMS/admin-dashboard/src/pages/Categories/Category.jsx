import React, { useState, useContext } from "react";
import Sidebar from "../../layouts/Sidebar";
import AddSection from "./AddSection";
import ListSections from "./ListSections";
import Header from "../../../../src/components/Header";
import { useTranslation } from "react-i18next";
import { ThemeContext } from '../../../../src/ThemeContext';

export default function Category() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // أمثلة فئات (يمكن تعديلها أو إزالتها إذا لا تحتاجها)
  const categories = [
    {
      id: 1,
      name: t("clothes"),
      description: t("clothes_description"),
      status: t("active"),
    },
    {
      id: 2,
      name: t("electronics"),
      description: t("electronics_description"),
      status: t("inactive"),
    },
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black"
      }`}
    >
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        {/* Main content */}
        <div className="flex-1 p-6">
          {!sidebarOpen && (
            <button
              className="mb-4 p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          {/* إضافة قسم */}
          <AddSection />

          {/* عرض الأقسام */}
          <ListSections
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={filteredCategories}  // تمرير الفئات إذا تحتاجها في ListSections
          />
        </div>
      </div>
    </div>
  );
}
