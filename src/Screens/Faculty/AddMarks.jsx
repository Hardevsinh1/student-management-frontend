import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";

const AddMarks = () => {
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [masterMarksData, setMasterMarksData] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [consent, setConsent] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [activeTab, setActiveTab] = useState("manual");
  const [excelFile, setExcelFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const handleExcelUpload = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", excelFile);
    
    setDataLoading(true);
    toast.loading("Uploading Excel file...");
    setUploadResult(null);
    try {
      const response = await axiosWrapper.post("/marks/upload-excel", formData, {
        headers: { 
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setUploadResult(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
       toast.error(error.response?.data?.message || "Error uploading excel file");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "branch") {
      const branch = branches.find((b) => b._id === value);
      setSelectedBranch(branch);
    } else if (name === "subject") {
      const subject = subjects.find((s) => s._id === value);
      setSelectedSubject(subject);
    } else if (name === "semester") {
      setSelectedSemester(value);
    } else if (name === "exam") {
      const exam = exams.find((e) => e._id === value);
      setSelectedExam(exam);
    }
  };

  const fetchBranches = async () => {
    try {
      toast.loading("Loading branches...");
      const response = await axiosWrapper.get("/branch", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBranches([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to load branches");
      }
    } finally {
      toast.dismiss();
    }
  };

  const fetchSubjects = async () => {
    try {
      toast.loading("Loading subjects...");
      const response = await axiosWrapper.get(
        `/subject?branch=${selectedBranch?._id}&semester=${selectedSemester}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.success) {
        setSubjects(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSubjects([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to load subjects");
      }
    } finally {
      toast.dismiss();
    }
  };

  const fetchExams = async () => {
    try {
      toast.loading("Loading exams...");
      const response = await axiosWrapper.get(
        `/exam?semester=${selectedSemester}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.success) {
        setExams(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExams([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to load exams");
      }
    } finally {
      toast.dismiss();
    }
  };

  const searchStudents = async () => {
    setDataLoading(true);
    toast.loading("Searching students...");
    setStudents([]);
    try {
      const response = await axiosWrapper.get(
        `/marks/students?branch=${selectedBranch?._id}&subject=${selectedSubject?._id}&semester=${selectedSemester}&examId=${selectedExam?._id}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        if (response.data.data.length === 0) {
          toast.error("No students found!");
          setStudents([]);
          setMasterMarksData([]);
        } else {
          toast.success("Students found!");
          setStudents(response.data.data);
          const initialMarksData = {};
          response.data.data.forEach((student) => {
            initialMarksData[student._id] = student.obtainedMarks || "";
          });
          setMarksData(initialMarksData);
          setMasterMarksData(response.data.data);
          setShowSearch(false);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error searching students");
      console.error("Search error:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const getMarks = async (e) => {
    setDataLoading(true);
    toast.loading("Getting marks...");
    setMasterMarksData([]);
    try {
      const response = await axiosWrapper.get(
        `/marks?semester=${selectedSemester}&examId=${selectedExam?._id}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Marks found!");
        const combinedData = students.map((student) => {
          const marks = response.data.data.find(
            (mark) => mark.student._id === student._id
          );
          if (marks) {
            return { ...student, obtainedMarks: marks.obtainedMarks };
          } else {
            return { ...student, obtainedMarks: 0 };
          }
        });
        setMasterMarksData(combinedData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error searching students");
      console.error("Search error:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!consent) {
      toast.error("Please confirm the consent before submitting");
      return;
    }

    const hasEmptyMarks = Object.values(marksData).some((mark) => mark === "");
    if (hasEmptyMarks) {
      toast.error("Please enter marks for all students");
      return;
    }

    setDataLoading(true);
    toast.loading("Submitting marks...");
    try {
      const marksToSubmit = Object.entries(marksData).map(
        ([studentId, marks]) => ({
          studentId,
          obtainedMarks: Number(marks),
        })
      );

      const response = await axiosWrapper.post(
        "/marks/bulk",
        {
          marks: marksToSubmit,
          examId: selectedExam?._id,
          subjectId: selectedSubject?._id,
          semester: selectedSemester,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data.success) {
        toast.success("Marks submitted successfully!");
        setMarksData({});
        setConsent(false);
        setShowSearch(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting marks");
      console.error("Submit error:", error);
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  const handleBack = () => {
    setShowSearch(true);
    setStudents([]);
    setMasterMarksData([]);
    setMarksData({});
    setConsent(false);
  };

  const handleSearch = async () => {
    await searchStudents();
  };

  useEffect(() => {
    fetchBranches();
  }, [userToken]);

  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      fetchSubjects();
      fetchExams();
    }
  }, [selectedBranch, selectedSemester]);

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 px-4 md:px-8">
      <div className="flex flex-col items-start w-full mb-6">
        <Heading title="Add Marks" />
        <div className="flex bg-gray-100/80 rounded-lg p-1.5 mt-6 ml-1 md:ml-3 shadow-sm border border-gray-200/60">
          <button
             onClick={() => setActiveTab("manual")}
             className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'manual' ? 'bg-white shadow text-[#A11E2E]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Manual Entry
          </button>
          <button
             onClick={() => setActiveTab("excel")}
             className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'excel' ? 'bg-white shadow text-[#A11E2E]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Excel Upload
          </button>
        </div>
      </div>

      {activeTab === "excel" && (
        <div className="w-full bg-white rounded-lg p-6 my-8 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
             <input type="file" accept=".xlsx, .xls" onChange={(e) => setExcelFile(e.target.files[0])} className="mb-4" />
             <p className="text-sm text-gray-500 mb-6 text-center max-w-md">Format must exactly include headers: <strong>enrollmentNo | subjectCode | marksObtained | semester | examName</strong>. Extension must be .xlsx.</p>
             <CustomButton onClick={handleExcelUpload} disabled={!excelFile || dataLoading}>
               {dataLoading ? "Uploading..." : "Upload Excel"}
             </CustomButton>
          </div>
          
          {uploadResult && (
             <div className="mt-6 p-4 rounded-lg border bg-gray-50">
               <h3 className="font-medium text-lg mb-2">Upload Results</h3>
               <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-white p-3 border rounded shadow-sm text-center">
                    <p className="text-sm text-gray-500">Total Rows Processed</p>
                    <p className="text-2xl font-bold">{uploadResult.totalRows}</p>
                 </div>
                 <div className="bg-white p-3 border rounded shadow-sm text-center">
                    <p className="text-sm text-gray-500">Successfully Inserted</p>
                    <p className="text-2xl font-bold text-green-600">{uploadResult.insertedCount}</p>
                 </div>
               </div>
               
               {uploadResult.failedRows && uploadResult.failedRows.length > 0 && (
                 <div className="mt-4">
                    <p className="font-medium text-red-600 mb-2">Failed Rows ({uploadResult.failedRows.length}):</p>
                    <div className="max-h-60 overflow-y-auto border rounded bg-white">
                      <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden border border-gray-100">
                        <thead className="bg-[#fdf2f3] text-[#A11E2E]">
                           <tr>
                              <th className="px-4 py-3 text-left font-semibold w-20">Row</th>
                              <th className="px-4 py-3 text-left font-semibold">Reason</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y">
                           {uploadResult.failedRows.map((fail, i) => (
                              <tr key={i}>
                                <td className="px-4 py-2 font-medium">{fail.row}</td>
                                <td className="px-4 py-2 text-red-600">{fail.reason}</td>
                              </tr>
                           ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
               )}
             </div>
          )}
        </div>
      )}

      {activeTab === "manual" && showSearch && (
        <div className="w-full bg-white rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-[90%] mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={selectedSemester || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E] transition-all"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <select
                name="branch"
                value={selectedBranch?._id || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A11E2E] transition-all"
              >
                <option value="">Select Branch</option>
                {branches?.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects
              </label>
              <select
                name="subject"
                value={selectedSubject?._id || ""}
                onChange={handleInputChange}
                disabled={!selectedBranch}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !selectedBranch ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select Subject</option>
                {subjects?.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {!selectedBranch && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a branch first
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam
              </label>
              <select
                name="exam"
                value={selectedExam?._id || ""}
                onChange={handleInputChange}
                disabled={!selectedSubject}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !selectedSubject ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select Exam</option>
                {exams?.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
              </select>
              {!selectedSubject && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a subject first
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center w-[10%] mx-auto">
            <CustomButton
              type="submit"
              disabled={
                dataLoading ||
                !selectedBranch ||
                !selectedSubject ||
                !selectedExam ||
                !selectedSemester
              }
              variant="primary"
              onClick={handleSearch}
            >
              {dataLoading ? "Searching..." : "Search"}
            </CustomButton>
          </div>
        </div>
      )}

      {/* Marks Entry Section */}
      {!showSearch && masterMarksData && masterMarksData.length > 0 && (
        <div className="w-full bg-white rounded-lg p-6">
          <div className="space-y-4 w-full mb-6">
            <div className="flex flex-col gap-4 w-[90%] mx-auto">
              <div className="grid grid-cols-4 gap-4">
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">
                    Branch and Semester:
                  </span>
                  <p className="text-gray-800">
                    {selectedBranch?.branchId} - Semester {selectedSemester}
                  </p>
                </div>

                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Exam:</span>
                  <p className="text-gray-800">
                    {selectedExam?.name || "Not Selected"}
                  </p>
                </div>
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Exam Type:</span>
                  <p className="text-gray-800">
                    {selectedExam?.examType === "mid" ? "Mid Term" : "End Term"}
                  </p>
                </div>
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Subject:</span>
                  <p className="text-gray-800">
                    {selectedSubject?.name || "Not Selected"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Total Marks:</span>
                  <p className="text-gray-800">
                    {selectedExam?.totalMarks || "Not Selected"}
                  </p>
                </div>
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Date:</span>
                  <p className="text-gray-800">
                    {selectedExam?.date
                      ? new Date(selectedExam.date).toLocaleDateString()
                      : "Not Selected"}
                  </p>
                </div>
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Time:</span>
                  <p className="text-gray-800">
                    {selectedExam?.time || "Not Selected"}
                  </p>
                </div>
                <div className="border p-3 rounded-md shadow">
                  <span className="text-sm text-gray-500">Students:</span>
                  <p className="text-gray-800">
                    {masterMarksData.length || "Not Selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center mb-4">
            <CustomButton
              variant="secondary"
              onClick={handleBack}
              className="text-sm"
            >
              Back to Search
            </CustomButton>
          </div>

          <div className="grid grid-cols-4 gap-4 w-[100%] mx-auto">
            {masterMarksData.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between w-full border rounded-md"
              >
                <p className="font-medium text-gray-700 flex items-center justify-center px-3 h-full py-2 rounded-md min-w-[120px] text-center">
                  {student.enrollmentNo}
                </p>
                <input
                  type="number"
                  min={0}
                  max={selectedExam?.totalMarks || 100}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 focus:ring-2 focus:ring-[#A11E2E] w-full m-2 transition-all"
                  value={marksData[student._id] || ""}
                  placeholder="Enter Marks"
                  onChange={(e) =>
                    setMarksData({
                      ...marksData,
                      [student._id]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 bottom-0 left-0 right-0 bg-white p-4 border-t mt-10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 text-[#A11E2E] border-gray-300 rounded focus:ring-[#A11E2E] transition-all"
              />
              <label htmlFor="consent" className="text-sm text-gray-700">
                I confirm that all marks entered are correct and verified
              </label>
            </div>

            <CustomButton
              type="submit"
              disabled={dataLoading || !consent}
              variant="primary"
              onClick={handleSubmit}
            >
              {dataLoading ? "Submitting..." : "Submit Marks"}
            </CustomButton>
          </div>
        </div>
      )}
      {/* End Manual Entry Tab rendering condition */}
    </div>
  );
};

export default AddMarks;
