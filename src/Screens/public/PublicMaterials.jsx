import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MdLink } from "react-icons/md";
import Heading from "../../components/Heading";
import Loading from "../../components/Loading";
import CustomButton from "../../components/CustomButton";
import PublicLayout from "../../layouts/PublicLayout";

const BASE_URL = process.env.REACT_APP_APILINK || "http://localhost:4000/api";
const MEDIA_URL = process.env.REACT_APP_MEDIA_LINK || "http://localhost:4000/media";

const PublicMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
    subject: "",
    type: "",
  });

  // ── Fetch reference data (no auth needed for branch/subject) ────────────────
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/branch`);
        if (res.data.success) setBranches(res.data.data);
      } catch (_) {}
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.branch) params.append("branch", filters.branch);
        if (filters.semester) params.append("semester", filters.semester);
        const res = await axios.get(`${BASE_URL}/public/subjects?${params}`);
        if (res.data.success) setSubjects(res.data.data);
        else setSubjects([]);
      } catch (_) {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [filters.branch, filters.semester]);

  // ── Fetch materials (backend-filtered) ─────────────────────────────────────
  const fetchMaterials = useCallback(async () => {
    try {
      setDataLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.branch) params.append("branch", filters.branch);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.type) params.append("type", filters.type);

      const res = await axios.get(`${BASE_URL}/public/materials?${params}`);
      setMaterials(res.data?.data ?? []);
    } catch (err) {
      setError("Could not load study materials. Please try again later.");
    } finally {
      setDataLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Reset downstream filters when branch or semester changes
    if (name === "branch") {
      setFilters((prev) => ({ ...prev, branch: value, subject: "" }));
    } else if (name === "semester") {
      setFilters((prev) => ({ ...prev, semester: value, subject: "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectClass =
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A11E2E] text-sm";

  return (
    <PublicLayout>
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mx-auto my-10 flex flex-col items-center space-y-6">

        {/* Page heading — same style as all other pages */}
        <Heading title="Study Materials" />

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        {!dataLoading && (
          <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Department / Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Department
              </label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="">All Departments</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Material Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className={selectClass}
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

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {dataLoading && <Loading />}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {!dataLoading && error && (
          <div className="w-full text-center py-12 text-gray-500">
            <p className="mb-4">{error}</p>
            <CustomButton onClick={fetchMaterials}>Retry</CustomButton>
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────────── */}
        {!dataLoading && !error && (
          <div className="w-full mt-6 overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-900 font-medium">
                  <th className="py-3 px-6 text-left">View</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Subject</th>
                  <th className="py-3 px-6 text-left">Department</th>
                  <th className="py-3 px-6 text-left">Semester</th>
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
                      {/* File link */}
                      <td className="py-3 px-6">
                        <CustomButton
                          variant="primary"
                          onClick={() =>
                            window.open(
                              material.file?.startsWith("http")
                                ? material.file
                                : `${MEDIA_URL}/${material.file}`
                            )
                          }
                          className="text-gray-700 hover:text-[#A11E2E]"
                        >
                          <MdLink className="text-xl" />
                        </CustomButton>
                      </td>

                      <td className="py-3 px-6 text-gray-900">{material.title}</td>

                      <td className="py-3 px-6 text-gray-900">
                        {material.subject?.name ?? "—"}
                      </td>

                      <td className="py-3 px-6 text-gray-900">
                        {material.branch?.name ?? "—"}
                      </td>

                      <td className="py-3 px-6 text-gray-900">
                        {material.semester ?? "—"}
                      </td>

                      <td className="py-3 px-6 text-gray-900 capitalize">
                        {material.type}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-gray-600 py-8"
                    >
                      No public materials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default PublicMaterials;
