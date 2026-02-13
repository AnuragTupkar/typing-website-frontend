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


function App() {
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Practice", link: "/practice" },
    ...(user ? [{ name: "Dashboard", link: "/dashboard" }] : []),
  ];

  return (
    <>
      <Navbar navItems={navLinks} />
      <main className="pt-14 h-screen overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />}/>
            <Route path="/practice" element={<Practice />} />
            <Route path="/results" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* add more */}
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
