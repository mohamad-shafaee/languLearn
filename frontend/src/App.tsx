import React from "react";
import { useAuth } from "./auth";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import UserProfile from "./pages/user-profile";
import ReqPass from "./pages/requestPassword"; 
import About from "./pages/about";
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
              path="/request-password"
              element={
                <AppLayout>
                  <ReqPass />
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
            <Route
              path="/register"
              element={
                <AppLayout>
                  <Register />
                </AppLayout>
              }
            />
            {/* Redirect any auth-only page to /login */}
            <Route path="/profile" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* --- AUTHENTICATED ROUTES --- */}
        {user && (
          <>
          <Route
              path="/profile"
              element={
                <AppLayout>
                  <UserProfile />
                </AppLayout>
              }
            />

            {/* Redirect guest-only routes to dashboard */}
            <Route path="/login" element={<Navigate to="/profile" replace />} />
            <Route path="/register" element={<Navigate to="/profile" replace />} />
          </>
        )}

        {/* --- CATCH ALL --- */}
        <Route path="*" element={<Navigate to={user ? "/profile" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

