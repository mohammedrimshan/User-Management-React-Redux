import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../../Redux/Slices/userSlice';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  console.log("Current user state:", user);

  const userId = user?.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const [originalData, setOriginalData] = useState({ name: '', email: '', mobile: '', image: '' });

  useEffect(() => {
    if (!userId) {
      console.log("No user ID found");
      setErrors({ form: 'User not logged in or data missing' });
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/user/${userId}`);
        console.log('Fetched user data:', res.data);
        
        setOriginalData({
          name: res.data.name || '',
          email: res.data.email || '',
          mobile: res.data.mobile || '',
          image: res.data.profileImage || res.data.image || ''
        });

        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setPhone(res.data.mobile || '');

        const fetchedImage = res.data.profileImage || res.data.image;
        if (fetchedImage) {
          const imageUrl = fetchedImage.startsWith('http')
            ? fetchedImage
            : `http://localhost:3000${fetchedImage}`;
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrors({ form: 'Error fetching user data.' });
      }
    };

    fetchUserData();
  }, [userId, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!phone.trim()) newErrors.phone = "Mobile number is required.";
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { 
      setErrors({ image: "Image size must be less than 2MB." });
      setProfileImage(null);
    } else {
      setErrors({});
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const hasChanges = 
      name !== originalData.name ||
      email !== originalData.email ||
      phone !== originalData.mobile ||
      (image && image.name !== originalData.image.split('/').pop()) ||
      (!image && imagePreview !== originalData.image);

    if (!hasChanges) {
      setErrors({ form: 'No changes made to update.' });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', phone);
    if (image) formData.append('image', image);

    try {
      const response = await axios.put(`http://localhost:3000/user/update/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        console.log("Update successful. Response data:", response.data);
        dispatch(updateUser(response.data.user));
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setErrors({ form: 'Failed to update profile.' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrors({ form: 'Error updating profile.' });
    }
  };

  return (
    <div className="update-profile-container">
      <h1 className="update-profile-title">Update Profile</h1>
      <p className="update-profile-user-id">Current User ID: {userId}</p>
      {errors.form && <div className="update-profile-error">{errors.form}</div>}
      {showSuccessAlert && <div className="update-profile-success">Profile updated successfully!</div>}
      <form className="update-profile-form" onSubmit={handleUpdate}>
        <div className="update-profile-form-group">
          <label className="update-profile-label">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="update-profile-input"
          />
          {errors.name && <div className="update-profile-error">{errors.name}</div>}
        </div>
        <div className="update-profile-form-group">
          <label className="update-profile-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="update-profile-input"
          />
          {errors.email && <div className="update-profile-error">{errors.email}</div>}
        </div>
        <div className="update-profile-form-group">
          <label className="update-profile-label">Mobile Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="update-profile-input"
          />
          {errors.phone && <div className="update-profile-error">{errors.phone}</div>}
        </div>
        <div className="update-profile-form-group">
          <label className="update-profile-label">Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="update-profile-input" />
          {errors.image && <div className="update-profile-error">{errors.image}</div>}
        </div>
        {imagePreview && <img src={imagePreview} alt="Profile Preview" className="update-profile-image-preview" />}
        <button type="submit" className="update-profile-button">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
