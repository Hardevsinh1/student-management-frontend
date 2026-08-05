import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";

const Profile = ({ profileData }) => {
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-6 border-b pb-6">
        <div className="flex items-center gap-6">
          <img
            src={
              profileData.profile?.startsWith("http")
                ? profileData.profile
                : `${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`
            }
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-2 ring-[#A11E2E]"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
              {`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`}
            </h1>
            <p className="text-gray-600 mb-1">{profileData.enrollmentNo}</p>
            <p className="text-[#A11E2E] font-medium">
              {profileData.branchId?.name || ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <CustomButton
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            variant="primary"
          >
            {showPasswordUpdate ? "Hide" : "Update Password"}
          </CustomButton>
        </div>
        {showPasswordUpdate && (
          <UpdatePasswordLoggedIn onClose={() => setShowPasswordUpdate(false)} />
        )}
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{profileData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{profileData.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-gray-900 capitalize">{profileData.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Blood Group</label>
              <p className="text-gray-900">{profileData.bloodGroup}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-900">{formatDate(profileData.dob)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Semester</label>
              <p className="text-gray-900">{profileData.semester}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-gray-900">{profileData.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-gray-900">{profileData.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">State</label>
              <p className="text-gray-900">{profileData.state}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Pincode</label>
              <p className="text-gray-900">{profileData.pincode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Country</label>
              <p className="text-gray-900">{profileData.country}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-gray-900">{profileData.emergencyContact?.name || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Relationship</label>
              <p className="text-gray-900">{profileData.emergencyContact?.relationship || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{profileData.emergencyContact?.phone || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
