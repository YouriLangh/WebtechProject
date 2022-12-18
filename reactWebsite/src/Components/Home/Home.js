import { Card, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Home.css"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
const jwt = require('jsonwebtoken')

// home page for the users once they log in
function Home() {

  const [name, setName] = useState('')
  const navigate = useNavigate()

  // Check if user is logged in
  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken){
     const user = jwt.decode(userToken)
     if(!user){
       localStorage.removeItem('token')
       navigate('/login', { replace: true })}
       else{
         setName(jwt.decode(userToken).username);}
       }
  }, [])
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
              <div className='feature_body'>  <p> What'seyr reeyr reey reeyr  </p></div>
            </CardContent>
          </Card>
          <Card style={{backgroundColor: "#18191A"}} className='feature'>
            <CardContent className='feature_content'>
            <div className='feature_title'>
              <p> What's hot</p>
              </div>
              <div className='feature_body'>
                <p> rezrezrz</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
    </div>
  )
}

export default Home