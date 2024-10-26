import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../../Redux/Slices/adminSlice';
import Alert from '../../Alert/Alert'; // Import the custom Alert component
import './AdminHome.css';

const AdminHome = () => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showDashboardAlert, setShowDashboardAlert] = useState(false); // State for Dashboard Alert
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutAlert(true); // Show the logout alert when logout button is clicked
  };

  const handleConfirmLogout = () => {
    setShowLogoutAlert(false);
    dispatch(logoutAdmin());
    // Use React Router's navigate to redirect
    navigate('/admin');
  };
  
  const handleCancelLogout = () => {
    setShowLogoutAlert(false); // Hide the alert if user cancels
  };

  const handleDashboardClick = () => {
    setShowDashboardAlert(true); // Sadminhomehow the dashboard alert when dashboard button is clicked
  };

  const handleConfirmDashboard = () => {
    setShowDashboardAlert(false);
    navigate('/admindashboard');
  };

  const handleCancelDashboard = () => {
    setShowDashboardAlert(false); // Hide the alert if user cancels
  };

  const user = useSelector((state) => state.admin.admin);
  console.log("Checking the redux state @AdminHOME", user);

  // Add a check to prevent accessing properties of undefined
  const imageUrl = user?.image 
      ? (user.image.startsWith('http') ? user.image : `http://localhost:3000${user.image}`) 
      : null;

  console.log("User image URL:", imageUrl);

  return (
    <div className="admin-home-wrapper">
      {showLogoutAlert && (
        <Alert
          message="Are you sure you want to log out?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}

      {showDashboardAlert && (
        <Alert
          message="Are you sure you want to go to the dashboard?"
          onConfirm={handleConfirmDashboard}
          onCancel={handleCancelDashboard}
        />
      )}

      <div className="admin-profile-box">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="admin-profile-img"
          />
        )}
        <p className="admin-info-name">{user?.name}</p>
        <p className="admin-info-email">{user?.email}</p>
        <p className="admin-info-email">{user?.mobile}</p>

        <div className="admin-action-buttons">
          <button onClick={handleDashboardClick} className="admin-dashboard-btn">
            Dashboard
          </button>
          <button onClick={handleLogoutClick} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
