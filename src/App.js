import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthComponent from './component/AuthComponent'
import ProfileEdit from './component/ProfileEdit'
import Profile from './component/Profile'

export function App() {

return (
    <>
      <Routes>
        <Route path = "/" element = { <AuthComponent /> } />
        <Route path = "/profile" element = { <Profile /> } />
        <Route path = "/profile/edit" element = { <ProfileEdit /> } />
      </Routes>    
    </>
  )
}

export default App
