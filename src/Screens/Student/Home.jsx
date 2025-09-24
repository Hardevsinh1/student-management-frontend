import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import Profile from "./Profile";
import Exam from "../Exam";
import ViewMarks from "./ViewMarks";
import { useNavigate, useLocation } from "react-router-dom";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "exam", label: "Exam", component: Exam },
  { id: "marks", label: "Marks", component: ViewMarks },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Loading user details...");
      const response = await axiosWrapper.get(`/student/my-details`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error fetching user details"
      );
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `
      text-center px-6 py-3 cursor-pointer
      font-medium text-sm w-full
      rounded-md
      transition-all duration-300 ease-in-out
      ${isSelected
        ? "bg-[#A11E2E] text-white shadow-lg"
        : "bg-white text-[#B5323B] hover:text-[#A11E2E] hover:bg-gray-100"
      }
    `;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-600">
          Loading...
        </div>
      );
    }

    if (selectedMenu === "home" && profileData) {
      return (
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <Profile profileData={profileData} />
        </div>
      );
    }

    const MenuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    )?.component;

    return MenuItem && (
      <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <MenuItem />
      </div>
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.pathname]);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/student?page=${menuId}`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        {/* Menu */}
        {/* Menu */}
        <ul className="flex justify-center items-center gap-4 md:gap-10 my-8 overflow-x-auto no-scrollbar">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.id}
              className={getMenuItemClass(item.id)}
              onClick={() => handleMenuClick(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>


        {/* Content */}
        {renderContent()}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
