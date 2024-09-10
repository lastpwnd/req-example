import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const AuthComponent = () => {

const URL = "http://localhost:8000/api/v1"
const [isReged, setIsReged] = useState(false)
const [isLogined, setIsLogined] = useState(false)
const [finalCheck, setFinalCheck] = useState(false)
const [userCred, setUserCred] = useState([""])
let payload = {}

useEffect(() => { // checking if token already exists
    if (window.localStorage.getItem('token')) {
        setIsLogined(true)
        setIsReged(true)
    }
}, [])


const registerUser = async (e) => { // register user
    e.preventDefault()
    
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const repeatPassword = document.getElementById('repeatPassword').value

    

    if (password !== repeatPassword){
        window.alert("Your passwords do not match!")
    }
    else{
        try {
            
                  let dataToSend = {
                        firstName, 
                        lastName,
                        email,
                        password
                    }
            
            await axios.post(`${URL}/auth/register`,
                dataToSend)
                .then((res) => {
                    console.log(res); 
                    if (res.status === 201 || res.status === 200) 
                        setIsReged(true)         
                })          
           } catch (error) {
                console.log(error);
           }   
    }   
}

const loginUser = async (e) => { // login user
    e.preventDefault()

    const email = document.getElementById('email2').value
    const password = document.getElementById('password2').value
    

    try {
        await axios.post(`${URL}/auth/login`,
            {
                email,
                password
            }).then((res) => {
                payload = res.data       
            })
    } catch (error) {
          console.log(error)            
    }
    
    if (payload.token) {
        window.localStorage.setItem('token', payload.token)
        setIsLogined(true)
        setIsReged(true)
    }      
}

const checkAuth = async (e) => { // authentication check
    e.preventDefault()
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + window.localStorage.getItem('token')
        await axios.get(`${URL}/auth/me`)
        .then((res) => {
            console.log(res);
            setUserCred([res.data.email, res.data._id]) 
            setFinalCheck(true)  
        })
    } catch (error) {      
    }
}

const backToStart = () => {  // logout
    window.localStorage.removeItem('token')
    window.location.reload()
}

return (
    <>
        <>
            {(isReged)
                ?
                <></>
                :  
                <div className='container'>
                <form onSubmit={registerUser}> 
                    <label>First Name: </label>
                    <input type="text" id="firstName" name="firstName" /><br />
                    <label>Last Name: </label>
                    <input type="text" id="lastName" name="lastName" /><br />
                    <label>User Name: </label>
                    <input type="text" id="userName" name="userName" /><br />
                    <label>Email: </label>
                    <input type="text" id="email" name="email" /><br />
                    <label>Password: </label>
                    <input type="password" id="password" name="password" /><br />
                    <label>Repeat password: </label>
                    <input type="password" id="repeatPassword" name="repeatPassword" /><br />
                    <button type="submit">Register</button>
                </form> 
                </div>
                }
        </>
    <>
        {isLogined
            ? 
                <div className='container'>
                    {
                    (finalCheck) 
                                ? <>
                                    <h1>Checked!</h1>
                                    <p>User info is: <br />
                                    E-mail: {userCred[0]}<br />
                                    ID: {userCred[1]}</p>
                                    <button onClick={backToStart}>Erase Token & Log Out</button><br />
                                    <h3>OR</h3><br />
                                    <button><Link to="/profile"> Go to Profile </Link></button>
                                </>
                                : 
                                <>
                                    <button onClick={checkAuth}>Check Authentication</button><br />
                                    <br />
                                    <h1>Unchecked!</h1>
                                </>
                    }
                </div>
            :
                <div className='container'>
                    <br />
                    <form onSubmit={loginUser}> 
                        <label>Email: </label>
                        <input type="text" id="email2" name="email2" /><br />
                        <label>Password: </label>
                        <input type="password" id="password2" name="password2" /><br />
                        <button type="submit">Login</button>
                    </form> 
                </div>
       }
    </>
    </>
  )
}

export default AuthComponent