import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import CustomButton from "../components/CustomButton";

/**
 * PublicLayout — minimal, clean layout for unauthenticated visitors.
 * No sidebar, no dashboard navbar, no auth-related UI.
 */
const PublicLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-white to-gray-100 flex flex-col">
      {/* ── Minimal Public Navbar ── */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo + Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate("/materials")}
          >
            {/* College Logo */}
            <img
              src="/assets/gecr.png"
              alt="GECR Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-800 group-hover:text-[#A11E2E] transition-colors">
                Public Materials
              </span>
            </div>
          </div>

          {/* Login */}
          <CustomButton
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-[#A11E2E] hover:bg-[#8c1a27] text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
          >
            Login
            <FiLogIn className="text-lg" />
          </CustomButton>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main className="flex-1 w-full flex flex-col items-center">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-gray-500 text-sm mt-auto">
        © {new Date().getFullYear()} Government Engineering College, Rajkot
      </footer>
    </div>
  );
};

export default PublicLayout;
