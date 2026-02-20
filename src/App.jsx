import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Practice from "./pages/Practice";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Inquiries from "./pages/Inquiries";
import Admissions from "./pages/Admissions";
import Utilities from "./pages/Utilities";


import { useLocation } from "react-router-dom";

function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isFullscreen = location.pathname === '/practice' || location.pathname === '/results';

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Practice", link: "/practice" },
    ...(user && user.role === 'admin' ? [{ name: "Admin", link: "/admin" }, { name: "Inquiries", link: "/inquiries" }, { name: "Admissions", link: "/admissions" }, { name: "Utilities", link: "/utilities" }] : []),
    ...(user && user.role !== 'admin' ? [{ name: "Dashboard", link: "/dashboard" }] : []),
  ];

  return (
    <>
      {!isFullscreen && <Navbar navItems={navLinks} />}
      <main className={`${isFullscreen ? '' : 'pt-14'} h-screen overflow-y-auto`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />}/>
            <Route path="/practice" element={<Practice />} />
            <Route path="/results" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/utilities" element={<Utilities />} />
            {/* add more */}
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
