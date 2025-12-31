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
import EdLesson from "./pages/edLesson";
import Working from "./pages/user-working";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 
const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter> 
      <Routes>
        <Route
              path="/"
              element={
                <AppLayout>
                  <Home />
                </AppLayout>
              }
            />
        <Route
              path="/about"
              element={
                <AppLayout>
                  <About />
                </AppLayout>
              }
            />
        <Route
              path="/reset-password"
              element={
                <AppLayout>
                  <ResetPass />
                </AppLayout>
              }
            />
        <Route
              path="/enter-new-pass"
              element={
                <AppLayout>
                  <NewPassPage />
                </AppLayout>
              }
            />
        <Route
              path="/register"
              element={
                <AppLayout>
                  <Register />
                </AppLayout>
              }
            />
        {/* --- GUEST ROUTES --- */}
        {!user && (
          <>
            <Route
              path="/login"
              element={
                <AppLayout>
                  <Login />
                </AppLayout>
              }
            />
            {/* Redirect any auth-only page to /login */}
            <Route path="/profile" element={<Navigate to="/login" replace />} />
            <Route path="/change-password-logedin-form" element={<Navigate to="/login" replace />} />
            <Route path="/create-lesson" element={<Navigate to="/login" replace />} />
            <Route path="/working" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* --- AUTHENTICATED ROUTES --- */}
        {user && (
          <>
          <Route
              path="/profile/:id"
              element={
                <AppLayout>
                  <UserProfile />
                </AppLayout>
              }
            />
            <Route
              path="/change-password-logedin-form"
              element={
                <AppLayout>
                  <ChangePassLogedinPage/>
                </AppLayout>
              }
            />
            <Route
              path="/working"
              element={
                <AppLayout>
                  <Working/>
                </AppLayout>
              }
            />

            {/* Redirect guest-only routes to dashboard */}
            <Route path="/login" element={<Navigate to={`/profile/${user.id}`} replace />} />
            
          </>
        )}

        {/* --- ADMIN ROUTES --- */}
        {user && (user.type == "admin") && (
          <>
          <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminPanel/>
                </AdminLayout>
              }
            />
            <Route path="/admin/lesson/:lessonId"
                element={
                <AdminLayout>
                  <EdLesson/>
                </AdminLayout>
              } />
            <Route path="/admin/field/:fieldId"
              element={
                <AdminLayout>
                  <CreateField/>
                </AdminLayout>
              }
            />
            <Route
              path="/admin/mylessons"
              element={
                <AdminLayout>
                  <MyLessons/>
                </AdminLayout>
              }
            />

            {/* Redirect guest-only routes to dashboard */}
            <Route path="/login" element={<Navigate to={`/profile/${user.id}`} replace />} />
            
          </>
        )}

        {/* --- CATCH ALL --- */}
        <Route path="/admin/tt" element={<Navigate to={user ? `/profile/${user.id}` : "/"} replace />} />
        <Route path="*" element={<Navigate to={user ? `/profile/${user.id}` : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

