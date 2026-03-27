import React from "react";
import Register from "./Screens/Auth/Register";
import Login from "./Screens/Auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import mystore from "./redux/store";
import StudentHome from "./Screens/Student/Home";
import FacultyHome from "./Screens/Faculty/Home";
import AdminHome from "./Screens/Admin/Home";
import ForgetPassword from "./Screens/Auth/ForgetPassword";
import UpdatePassword from "./Screens/Auth/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicMaterials from "./Screens/public/PublicMaterials";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="bottom-center" />
      <Provider store={mystore}>
        <Router>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/materials" element={<PublicMaterials />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/:type/update-password/:resetId"
              element={<UpdatePassword />}
            />
            <Route 
              path="student" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="faculty" 
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <FacultyHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminHome />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
