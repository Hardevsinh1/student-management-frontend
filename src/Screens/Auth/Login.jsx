import React, { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const LoginForm = ({ selected, onSubmit, formData, setFormData }) => (
  <form
    className="w-full bg-white rounded-2xl"
    onSubmit={onSubmit}
  >
    <div className="mb-6">
      <label
        className="block text-gray-800 text-sm font-semibold mb-2"
        htmlFor="email"
      >
        {selected} Email
      </label>
      <input
        type="email"
        id="email"
        required
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="mb-6">
      <label
        className="block text-gray-800 text-sm font-semibold mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        required
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <div className="flex items-center justify-between mb-6">
      <Link
        className="text-sm text-[#A11E2E] hover:underline"
        to="/forget-password"
      >
        Forgot Password?
      </Link>
    </div>
    <CustomButton
      type="submit"
      className="w-full bg-[#A11E2E] hover:bg-red-800 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex justify-center items-center gap-2"
    >
      Login
      <FiLogIn className="text-lg" />
    </CustomButton>
    <div className="flex items-center justify-center mt-6">
      <Link
        className="text-sm text-[#A11E2E] hover:underline"
        to="/register"
      >
        Don't have an account? Register
      </Link>
    </div>
  </form>
);

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-8">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-5 py-2 text-sm font-medium rounded-full transition duration-200 ${
          selected === type
            ? "bg-[#A11E2E] text-white shadow"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8">
        {/* Left side with logo + college name */}
        <div className="flex flex-col items-center text-center lg:w-1/2">
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

        {/* Right side with login form */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-[#A11E2E] text-center mb-6">
            {selected} Login
          </h1>
          <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />
          <LoginForm
            selected={selected}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;
