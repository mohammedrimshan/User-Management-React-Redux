import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from './Redux/Store'; 
import SignUp from './Components/User/Signup/SignUp';
import Home from './Components/User/Home/Home';
import UpdateProfile from './Components/User/Update/UpdateProfile';
import ProtectEdit from './Context/ProtectEdit';
import ProtectHome from './Context/ProtectHome';
import AdminLogin from './Components/Admin/Login/AdminLogin';
import AdminHome from './Components/Admin/AdminHome/AdminHome';
import AdminDash from './Components/Admin/Dashboard/AdminDash';
import EditAdmin from './Components/Admin/Edit/EditAdmin';
import AddUser from './Components/Admin/AddUser/AddUser';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminAuth from './Context/AdminAuth';
import AdminLoginAuth from './Context/AdminLoginAuth';

function App() {
  console.log("App is rendering...");

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public User Routes */}
          <Route path='/' element={<ProtectEdit><SignUp /></ProtectEdit>} />
          <Route path='/dashboard' element={<ProtectHome><Home /></ProtectHome>} />
          <Route path='/update' element={<ProtectHome><UpdateProfile /></ProtectHome>} />

          {/* Admin Routes - Updated structure */}
          <Route path='/admin' element={<AdminAuth><AdminLogin /></AdminAuth>} />
          <Route 
            path='/admin/home' 
            element={
              <AdminLoginAuth>
                <AdminHome />
              </AdminLoginAuth>
            } 
          />
          <Route 
            path='/admindashboard' 
            element={
              <AdminLoginAuth>
                <AdminDash />
              </AdminLoginAuth>
            } 
          />
          <Route 
            path='/adminedit/:id' 
            element={
              <AdminLoginAuth>
                <EditAdmin />
              </AdminLoginAuth>
            } 
          />
          <Route 
            path='/adminadd' 
            element={
              <AdminLoginAuth>
                <AddUser />
              </AdminLoginAuth>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
