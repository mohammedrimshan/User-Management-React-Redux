import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css'; 
import { addUser } from '../../../Redux/Slices/userSlice';
import { useDispatch } from 'react-redux';




const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [names, setNames] = useState("");
  const [emailCreate, setEmailCreate] = useState("");
  const [passwordCreate, setPasswordCreate] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // Limit size to 2MB
      toast.error("Image size must be less than 2MB.");
    } else {
      setProfileImage(file);
    }
  };

  const validateSignUpForm = () => {
    const newErrors = {};
    if (!names.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z]+$/.test(names)) {
      newErrors.name = "Name can only contain letters.";
    }

    if (!emailCreate.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@gmail\.com$/.test(emailCreate)) {
      newErrors.email = "Email must be a valid Gmail address.";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (!profileImage) {
      newErrors.image = "Profile image is required.";
    }

    return newErrors;
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!emailLogin.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!passwordLogin.trim()) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const validationErrors = validateSignUpForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', names);
    formData.append('email', emailCreate);
    formData.append('password', passwordCreate);
    formData.append('mobile', mobile);
    if (profileImage) {
      formData.append('image', profileImage);
    }

    try {
      const response = await axios.post('http://localhost:3000/user/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Dispatch the addUser action

      dispatch(addUser({
        user: response.data.user,
        token: response.data.token
      }));
      console.log("User stored in Redux:", response.data.user);

      // Show success toast message
      toast.success("Registration successful! You can now log in.");
      
      // Clear form fields on successful registration
      setNames("");
      setEmailCreate("");
      setPasswordCreate("");
      setMobile("");
      setProfileImage(null);
      setErrors({}); // Clear errors

      // Navigate to the login page
      navigate('/'); // Navigate to the auth page
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const validationErrors = validateLoginForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: emailLogin,
        password: passwordLogin,
      }, { withCredentials: true });
  
      // Check if login was successful
      if (response.data.success) {  // Ensure this matches your backend response
        dispatch(addUser({
          user: response.data.user,
          token: response.data.token
        }));
  
        // Show success toast notification
        toast.success("Login successful!");
  
        setEmailLogin("");
        setPasswordLogin("");
        setErrors({}); // Clear any form errors
  
        navigate('/dashboard');
      } else {
        toast.error(`Login failed: ${response.data.message}`);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
};


  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    switch (type) {
      case 'signup':
        if (name === 'names') setNames(value);
        else if (name === 'emailCreate') setEmailCreate(value);
        else if (name === 'passwordCreate') setPasswordCreate(value);
        else if (name === 'mobile') setMobile(value);
        setErrors(validateSignUpForm());
        break;
      case 'login':
        if (name === 'emailLogin') setEmailLogin(value);
        else if (name === 'passwordLogin') setPasswordLogin(value);
        setErrors(validateLoginForm());
        break;
      default:
        break;
    }
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit} encType="multipart/form-data">
          <h1>Create Account</h1>
          <input
            type="text"
            name="names"
            placeholder="Name"
            value={names}
            onChange={(e) => handleInputChange(e, 'signup')}
            required
          />
          {errors.name && <span className="error" aria-live="polite">{errors.name}</span>}
          <input
            type="email"
            name="emailCreate"
            placeholder="Email"
            value={emailCreate}
            onChange={(e) => handleInputChange(e, 'signup')}
            required
          />
          {errors.email && <span className="error" aria-live="polite">{errors.email}</span>}
          <input
            type="password"
            name="passwordCreate"
            placeholder="Password"
            value={passwordCreate}
            onChange={(e) => handleInputChange(e, 'signup')}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => handleInputChange(e, 'signup')}
          />
          {errors.mobile && <span className="error" aria-live="polite">{errors.mobile}</span>}
          <input type="file" onChange={handleImageChange} />
          {errors.image && <span className="error" aria-live="polite">{errors.image}</span>}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>
          <input
            type="email"
            name="emailLogin"
            placeholder="Email"
            value={emailLogin}
            onChange={(e) => handleInputChange(e, 'login')}
            required
          />
          {errors.email && <span className="error" aria-live="polite">{errors.email}</span>}
          <input
            type="password"
            name="passwordLogin"
            placeholder="Password"
            value={passwordLogin}
            onChange={(e) => handleInputChange(e, 'login')}
            required
          />
          {errors.password && <span className="error" aria-live="polite">{errors.password}</span>}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Toggle Section */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected, sign in with your personal info</p>
            <button className="hidden" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="hidden" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
        <button className="toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
