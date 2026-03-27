import React, { useEffect, useState } from "react";
import { MdLink } from "react-icons/md";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const userData = useSelector((state) => state.userData);
  const [filters, setFilters] = useState({ subject: "", type: "" });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(
        `/subject?semester=${userData.semester}&branch=${userData.branchId._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (response.data.success) setSubjects(response.data.data);
    } catch (error) {
      // toast.error(error?.response?.data?.message || "Failed to load subjects");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      setDataLoading(true);
      const queryParams = new URLSearchParams({
        semester: userData.semester,
        branch: userData.branchId._id,
      });
      if (filters.subject) queryParams.append("subject", filters.subject);
      if (filters.type) queryParams.append("type", filters.type);

      const response = await axiosWrapper.get(`/material?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) setMaterials(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load materials");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 flex flex-col items-center px-4 space-y-6">
      <Heading title="Study Materials" />

      {!dataLoading && (
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filter by Subject
            </label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filter by Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
            >
              <option value="">All Types</option>
              <option value="notes">Notes</option>
              <option value="assignment">Assignment</option>
              <option value="syllabus">Syllabus</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      {dataLoading && <Loading />}

      {!dataLoading && (
        <div className="w-full mt-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-900 font-medium">
                <th className="py-3 px-6 text-left">File</th>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Subject</th>
                <th className="py-3 px-6 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((material) => (
                  <tr
                    key={material._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-6">
                      <CustomButton
                        variant="primary"
                        onClick={() =>
                          window.open(
                            material.file?.startsWith("http")
                              ? material.file
                              : `${process.env.REACT_APP_MEDIA_LINK}/${material.file}`
                          )
                        }
                        className="text-gray-700 hover:text-[#A11E2E]"
                      >
                        <MdLink className="text-xl" />
                      </CustomButton>
                    </td>
                    <td className="py-3 px-6 text-gray-900">{material.title}</td>
                    <td className="py-3 px-6 text-gray-900">{material.subject.name}</td>
                    <td className="py-3 px-6 text-gray-900 capitalize">{material.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-600 py-6">
                    No materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Material;
