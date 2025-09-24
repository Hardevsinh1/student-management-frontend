import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Screens/Auth/Login";
import Register from "./Screens/Auth/Register";
import ForgotPassword from "./Screens/Auth/ForgetPassword";
import ResetPassword from "./Screens/Auth/UpdatePassword";

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
