import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "./ThemeContext";

import Home from "./components/Home";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import Business from "./components/Business";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import UserEditProfile from "./components/UserProfile/UserEditProfile";
import ProductList from "./components/Cart/ProductList.jsx";
import Cart from "./components/Cart/Cart.jsx";

import AdminDash from "../admin-dashboard/src/components/AdminDash.jsx";
import User from "../admin-dashboard/src/pages/Users/User";
import Product from "../admin-dashboard/src/pages/Products/Products.jsx";
import ListProducts from "../admin-dashboard/src/pages/Products/ListProducts";
import AddProduct from "../admin-dashboard/src/pages/Products/AddProduct.jsx";
import Category from "../admin-dashboard/src/pages/Categories/Category.jsx";
import Orders from "../admin-dashboard/src/Orders/Orders.jsx";
import Reports from "../admin-dashboard/src/Reports/Reports.jsx";
import Settings from "../admin-dashboard/src/Settings/Settings.jsx";
import Login from "../admin-dashboard/src/components/Login";

import SectionDetails from "./components/SectionDetails";
import CaptainDashboard from "../captian/CaptainDashboard";
import CaptainLogin from "../captian/CaptainLogin";
import CaptainRegister from "../captian/CaptainRegister";
import CaptainOrders from "../captian/CaptainOrders";
import MyOrders from "./components/UserProfile/MyOrders";
import Feedback from "../admin-dashboard/src/components/AdminFeedbackTable"; // عدل المسار حسب مكان الملف
import ForgotPassword from '../src/components/UserProfile/ForgotPassword';
import ResetPassword from '../src/components/UserProfile/ResetPassword';
import PointHistory from '../src/components/UserProfile/PointHistory';


import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import "./i18n";

function App() {
  // تهيئة الحالة مباشرة من localStorage لتفادي مشاكل إعادة التوجيه عند التحديث
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token")); // أدمن
  const [userAuthenticated, setUserAuthenticated] = useState(() => !!localStorage.getItem("userToken")); // مستخدم
  const [captainAuthenticated, setCaptainAuthenticated] = useState(() => !!localStorage.getItem("captainToken")); // كابتن

  const { i18n } = useTranslation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  // لو تريد تحديث حالات المصادقة من localStorage بشكل دوري أو عند التغيير، يمكن استخدام useEffect، لكن هنا ليست ضرورية.

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userToken");
    setUserAuthenticated(false);
  };

  const handleCaptainLogout = () => {
    localStorage.removeItem("captainToken");
    setCaptainAuthenticated(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  // مكون حماية عام يمكن استخدامه لجميع أنواع الحماية
  const ProtectedRoute = ({ isAllowed, redirectPath = "/login", children }) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };

  return (
    <>
      {/* أزرار تسجيل الخروج */}
      {isAuthenticated && (
        <div className="p-4 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            title="تسجيل خروج الأدمن"
          >
            🔓 تسجيل خروج الأدمن
          </button>
        </div>
      )}

      {userAuthenticated && !isAuthenticated && (
        <div className="p-4 text-center">
          <button
            onClick={handleUserLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            title="تسجيل خروج المستخدم"
          >
            🔓 تسجيل خروج المستخدم
          </button>
        </div>
      )}

      {captainAuthenticated && (
        <div className="p-4 text-center">
          <button
            onClick={handleCaptainLogout}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            title="تسجيل خروج الكابتن"
          >
            🔓 تسجيل خروج الكابتن
          </button>
        </div>
      )}

      <BrowserRouter>
        <Routes>
          {/* صفحات عامة */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business" element={<Business />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/UserEditProfile" element={<UserEditProfile />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />

          {/* تسجيل دخول الأدمن */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* تسجيل دخول الكابتن */}
          <Route
            path="/captain/login"
            element={<CaptainLogin onCaptainLogin={() => setCaptainAuthenticated(true)} />}
          />
          <Route path="/captain/register" element={<CaptainRegister />} />

          {/* صفحات محمية للأدمن */}
          <Route
            path="/AdminDash"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <AdminDash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Product"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Category"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Orders"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Reports"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Settings"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-section"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-sections"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <ListProducts />
              </ProtectedRoute>
            }
          />

          {/* صفحة تفاصيل القسم */}
          <Route path="/section/:id" element={<SectionDetails />} />

          {/* صفحة طلبات المستخدم */}
          <Route path="/my-orders" element={<MyOrders />} />

          {/* لوحة تحكم الكابتن محمية */}
          <Route
            path="/CaptainDashboard"
            element={
              <ProtectedRoute isAllowed={captainAuthenticated} redirectPath="/captain/login">
                <CaptainDashboard />
              </ProtectedRoute>
            }
          />

          {/* صفحة التقييمات */}
          <Route
            path="/Feedback"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <Feedback />
              </ProtectedRoute>
            }
          />
        
                  
                  <Route
            path="/captain/dashboard/orders"
            element={
              <ProtectedRoute isAllowed={captainAuthenticated} redirectPath="/captain/login">
                <CaptainOrders />
              </ProtectedRoute>
            }
          />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="PointHistory" element={<PointHistory />} />
        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;
