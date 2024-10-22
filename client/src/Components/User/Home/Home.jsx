import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logoutUser } from '../../../Redux/Slices/userSlice';
import Alert from '../../Alert/Alert';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token } = useSelector(state => state.user);
  const userId = user?.user?.id; // Safely access user ID

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    image: ''
  });

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  useEffect(() => {
    console.log("User data from Redux in Home:", { user, token });

    const fetchUser = async () => {
      if (user && user.id) {
        try {
          const res = await axios.get(`http://localhost:3000/user/${user.id}`);
          setUserData({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone || res.data.mobile,
            image: res.data.profileImage || res.data.image
          });
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      } else {
        console.log('User data is missing or invalid.');
        navigate('/'); // Redirect if user ID is missing
      }
    };

    fetchUser(); // Ensure fetchUser is called
  }, [user, navigate]); // Add user and navigate to dependency array

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const userLogout = async () => {
    try {
      await axios.post("http://localhost:3000/user/logout", {}, { withCredentials: true });
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const handleUpdate = () => {
    setShowUpdateAlert(true);
  };

  const confirmUpdate = () => {
    navigate("/update");
    setShowUpdateAlert(false);
  };

  // Add a method to handle updating user data
  const updateUserData = async (updatedData) => {
    try {
      const res = await axios.put(`http://localhost:3000/user/${userId}`, updatedData);
      console.log('User data updated:', res.data);
      // Update local state with new data
      setUserData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || res.data.mobile,
        image: res.data.profileImage || res.data.image,
      });
      // Optionally, fetch data again to confirm
      fetchUser();
    } catch (error) {
      console.log('Error updating user data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="profile-card">
        <h2 className="welcome-message">Welcome, {userData.name || 'User'}</h2>
        {userData.image && (
          <img 
            src={userData.image.startsWith('http') 
              ? userData.image 
              : `http://localhost:3000${userData.image}` 
            } 
            alt="Profile" 
            className="profile-img" 
          />
        )}
        <div className="user-details">
          <h3>{userData.name || 'N/A'}</h3>
          <h5>{userData.email || 'N/A'}</h5>
          <h5>{userData.phone || 'N/A'}</h5>
        </div>
        <div className="button-group">
          <button className="btn update-btn" onClick={handleUpdate}>Update</button>
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {showLogoutAlert && (
        <Alert
          message="Are you sure you want to logout?"
          onConfirm={userLogout}
          onCancel={() => setShowLogoutAlert(false)}
        />
      )}
      {showUpdateAlert && (
        <Alert
          message="Are you sure you want to update your data?"
          onConfirm={confirmUpdate}
          onCancel={() => setShowUpdateAlert(false)}
        />
      )}
    </div>
  );
};

export default Home;
