import React, { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AdminRegister from "../admin-dashboard/src/components/AdminRegister";
import AdminProfile from "../admin-dashboard/src/components/AdminProfile";
import AdminList from '../admin-dashboard/src/components/AdminList';
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
import Feedback from "../admin-dashboard/src/components/AdminFeedbackTable";
import SliderUpload from "../admin-dashboard/src/pages/SliderUpload/SliderUpload.jsx";
import ForgotPassword from "./components/UserProfile/ForgotPassword";
import ResetPassword from "./components/UserProfile/ResetPassword";
import PointHistory from "./components/UserProfile/PointHistory";
import Wallet from "./components/Wallet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./i18n";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [userAuthenticated, setUserAuthenticated] = useState(() => !!localStorage.getItem("userToken"));
  const [captainAuthenticated, setCaptainAuthenticated] = useState(() => !!localStorage.getItem("captainToken"));

  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

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

  const ProtectedRoute = ({ isAllowed, redirectPath = "/login", children }) => {
    if (!isAllowed) return <Navigate to={redirectPath} replace />;
    return children;
  };

  const renderLogoutButton = (onClick, color) => (
    <div className="fixed z-50 right-4 top-1/2 -translate-y-1/2 sm:top-auto sm:bottom-4 sm:translate-y-0">
      <button
        onClick={onClick}
        className={`w-12 h-12 sm:w-10 sm:h-10 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 ${
          darkMode
            ? `${color}-400 text-gray-900 focus:ring-${color}-500 focus:ring-offset-gray-900`
            : `${color}-600 text-white focus:ring-${color}-400 focus:ring-offset-yellow-200`
        }`}
        title={t("logout") || "Logout"}
      >
        🔓
      </button>
    </div>
  );

  return (
    <>
      {isAuthenticated && renderLogoutButton(handleLogout, "bg-pink")}
      {userAuthenticated && !isAuthenticated && renderLogoutButton(handleUserLogout, "bg-blue")}
      {captainAuthenticated && renderLogoutButton(handleCaptainLogout, "bg-green")}

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business" element={<Business />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/UserEditProfile" element={<UserEditProfile />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/captain/login" element={<CaptainLogin onCaptainLogin={() => setCaptainAuthenticated(true)} />} />
          <Route path="/captain/register" element={<CaptainRegister />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
          <Route path="/AdminList" element={<AdminList />} />
          <Route path="/AdminProfile" element={<AdminProfile />} />
          <Route path="/AdminDash" element={<ProtectedRoute isAllowed={isAuthenticated}><AdminDash /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute isAllowed={isAuthenticated}><User /></ProtectedRoute>} />
          <Route path="/Product" element={<ProtectedRoute isAllowed={isAuthenticated}><Product /></ProtectedRoute>} />
          <Route path="/Category" element={<ProtectedRoute isAllowed={isAuthenticated}><Category /></ProtectedRoute>} />
          <Route path="/Orders" element={<ProtectedRoute isAllowed={isAuthenticated}><Orders /></ProtectedRoute>} />
          <Route path="/Reports" element={<ProtectedRoute isAllowed={isAuthenticated}><Reports /></ProtectedRoute>} />
          <Route path="/Settings" element={<ProtectedRoute isAllowed={isAuthenticated}><Settings /></ProtectedRoute>} />
          <Route path="/add-section" element={<ProtectedRoute isAllowed={isAuthenticated}><Settings /></ProtectedRoute>} />
          <Route path="/list-sections" element={<ProtectedRoute isAllowed={isAuthenticated}><Settings /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute isAllowed={isAuthenticated}><AddProduct /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute isAllowed={isAuthenticated}><ListProducts /></ProtectedRoute>} />
          <Route path="/section/:id" element={<SectionDetails />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/CaptainDashboard" element={<ProtectedRoute isAllowed={captainAuthenticated} redirectPath="/captain/login"><CaptainDashboard /></ProtectedRoute>} />
          <Route path="/captain/dashboard/orders" element={<ProtectedRoute isAllowed={captainAuthenticated} redirectPath="/captain/login"><CaptainOrders /></ProtectedRoute>} />
          <Route path="/Feedback" element={<ProtectedRoute isAllowed={isAuthenticated}><Feedback /></ProtectedRoute>} />
          <Route path="/SliderUpload" element={<SliderUpload />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/PointHistory" element={<PointHistory />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
