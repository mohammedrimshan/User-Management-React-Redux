import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectEdit({ children }) {
  const { user } = useSelector((state) => state.user);
  if (user && user.id) { // Checking if user exists
    return <Navigate to="/dashboard" />;
  }
  return children;
}

export default ProtectEdit;
