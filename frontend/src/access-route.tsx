import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "./auth";
import { useEffect, useState } from "react";

const AccessRoute: React.FC = () => {
  const { user, token, loading } = useAuth();
  const { fieldId, lessonId } = useParams();
  //const location = useLocation();

  //console.log("AccessRoute:", location.pathname, user);

  const [lessonOpen, setLessonOpen] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLessonIsOpen = async () => {

      try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check-user-access-lesson`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
        },
        body: JSON.stringify({fieldId: fieldId, lessonId: lessonId}),
      });
      const data = await res.json();

      if (res.ok) {
        setLessonOpen(data.is_open);
      }
    } catch (err) {
      setLessonOpen(false);
      alert("Failed to connect to server. Please try again.");
    } finally{
      setChecking(false);
    }
    };
    if (user && fieldId && lessonId) {
      checkLessonIsOpen();
    }
  }, [user, fieldId, lessonId]);


  if (loading || checking) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
    //return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!lessonOpen) {
    return <Navigate to="/premium-plans" replace />;
  }

  return <Outlet />;
};

export default AccessRoute;
