import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addAdmin } from '../../../Redux/Slices/adminSlice';
import './AdminLogin.css'; // Import your CSS file for custom styles
import img from '../../../assets/img.svg';

function AdminLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axios.post("http://localhost:3000/admin/login", { email, password }, { withCredentials: true });
    
            if (response.data && response.data.name) {
                dispatch(addAdmin({
                    admin: {
                        _id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        image: response.data.image, // Ensure the image is included
                        mobile: response.data.mobile
                    },
                    token: response.data.token
                }));
    
                toast.success(`Hello ${response.data.name}, you are successfully logged in!`);
    
                setTimeout(() => {
                    navigate("/admin/home");
                }, 2000);
            } else {
                toast.error('Login failed: Invalid Credentials');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid credentials, please try again';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w3l-hotair-form">
            <h1>Admin Portal</h1>
            <div className="container">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                <div className="workinghny-form-grid">
                    <div className="main-hotair">
                        <div className="content-wthree">
                            <h2>Admin Login</h2>
                            <form onSubmit={handleSubmit} method="POST" className='admin-f'>
                                <input
                                    type="email"
                                    className="text"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <input
                                    type="password"
                                    className="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button className="btn" type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </form>
                        </div>
                        <div className="w3l_form align-self">
                            <div className="left_grid_info">
                                <img src={img} alt="Login illustration" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright text-center"></div>
        </section>
    );
}

export default AdminLogin;
