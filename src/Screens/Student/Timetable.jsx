import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";

const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const getTimetable = async () => {
      try {
        setDataLoading(true);
        const response = await axiosWrapper.get(
          `/timetable?semester=${userData.semester}&branch=${userData.branchId?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        if (response.data.success && response.data.data.length > 0) {
          setTimetable(response.data.data[0].link);
        } else {
          setTimetable("");
        }
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setTimetable("");
          return;
        }
        toast.error(
          error.response?.data?.message || "Error fetching timetable"
        );
        console.error(error);
      } finally {
        setDataLoading(false);
      }
    };
    userData && getTimetable();
  }, [userData, userData.branchId, userData.semester]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 flex flex-col items-center px-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {!dataLoading && timetable && (
          <p
            className="flex items-center text-gray-700 text-lg font-medium cursor-pointer hover:text-[#A11E2E] hover:scale-105 transition-transform duration-200"
            onClick={() =>
              window.open(process.env.REACT_APP_MEDIA_LINK + "/" + timetable)
            }
          >
            Download
            <span className="ml-2">
              <FiDownload />
            </span>
          </p>
        )}
      </div>

      {dataLoading && <Loading />}

      {!dataLoading && timetable && (
        <img
          className="mt-6 rounded-lg shadow-sm w-full md:w-4/5 mx-auto"
          src={process.env.REACT_APP_MEDIA_LINK + "/" + timetable}
          alt="timetable"
        />
      )}

      {!dataLoading && !timetable && (
        <p className="mt-10 text-gray-600 text-center">
          No Timetable Available At The Moment!
        </p>
      )}
    </div>
  );
};

export default Timetable;
