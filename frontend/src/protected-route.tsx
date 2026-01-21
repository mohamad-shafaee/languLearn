import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import { useLocation } from "react-router-dom";



const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  //console.log("ProtectedRoute user:", user);
  const location = useLocation();
  console.log("ProtectedRoute:", location.pathname, user);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
