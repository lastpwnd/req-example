import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const ProfileEdit = () => {

const URL = "http://localhost:8000"
const [isAuthed, setIsAuthed] = useState(false)
const [isLoading, setIsLoading] = useState(true)
const [dataFetched, setDataFetched] = useState()
const [formLoaded, setFormLoaded] = useState(false)
const [loadAvatar, setLoadAvatar] = useState()
const navigate = useNavigate()

const token = window.localStorage.getItem('token')

useEffect(() => {  
    if (checkAuth(token)){
        setIsAuthed(true)
        setIsLoading(false)    
    }
},[])

useEffect(() => {  
    if (!dataFetched)
    {
        fetchData()
    }
    else {
        setFormLoaded(true)
    }   
},[dataFetched])

const checkAuth = async (arg) => {
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + arg
        const checkAuth = await axios.get(`${URL}/api/v1/auth/me`)
        return checkAuth
    } catch (error) { 
        console.log(error)     
        setIsAuthed(false)
        setIsLoading(false)
    }
     
}

const fetchData = async () => {
    try {
        const req = await axios.get(`${URL}/api/v1/profile/edit`)
        setDataFetched(req.data)
        setLoadAvatar(req.data.avatarUrl) 
    } catch (error) {
        console.log(error);    
    }
}

const updateProfile = async (e) => {  
    e.preventDefault()

    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const userName = document.getElementById('userName').value
    const password = document.getElementById('password').value
    const avatarUrl = loadAvatar
    
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token
        await axios.put(`${URL}/api/v1/profile/edit`, {
            firstName,
            lastName,
            userName,
            password,
            avatarUrl
        }).then((res) => {
            navigate("/profile")          
        })   
       
    } catch (error) {
        console.log(error) 
    }
}

const avatarSelect = (event) => {
    setLoadAvatar(event.target.alt)
}

const renderAvatars = () => {
    const array = dataFetched.avatarsList
    const result = array.toString().split(",").map((e,key) => {
        return <button className='avatarButton' id={key} onClick={avatarSelect} key={key} ><img className='avatarButton' src={URL+e} alt={e} /></button> 
    })
    return result
}

return (
    <>
        {
            (isLoading)
                ? <></>
                : <>
                    <>
                    <h2>Auth'ed!?</h2> { (isAuthed) 
                        ? <><h2>Yes</h2>
                            {(formLoaded) 
                                ?<>
                                <div className="container1">
                                    <div className="container2">
                                        <img src={`${URL}${dataFetched.avatarUrl}`} alt="userAvatar" />
                                            <form onSubmit={updateProfile} autoComplete='off'>
                                                <label>First Name: *</label>
                                                <input type="text" id="firstName" name="firstName" autoComplete='off' defaultValue={dataFetched.firstName}/><br />
                                                <label>Last Name: *</label>
                                                <input type="text" id="lastName" name="lastName" autoComplete='off' defaultValue={dataFetched.lastName}/><br />
                                                <label>Username: *</label>
                                                <input type="text" id="userName" name="userName" autoComplete='off' defaultValue={dataFetched.userName}/><br /> 
                                                {/* <input type="text" id="avatarUrl" hidden name="avatarUrl" autoComplete='off' defaultValue={dataFetched.avatarUrl}/>                                     */}
                                                <label>Password: *</label>
                                                <input type="password" id="password" name="password" /><br />        
                                                <button type="submit">Update</button>
                                            </form> 
                                    </div>
                                    <div className="container2">
                                        {renderAvatars()}
                                        <br />
                                    </div>
                                </div>
                                </> 
                                : <></>}
                        </> 
                        :<>
                            <h2>No</h2><button><Link to="/"> Back to Index Page</Link></button>
                        </> }</>
                    <button><Link to="/profile"> Back to Profile</Link></button>
                </>
        }
    </>
  )
}

export default ProfileEdit