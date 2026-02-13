import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Practice from "./pages/Practice";
import Results from "./pages/Results";

// 1. Define the items
const navLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Practice", link: "/practice" },
];

function App() {
  return (
    <>
      <Navbar navItems={navLinks} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}/>
          <Route path="/practice" element={<Practice />} />
          <Route path="/results" element={<Results />} />
          {/* add more */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
