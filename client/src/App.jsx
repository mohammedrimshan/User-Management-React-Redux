import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SignUp from './Components/User/Signup/SignUp'
import Home from './Components/User/Home/Home'
import UpdateProfile from './Components/User/Update/UpdateProfile'


function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<SignUp />}/>
    <Route path='/dashboard' element={<Home />}/>
    <Route path='/update' element={<UpdateProfile />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
