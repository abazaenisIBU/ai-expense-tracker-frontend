import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access this page.");
      setShouldRedirect(true);
    }
  }, [user]);

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
