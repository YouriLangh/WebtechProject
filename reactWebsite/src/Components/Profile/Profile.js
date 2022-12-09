import React, { useState, useEffect } from 'react'
import'./Profile.css';
import Sidenav from '../Sidenav/Sidenav'
import axios from 'axios';
import Card from '@mui/material/Card';
import { CardContent, CardHeader } from '@mui/material';

const jwt = require('jsonwebtoken')

function Profile() {

  const [profile, setProfile] = useState({
    username: '',
    email: '',
  })

  const handleInput = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios({
        url:'http://localhost:4000/app/profile/edit',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: profile,
    }).then(res => {
      console.log(res.data);
    })
    } catch (error) {
      console.log(error);
    }
  };

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
      } catch (error) {console.log(error)}
  }, []);

  return (
  <div className='profile_page'>
      <Sidenav/> 
      <Card variant="outlined" className='profile_card'>
      <CardContent>
      <h1>{profile.username}</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          value={profile.username}
          placeholder={"Your names"}
          onChange={handleInput}
        />
        <br/>
        <input
          name="email"
          type="email"
          value={profile.email}
          placeholder={"Your email"}
          onChange={handleInput}
        />
        <br/>
        <input type="submit" value="Update"/>
      </form>
      </CardContent>
      </Card>
  </div>
  )
}

export default Profile