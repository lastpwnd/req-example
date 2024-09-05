import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Bookmarks from './Bookmarks'

const Profile = () => {

const URL = "http://localhost:8000"
const [isAuthed, setIsAuthed] = useState(false)
const [isLoading, setIsLoading] = useState(true)
const [dataFetched, setDataFetched] = useState()
const [showProfile, setShowProfile] = useState(false)
const [bookmarks, setBookmarks] = useState([])
const [showBookmarks, setShowBookmarks] = useState(false)
const [dates, setDates] = useState([])
const [events, setEvents] = useState([])

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
        getProfile()
        getBookmarks()
    }
    else {
        setShowProfile(true)
    }   
},[dataFetched])

useEffect(()=>{
    if(bookmarks.data != undefined) {  
        processBM()
        setShowBookmarks(true)    
    }
},[bookmarks])


const checkAuth = async () => { // checking authentication
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token
        const checkAuth = await axios.get(`${URL}/api/v1/auth/me`)
        return checkAuth
    } catch (error) {
        console.log(error)
        setIsAuthed(false)
        setIsLoading(false)
    }
     
}

const getProfile = async () => { // loading profile data
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token
        const profile = await axios.get(`${URL}/api/v1/profile`)
        setDataFetched(profile.data) 
    } catch (error) {
        console.log(error);   
    }
}

const getBookmarks = async () => {
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token
        const bookmarks = await axios.get(`${URL}/api/v1/bookmarks`)

        if (!bookmarks.data.length == 0) { 
            setBookmarks(bookmarks)
        }

    } catch (error) {
        console.log(error)
    }
}

const processBM = () => {
    const dates = bookmarks.data.map((e) => {
        return e.createdAt
     })
    const events = bookmarks.data.map((e) => {
        return e.event
    })    
    setDates(dates)
    setEvents(events)
}

return (
    <>
        {(isLoading) ? <>LOADING...</>
                     : <>
                        {(isAuthed) ? <><h1>Auth'ed!!</h1><br />
                                        {(showProfile) ?
                                                            <>
                                                                <div className="container1">
                                                                    {/* Main profile info */}
                                                                <div className="container3">  
                                                                    <img src={`${URL}${dataFetched.avatarUrl}`} alt="userAvatar" />
                                                                    <h2> {dataFetched.userName}</h2>
                                                                    Firstname: <b>{dataFetched.firstName}</b><br />
                                                                    Lastname: <b>{dataFetched.lastName}</b><br />
                                                                    <button><Link to="/profile/edit"> Edit Profile </Link></button>
                                                                    <button><Link to="/"> Back to Index Page </Link></button>
                                                                </div>
                                                                
                                                                
                                                                {/* User's Bookmarks Section */}
                                                                    <div className="container3" >
                                                                       {(showBookmarks) ? <Bookmarks dates={dates} events={events} />
                                                                                        : <>You have no bookmarks</>
                                                                       }
                                                                    </div>    
                                                                </div>
                                                            </>
                                                        :
                                                            <></>
                                        }
                                      </>
                                    : <><h2>Not auth'ed!!</h2><button><Link to="/"> Back to Index Page </Link></button></>
                        }
                     </>
        }
    </>
  )
}

export default Profile