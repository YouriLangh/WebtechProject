import React, { useState, useEffect } from 'react'
import'./Profile.css';
import Sidenav from '../Sidenav/Sidenav'
import axios from 'axios';
const jwt = require('jsonwebtoken')

function Profile() {

  const [profile, setProfile] = useState({
    username: '',
  })

  useEffect(() => {
      const userToken = localStorage.getItem('token');
      const username = jwt.decode(userToken).username;
      try{ 
      axios({
        url: 'http://localhost:4000/app/profile',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            username,
        }),
        }).then(res => {
          let profile = jwt.decode(res.data.profile);
          setProfile(profile);})
      } catch (error) { console.log(error)}
  }, []);

  return (
  <div className='profile_page'>
      <Sidenav/> 
      <p>username: {profile.username}</p>
  </div>
  )
}

export default Profile