import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          {/* College Logo */}
          <img
            src="/assets/gecr.png"
            alt="GECR Logo"
            className="h-10 w-10 object-contain"
          />
          <div className="flex items-center space-x-2">
            <RxDashboard className="text-[#A11E2E] text-2xl group-hover:scale-110 transition-transform duration-200" />
            <span className="font-bold text-lg text-gray-800 group-hover:text-[#A11E2E] transition-colors">
              {router.state?.type || ""} Dashboard
            </span>
          </div>
        </div>

        {/* Logout */}
        <CustomButton
          variant="danger"
          onClick={logouthandler}
          className="flex items-center gap-2 bg-[#A11E2E] hover:bg-[#8c1a27] text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
        >
          Logout
          <FiLogOut className="text-lg" />
        </CustomButton>
      </div>
    </nav>
  );
};

export default Navbar;
