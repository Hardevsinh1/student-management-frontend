import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import { IoMdClose } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CustomButton from "./CustomButton";

const UpdatePasswordLoggedIn = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosWrapper.post(
        `/${userType.toLowerCase()}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      if (response.data.success) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (label, value, setter, showState, toggleShow) => (
    <div className="mb-4 relative">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type={showState ? "text" : "password"}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-9 text-gray-500"
      >
        {showState ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </button>
    </div>
  );

  return (
    <section className="w-full h-full flex justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md w-[90%] md:w-[50%]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Update Password</h2>
          <CustomButton
            onClick={onClose}
            className="bg-red-500 p-2 rounded-full text-white"
          >
            <IoMdClose className="text-2xl" />
          </CustomButton>
        </div>

        <form onSubmit={handlePasswordUpdate}>
          {renderPasswordInput(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrent,
            () => setShowCurrent((prev) => !prev)
          )}
          {renderPasswordInput(
            "New Password",
            newPassword,
            setNewPassword,
            showNew,
            () => setShowNew((prev) => !prev)
          )}
          {renderPasswordInput(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            () => setShowConfirm((prev) => !prev)
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePasswordLoggedIn;
