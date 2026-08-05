import React, { useState, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";

// Reusable Input Field
const InputField = ({ label, id, type = "text", required = true, value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                 focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
    />
  </div>
);

// Reusable Select Field
const SelectField = ({ label, id, value, onChange, children }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      required
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                 focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
    >
      {children}
    </select>
  </div>
);

const StudentRegisterForm = ({ onSubmit, formData, setFormData, branches }) => (
  <form className="space-y-6" onSubmit={onSubmit} encType="multipart/form-data">
    {/* Row 1: Names */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputField id="firstName" label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
      <InputField id="middleName" label="Middle Name" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
      <InputField id="lastName" label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
    </div>

    {/* Row 2: Contact */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField id="phone" label="Phone" type="tel" placeholder="10-digit number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
      <InputField id="email" label="Email" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
    </div>

    {/* Row 3: Gender + DOB */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SelectField id="gender" label="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
        <option value="">Select...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </SelectField>
      <InputField id="dob" label="Date of Birth" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
    </div>

    {/* Row 4: Academic Info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField id="semester" label="Semester" type="number" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
      <SelectField id="branchId" label="Branch" value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}>
        <option value="">Select branch...</option>
        {branches.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </SelectField>
    </div>

    {/* Row 5: Address */}
    <InputField id="enrollmentNo" label="Enrollment No." value={formData.enrollmentNo} onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })} />
    <InputField id="address" label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputField id="city" label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
      <InputField id="state" label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
      <InputField id="pincode" label="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
    </div>

    {/* Row 6: Country + Profile */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField id="country" label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
      <div>
        <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
        <input type="file" id="profile" accept="image/*" className="w-full text-sm" onChange={(e) => setFormData({ ...formData, profileFile: e.target.files?.[0] || null })} />
      </div>
    </div>

    {/* Row 7: Security */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField id="password" label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <InputField id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between">
      <Link className="text-sm text-[#A11E2E] hover:underline" to="/login">
        Already have an account? Login
      </Link>
    </div>

    <CustomButton
      type="submit"
      className="mt-4 w-full bg-[#A11E2E] hover:bg-[#8c1a27] text-white font-semibold py-2.5 px-4 rounded-lg 
                 transition duration-200 flex justify-center items-center gap-2"
    >
      Register <FiUserPlus className="text-lg" />
    </CustomButton>
  </form>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    semester: "",
    branchId: "",
    enrollmentNo: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    password: "",
    confirmPassword: "",
    profileFile: null,
  });
  const [branches, setBranches] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) body.append(key === "profileFile" ? "file" : key, val);
      });
      await axiosWrapper.post("/student/register", body, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Student registered successfully!");
      navigate("/login?type=student");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const resp = await axiosWrapper.get("/branch");
        setBranches(resp.data?.data || []);
      } catch {
        setBranches([]);
      }
    };
    loadBranches();
  }, []);

  return (
    <div className="py-10 min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 md:p-10">
        {/* Logo on top */}
        <div className="flex flex-col items-center text-center mb-6">
          <img src="/assets/gecr.png" alt="GECR Logo" className="w-20 h-20 object-contain mb-3" />
          <h2 className="text-xl font-bold text-[#A11E2E]">
            Government Engineering College, Rajkot
          </h2>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Student Registration
        </h1>

        <StudentRegisterForm
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          branches={branches}
        />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Register;
