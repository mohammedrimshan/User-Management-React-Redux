import React, { useEffect, useState } from "react";
import "./AdminDash.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../Redux/Slices/adminSlice";
import Alert from "../../Alert/Alert";

const AdminDash = () => {
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEditUser, setSelectedEditUser] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/manage-users",
          { withCredentials: true }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => setShowLogoutAlert(true);
  const confirmLogout = async () => {
    await axios.post(
      "http://localhost:3000/admin/logout",
      {},
      { withCredentials: true }
    );
    dispatch(logoutAdmin());
    navigate("/admin");
  };
  const cancelLogout = () => setShowLogoutAlert(false);

  const searchUser = () => {
    setHasSearched(true);
    const searchQuery = search.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.mobile.includes(search)
    );
    setDisplay(filteredUsers);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/admin/delete/${selectedUser._id}`,
        { withCredentials: true }
      );
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      setDisplay(display.filter((u) => u._id !== selectedUser._id));
      setShowAlert(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedEditUser(user);
    setShowEditAlert(true);
  };

  const confirmEdit = () => {
    if (selectedEditUser) {
      navigate(`/adminedit/${selectedEditUser._id}`);
    }
    setShowEditAlert(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-left">
            <h2 className="dashboard-title">Admin Dashboard</h2>
            <p className="dashboard-subtitle">Manage your users efficiently</p>
          </div>
          
          <div className="header-right">
            <div className="search-container">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="search-input"
              />
              <button onClick={searchUser} className="search-button">
                <i className="fas fa-search"></i> Search
              </button>
            </div>
            
            <div className="action-buttons">
              <button onClick={() => setShowAddAlert(true)} className="add-button">
                <i className="fas fa-plus"></i> Add User
              </button>
              <button onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(display.length > 0 ? display : users).map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-profile">
                      <img
                        src={`http://localhost:3000${user.image}`}
                        alt={user.name}
                        className="profile-image"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="user-name">{user.name}</div>
                  </td>
                  <td>
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td>
                    <div className="user-mobile">{user.mobile}</div>
                  </td>
                  <td>
                    <div className="action-cell">
                      <button
                        onClick={() => handleEdit(user)}
                        className="edit-button"
                        title="Edit user"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="delete-button"
                        title="Delete user"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAlert && (
        <Alert
          message={`Are you sure you want to delete ${selectedUser.name}?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowAlert(false)}
        />
      )}

      {showEditAlert && (
        <Alert
          message={`Are you sure you want to edit ${selectedEditUser.name}?`}
          onConfirm={confirmEdit}
          onCancel={() => setShowEditAlert(false)}
        />
      )}

      {showAddAlert && (
        <Alert
          message="Are you sure you want to add a new user?"
          onConfirm={() => {
            navigate("/adminadd");
            setShowAddAlert(false);
          }}
          onCancel={() => setShowAddAlert(false)}
        />
      )}

      {showLogoutAlert && (
        <Alert
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </div>
  );
};

export default AdminDash;