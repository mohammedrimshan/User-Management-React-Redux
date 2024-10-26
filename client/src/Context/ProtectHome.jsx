import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectHome({ children }) {
  const { user } = useSelector((state) => state.user); // Accessing user property
  if (!user || !user.id) { // Check if user or user ID is missing
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectHome;
