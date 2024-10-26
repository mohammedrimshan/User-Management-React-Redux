import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddUser.css'
const AddUser = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.admin);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    image: null
  });

  // Error and success state
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'File size should be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@gmail\.com$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid Gmail address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Phone number must be exactly 10 digits";
    }

    // Image validation
    if (!formData.image) {
      newErrors.image = "Profile image is required";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const formPayload = new FormData();
    Object.keys(formData).forEach(key => {
      formPayload.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/admin/create',
        formPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setSuccessMessage('User added successfully!');
      toast.success('User added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        mobile: '',
        image: null
      });
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add user. Please try again.';
      setErrors({ server: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newuser-page-wrapper">
      <form className="newuser-form-container" onSubmit={handleSubmit}>
        <h2 className="newuser-form-heading">Add New User</h2>
        
        {successMessage && (
          <div className="newuser-success-message">
            {successMessage}
          </div>
        )}

        <div className="newuser-form-group">
          <label className="newuser-form-label" htmlFor="name">
            Name
          </label>
          <input
            className="newuser-form-input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />
          {errors.name && (
            <span className="newuser-error-message">{errors.name}</span>
          )}
        </div>

        <div className="newuser-form-group">
          <label className="newuser-form-label" htmlFor="email">
            Email
          </label>
          <input
            className="newuser-form-input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Gmail address"
          />
          {errors.email && (
            <span className="newuser-error-message">{errors.email}</span>
          )}
        </div>

        <div className="newuser-form-group">
          <label className="newuser-form-label" htmlFor="password">
            Password
          </label>
          <input
            className="newuser-form-input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
          />
          {errors.password && (
            <span className="newuser-error-message">{errors.password}</span>
          )}
        </div>

        <div className="newuser-form-group">
          <label className="newuser-form-label" htmlFor="mobile">
            Phone Number
          </label>
          <input
            className="newuser-form-input"
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Enter 10-digit phone number"
          />
          {errors.mobile && (
            <span className="newuser-error-message">{errors.mobile}</span>
          )}
        </div>

        <div className="newuser-form-group">
          <label className="newuser-form-label" htmlFor="image">
            Profile Image
          </label>
          <input
            className="newuser-file-input"
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
          {errors.image && (
            <span className="newuser-error-message">{errors.image}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="newuser-submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Adding User...' : 'Add User'}
        </button>

        {errors.server && (
          <div className="newuser-error-message server-error">
            {errors.server}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddUser;