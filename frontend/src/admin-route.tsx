import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import { useLocation } from "react-router-dom";

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  //console.log("ProtectedRoute user:", user);
  const location = useLocation();
  console.log("AdminRoute:", location.pathname, user);

  if (loading) return <div>Loading...</div>;

  if (!user || user.type !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default AdminRoute;