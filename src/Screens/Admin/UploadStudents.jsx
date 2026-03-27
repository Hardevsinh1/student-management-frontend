import React, { useState, useRef } from 'react';
import axiosWrapper from '../../utils/AxiosWrapper';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiFileText, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const UploadStudents = () => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast.error('Only .xlsx format is supported');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the 5MB limit');
      return;
    }

    setFile(selectedFile);
    toast.success(`Selected: ${selectedFile.name}`);
    setResults(null);
    setProgress(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setResults(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    const userToken = localStorage.getItem("userToken");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosWrapper.post('/student/upload-students', formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      const data = response.data.data;
      setResults({
        total: data.totalRowsProcessed,
        success: data.successfulInserts,
        failedCount: data.failedRowsCount,
        failedRows: data.failedRows
      });

      if (data.failedRowsCount > 0) {
        toast.error(`${data.successfulInserts} inserted, ${data.failedRowsCount} failed.`, { duration: 5000 });
      } else {
        toast.success('All records successfully uploaded!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'File upload failed. Please try again.');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen pt-4">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk Upload Students</h2>

        {/* Drag and Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer shadow-sm
            ${isDragActive ? 'border-[#A11E2E] bg-[#fdf2f3]' : 'border-gray-200 hover:border-[#A11E2E] hover:bg-gray-50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB (.xlsx only)</p>
        </div>

        {/* Selected File Review */}
        {file && (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-[#fdf2f3] p-5 rounded-xl border border-[#A11E2E]/20 shadow-sm transition-all duration-300">
              <div className="flex items-center gap-4">
                <FiFileText className="text-[#A11E2E] h-10 w-10" />
                <div>
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!isUploading && (
                <button type="button" onClick={clearFile} className="text-gray-400 hover:text-red-500 transition">
                  <FiX />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-[#A11E2E] h-2.5 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
                <p className="text-xs text-right mt-1.5 font-semibold text-gray-600">{progress}% uploaded</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-4">
               <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-[#A11E2E] hover:bg-[#801825] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#A11E2E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
              >
                {isUploading ? 'Uploading...' : 'Process Upload'}
              </button>
              {results && !isUploading && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Upload Another
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Overview */}
        {results && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Upload Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Rows</p>
                  <p className="text-2xl font-bold text-gray-800">{results.total}</p>
                </div>
                <FiFileText className="text-gray-400 w-8 h-8" />
              </div>
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between border border-green-100">
                <div>
                  <p className="text-sm font-medium text-green-600">Success</p>
                  <p className="text-2xl font-bold text-green-700">{results.success}</p>
                </div>
                <FiCheckCircle className="text-green-500 w-8 h-8" />
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between border border-red-100">
                <div>
                  <p className="text-sm font-medium text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-700">{results.failedCount}</p>
                </div>
                <FiAlertCircle className="text-red-500 w-8 h-8" />
              </div>
            </div>

            {/* Errors Table */}
            {results.failedRows && results.failedRows.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <FiAlertCircle size={20} /> Failed Rows Detail
                </h4>
                <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-100 max-h-96">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#A11E2E] uppercase bg-[#fdf2f3] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 whitespace-nowrap font-bold w-24">Excel Row</th>
                        <th className="px-6 py-4 font-bold">Error Reason</th>
                        <th className="px-6 py-4 font-bold">Identifier (Email / Enroll No)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.failedRows.map((err, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            Row {err.row}
                          </td>
                          <td className="px-6 py-4 text-red-600">
                            {err.reason}
                          </td>
                          <td className="px-6 py-4 truncate max-w-xs">
                            {err.data.email || err.data.enrollmentNo || 'N/A'}
                          </td>
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
    </div>
  );
};

export default UploadStudents;
