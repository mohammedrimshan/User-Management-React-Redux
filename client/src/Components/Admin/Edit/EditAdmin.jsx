import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../Redux/Slices/userSlice';
import './EditAdmin.css';

const EditAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [errors, setErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMobile = mobile.trim();

        if (!trimmedName) {
            newErrors.name = "Name is required.";
        }

        if (!trimmedEmail) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-.]+@gmail\.com$/.test(trimmedEmail)) {
            newErrors.email = "Email must be a valid Gmail address.";
        }

        if (!trimmedMobile) {
            newErrors.mobile = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(trimmedMobile)) {
            newErrors.mobile = "Mobile number must be exactly 10 digits.";
        }

        if (!image && !currentImage) {
            newErrors.image = "Profile image is required.";
        }

        return newErrors;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/admin/editUser/${id}`, { withCredentials: true });
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setMobile(user.mobile);
                setCurrentImage(user.image);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formData = new FormData();
            if (image) {
                formData.append('image', image);
            }
            formData.append('id', id);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('mobile', mobile);

            const response = await axios.put("http://localhost:3000/admin/update", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            dispatch(updateUser(response.data.updatedUser));
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
                navigate("/admindashboard");
            }, 2000);
        } catch (error) {
            console.error("Error updating user data", error);
        }
    };

    return (
        <div className="modern-edit-container">
            <div className="modern-edit-wrapper">
                <div className="modern-edit-header">
                    <h2>Edit Profile</h2>
                    <p className="modern-edit-subtitle">Update your information below</p>
                </div>
                
                <form onSubmit={handleSubmit} className="modern-edit-form">
                    {currentImage && (
                        <div className="modern-image-preview">
                            <img 
                                src={`http://localhost:3000${currentImage}`} 
                                alt="Profile" 
                                className="modern-profile-image"
                            />
                        </div>
                    )}
                    
                    <div className="modern-input-group">
                        <label className="modern-label">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="modern-input"
                            placeholder="Enter your full name"
                        />
                        {errors.name && <span className="modern-error">{errors.name}</span>}
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="modern-input"
                            placeholder="your.email@gmail.com"
                        />
                        {errors.email && <span className="modern-error">{errors.email}</span>}
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-label">Mobile Number</label>
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="modern-input"
                            placeholder="Enter your mobile number"
                        />
                        {errors.mobile && <span className="modern-error">{errors.mobile}</span>}
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-label">Profile Image</label>
                        <div className="modern-file-input-wrapper">
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="modern-file-input"
                                id="file-input"
                            />
                            <label htmlFor="file-input" className="modern-file-label">
                                Choose File
                            </label>
                        </div>
                        {errors.image && <span className="modern-error">{errors.image}</span>}
                    </div>

                    <button type="submit" className="modern-submit-btn">
                        Save Changes
                    </button>
                </form>

                {showSuccessAlert && (
                    <div className="modern-success-alert">
                        ✓ Profile updated successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditAdmin;