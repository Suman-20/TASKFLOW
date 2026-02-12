import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Agar already login hai → dashboard bhejo
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
