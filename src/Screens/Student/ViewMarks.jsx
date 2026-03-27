import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";

const ViewMarks = () => {
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(userData?.semester || 1);
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [marks, setMarks] = useState([]);
  const userToken = localStorage.getItem("userToken");

  const fetchMarks = async (semester) => {
    setDataLoading(true);
    toast.loading("Loading marks...");
    try {
      const response = await axiosWrapper.get(`/marks/student?semester=${semester}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.data.success) {
        setMarks(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching marks");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchMarks(userData?.semester || 1);
  }, []);

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setSelectedSemester(semester);
    fetchMarks(semester);
  };

  const filteredMarks = marks.filter((mark) => {
    if (selectedExamType === "all") return true;
    return mark.examId?.examType === selectedExamType;
  });

  return (
    <div className="w-full mx-auto mt-10 flex flex-col items-center mb-10 px-4">
      <div className="flex justify-between items-center w-full max-w-6xl mb-6">
        <Heading title="Your Marks" />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Exam Type:</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
            >
              <option value="all">All Exams</option>
              <option value="mid">Mid Term</option>
              <option value="end">End Term</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Semester:</label>
            <select
              value={selectedSemester || ""}
              onChange={handleSemesterChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A11E2E]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
        {dataLoading ? (
          <div className="p-8 text-center text-gray-500">Loading your marks...</div>
        ) : filteredMarks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-[#fdf2f3] text-[#A11E2E] uppercase text-xs">
                <tr>
                  <th className="py-4 px-6 border-b border-gray-100 font-bold">Subject</th>
                  <th className="py-4 px-6 border-b border-gray-100 font-bold text-center">Marks</th>
                  <th className="py-4 px-6 border-b border-gray-100 font-bold">Semester</th>
                  <th className="py-4 px-6 border-b border-gray-100 font-bold">Exam Type</th>
                  <th className="py-4 px-6 border-b border-gray-100 font-bold">Exam Name</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {filteredMarks.map((mark) => (
                  <tr key={mark._id || `${mark.subjectId?._id}-${mark.examId?._id}`} className="hover:bg-[#fef9f9] border-b border-gray-50 last:border-0 transition-all duration-200">
                    <td className="py-4 px-6 font-semibold text-gray-900">{mark.subjectId?.name || "N/A"}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xl font-bold text-[#A11E2E] bg-[#fdf2f3] px-3 py-1 rounded-lg">
                        {mark.marksObtained}
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">
                        out of {mark.examId?.totalMarks || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-medium">Semester {mark.semester}</td>
                    <td className="py-4 px-6 capitalize">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ring-1 transition-all duration-200 ${mark.examId?.examType === 'mid' ? 'bg-orange-50 text-orange-700 ring-orange-200' : 'bg-green-50 text-green-700 ring-green-200'}`}>
                         {mark.examId?.examType} Term
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{mark.examId?.name || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
             <div className="text-4xl mb-4">📊</div>
             <p className="text-lg">No marks available for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMarks;
