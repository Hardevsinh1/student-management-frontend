import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-8">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-5 py-2 text-sm font-medium rounded-full transition duration-200 ${
          selected === type
            ? "bg-[#A11E2E] text-white shadow-md"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const ForgetPassword = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userToken) {
      navigate(`/${localStorage.getItem("userType")}`);
    }
  }, [userToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Sending reset mail...");
    if (email === "") {
      toast.dismiss();
      toast.error("Please enter your email");
      return;
    }
    try {
      const headers = { "Content-Type": "application/json" };
      const resp = await axiosWrapper.post(
        `/${selected.toLowerCase()}/forget-password`,
        { email },
        { headers }
      );
      toast.dismiss();
      resp.data.success ? toast.success(resp.data.message) : toast.error(resp.data.message);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending reset mail");
    } finally {
      setEmail("");
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
          Government Engineering 
          <br></br>College, Rajkot
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w-md">
          Student Management System
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-lg lg:w-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10">
        <h2 className="text-[#A11E2E] text-2xl md:text-3xl font-bold text-center mb-6">
          {selected} Password Reset
        </h2>

        <UserTypeSelector selected={selected} onSelect={setSelected} />

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              {selected} Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
              placeholder="Enter your registered email"
            />
          </div>

          <CustomButton
            type="submit"
            className="w-full bg-[#A11E2E] hover:bg-[#861925] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
          >
            Send Reset Link
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

export default ForgetPassword;
