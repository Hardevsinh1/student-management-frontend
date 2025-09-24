import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import axiosWrapper from "../utils/AxiosWrapper";
import Heading from "../components/Heading";
import CustomButton from "../components/CustomButton";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";

const Exam = () => {
  const [data, setData] = useState({
    name: "",
    date: "",
    semester: "",
    examType: "mid",
    totalMarks: "",
    timetableLink: "",
  });
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const userData = useSelector((state) => state.userData);
  const loginType = localStorage.getItem("userType");
  const [processLoading, setProcessLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getExamsHandler();
  }, []);

  const getExamsHandler = async () => {
    try {
      setDataLoading(true);
      let link = "/exam";
      if (userData.semester) link = `/exam?semester=${userData.semester}`;
      const response = await axiosWrapper.get(link, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) setExams(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setExams([]);
      else toast.error(error.response?.data?.message || "Error fetching exams");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const resetForm = () => {
    setData({
      name: "",
      date: "",
      semester: "",
      examType: "mid",
      totalMarks: "",
      timetableLink: "",
    });
    setFile(null);
    setShowModal(false);
    setIsEditing(false);
    setSelectedExamId(null);
  };

  const addExamHandler = async () => {
    if (!data.name || !data.date || !data.semester || !data.examType || !data.totalMarks) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setProcessLoading(true);
      toast.loading(isEditing ? "Updating Exam" : "Adding Exam");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("semester", data.semester);
      formData.append("examType", data.examType);
      formData.append("totalMarks", data.totalMarks);
      if (file) formData.append("file", file);

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };

      const response = isEditing
        ? await axiosWrapper.patch(`/exam/${selectedExamId}`, formData, { headers })
        : await axiosWrapper.post("/exam", formData, { headers });

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        getExamsHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setProcessLoading(false);
    }
  };

  const editExamHandler = (exam) => {
    setData({
      name: exam.name,
      date: new Date(exam.date).toISOString().split("T")[0],
      semester: exam.semester,
      examType: exam.examType,
      totalMarks: exam.totalMarks,
      timetableLink: exam.timetableLink,
    });
    setSelectedExamId(exam._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const deleteExamHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedExamId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Exam");
      const headers = { Authorization: `Bearer ${localStorage.getItem("userToken")}` };
      const response = await axiosWrapper.delete(`/exam/${selectedExamId}`, { headers });
      toast.dismiss();
      if (response.data.success) {
        toast.success("Exam deleted successfully");
        setIsDeleteConfirmOpen(false);
        getExamsHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to delete exam");
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex flex-col items-center mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Exam Details" />
        {!dataLoading && loginType !== "Student" && (
          <CustomButton onClick={() => setShowModal(true)}>
            <IoMdAdd className="text-2xl" />
          </CustomButton>
        )}
      </div>

      {dataLoading ? (
        <Loading />
      ) : (
        <div className="mt-8 w-full overflow-x-auto">
          <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold">Exam Name</th>
                <th className="py-4 px-6 text-left font-semibold">Date</th>
                <th className="py-4 px-6 text-left font-semibold">Semester</th>
                <th className="py-4 px-6 text-left font-semibold">Exam Type</th>
                <th className="py-4 px-6 text-left font-semibold">Total Marks</th>
                <th className="py-4 px-6 text-left font-semibold">Timetable</th>
                {loginType !== "Student" && (
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? (
                exams.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-blue-50">
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">{item.semester}</td>
                    <td className="py-4 px-6">{item.examType === "mid" ? "Mid Term" : "End Term"}</td>
                    <td className="py-4 px-6">{item.totalMarks}</td>
                    <td className="py-4 px-6">
                      {item.timetableLink ? (
                        <a
                          href={`${process.env.REACT_APP_MEDIA_LINK}/${item.timetableLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {item.timetableLink}
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    {loginType !== "Student" && (
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <CustomButton variant="secondary" onClick={() => editExamHandler(item)} className="!p-2">
                          <MdEdit />
                        </CustomButton>
                        <CustomButton variant="danger" onClick={() => deleteExamHandler(item._id)} className="!p-2">
                          <MdOutlineDelete />
                        </CustomButton>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={loginType !== "Student" ? 7 : 6} className="text-center py-10 text-gray-500">
                    No Exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{isEditing ? "Edit Exam" : "Add New Exam"}</h2>
              <CustomButton onClick={resetForm} variant="secondary">
                <AiOutlineClose size={24} />
              </CustomButton>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={data.semester}
                    onChange={(e) => setData({ ...data, semester: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                  <select
                    value={data.examType}
                    onChange={(e) => setData({ ...data, examType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="mid">Mid Term</option>
                    <option value="end">End Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={data.totalMarks}
                    onChange={(e) => setData({ ...data, totalMarks: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timetable File</label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                    <span className="flex items-center justify-center">
                      <FiUpload className="mr-2" />
                      {file ? file.name : data.timetableLink || "Choose File"}
                    </span>
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && (
                    <CustomButton onClick={() => setFile(null)} variant="danger" className="!p-2">
                      <AiOutlineClose size={20} />
                    </CustomButton>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <CustomButton onClick={resetForm} variant="secondary">Cancel</CustomButton>
                <CustomButton onClick={addExamHandler} disabled={processLoading}>
                  {isEditing ? "Update Exam" : "Add Exam"}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this exam?"
      />
    </div>
  );
};

export default Exam;
