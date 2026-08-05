import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { resetId, type } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!resetId) {
      toast.error("Invalid or expired reset link.");
      navigate("/");
    }
  }, [resetId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!type) {
      toast.error("Invalid Reset Password Link.");
      return;
    }
    setIsLoading(true);
    toast.loading("Resetting your password...");

    try {
      const response = await axiosWrapper.post(
        `/${type}/update-password/${resetId}`,
        { password: newPassword, resetId }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Password reset successfully.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center justify-center px-4 py-6">

      {/* Side Logo Section */}
      <div className="flex flex-col items-center text-center lg:w-1/2 mb-8 lg:mb-0">
        <img
          src="/assets/gecr.png"
          alt="GEC Rajkot Logo"
          className="w-28 h-28 mb-4"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-[#A11E2E]">
          Government Engineering College, Rajkot
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w-md">
          Student Management System
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-lg lg:w-1/2 p-6 md:p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-[#A11E2E] text-2xl md:text-3xl font-bold text-center mb-6">
          Update Password
        </h2>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
              placeholder="Confirm new password"
            />
          </div>

          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B5323B] hover:bg-[#A11E2E] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </CustomButton>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#A11E2E] hover:underline text-sm font-medium"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default UpdatePassword;
