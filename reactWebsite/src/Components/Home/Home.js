import { Card, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Home.css"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
const jwt = require('jsonwebtoken')

// home page for the users once they log in
function Home() {

  // A name variable to use for the UI of the site, this gets loaded in from the localstorage.
  const [name, setName] = useState('')
  // Used to navigate to another page
  const navigate = useNavigate()

  // Check if user is logged in, this is done by checking if there is a token (or cookie) in the localstorage, and then check if that token is the encoding of a username.
  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken){
     const user = jwt.decode(userToken)
     if(!user){
      //if it is not, redirect the user to the login page and remove the 'token' variable
       localStorage.removeItem('token')
       navigate('/login', { replace: true })}
       else{
        //if it is a username, keep this for the UI on the homepage
         setName(jwt.decode(userToken).username);}
       }
  }, [])

  // divs are mostly for manual CSS styling
  // Main features: a background image, a title containing current username and two cards containing some information to display such as "whats new" and "whats hot"
  return (
    <div className='home_page'>
        <div className='get_swiping'>
          <div className='title_content'>
          <div className='home_page_title'>
            <h1>Welcome back, {name}</h1>
            </div>
            <div className='title_text'>
            <p> Get swiping!</p>
            <button onClick={() => navigate('/app/events')}> <FontAwesomeIcon className ='sidenav_icon' icon= {faArrowRight}/></button>
          </div>
          </div>
          <div className='features' >
          <Card style={{backgroundColor: "#121213"}} className='feature'>
            <CardContent className='feature_content'>
              <div className='feature_title'>
              <p> What's new</p>
              </div>
              <div className='feature_body'>  <p> We're excited to launch our website! </p></div>
            </CardContent>
          </Card>
          <Card style={{backgroundColor: "#18191A"}} className='feature'>
            <CardContent className='feature_content'>
            <div className='feature_title'>
              <p> What's hot</p>
              </div>
              <div className='feature_body'>
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
    </div>
  )
}

export default Home