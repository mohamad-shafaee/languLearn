import React from "react";
import { useAuth } from "./auth";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import UserProfile from "./pages/user-profile";
import ResetPass from "./pages/resetPassword"; 
import NewPassPage from "./pages/newPassword";
import MyLessons from "./pages/myLessons";
import About from "./pages/about";
import ChangePassLogedinPage from "./pages/changePasswordLogedin";
import AdminPanel from "./pages/adminPanel";
import CreateField from "./pages/createField";
import CreatePlan from "./pages/createPlan";
import EdLesson from "./pages/edLesson";
import LessonPage from "./pages/lesson-page";
import Working from "./pages/user-working";
import Premium from "./pages/premium-panel";
import ProtectedRoute from "./protected-route";
import AdminRoute from "./admin-route";
import AccessRoute from "./access-route";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 
const App: React.FC = () => {
  //const { user, loading } = useAuth();

  //if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter> 
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<AppLayout><Home /></AppLayout>}/>
        <Route path="/about" element={<AppLayout><About /></AppLayout>}/>
        <Route path="/reset-password" element={<AppLayout><ResetPass /></AppLayout>}/>
        <Route path="/enter-new-pass" element={<AppLayout><NewPassPage /></AppLayout>}/>
        <Route path="/register" element={<AppLayout><Register /></AppLayout>}/>
        <Route path="/login" element={<AppLayout><Login /></AppLayout>}/>

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
        <Route path="/profile/:id" element={<AppLayout><UserProfile /></AppLayout>}/>
          <Route path="/change-password-logedin-form"
              element={<AppLayout><ChangePassLogedinPage/></AppLayout>}/>
        <Route path="/working" element={<AppLayout><Working /></AppLayout>}/>
        <Route path="/premium-plans" element={<AppLayout><Premium /></AppLayout>}/>
        </Route>

        {/* Access routes, both auth + access */}
        <Route element={<AccessRoute />}> 
        <Route path="/lesson-page/:fieldId/:lessonId" element={<AppLayout><LessonPage /></AppLayout>}/>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout><AdminPanel/></AdminLayout>}/>
          <Route path="/admin/lesson/:lessonId" element={<AdminLayout><EdLesson/></AdminLayout>}/>
          <Route path="/admin/field/:fieldId" element={<AdminLayout><CreateField/></AdminLayout>}/>
          <Route path="/admin/mylessons" element={<AdminLayout><MyLessons/></AdminLayout>}/>
          <Route path="/admin/plan/:planId" element={<AdminLayout><CreatePlan/></AdminLayout>}/>
        </Route>

        {/* Catch-all */}
       <Route path="*" element={<Navigate to="/" replace />} />
  
      </Routes>
    </BrowserRouter>
  );
};

export default App;

