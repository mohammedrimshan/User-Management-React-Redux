import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectAdminHome({ children }) {
  const { admin } = useSelector((state) => state.admin); // Accessing admin from the state

  // Check if admin is authenticated
  if (!admin || !admin.id) { // Use _id for checking if the admin is logged in
    return <Navigate to="/admin" replace />; // Redirect to the admin login page
  }
  return children; // Render the children if authenticated
}

export default ProtectAdminHome;