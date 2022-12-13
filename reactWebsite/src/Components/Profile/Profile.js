import React, { useState, useEffect } from 'react'
import'./Profile.css';
import Sidenav from '../Sidenav/Sidenav'
import axios from 'axios';
import Card from '@mui/material/Card';
import { CardContent, CardHeader } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import { radius } from '@cloudinary/url-gen/actions/reshape/';
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {max} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const jwt = require('jsonwebtoken')

function Profile() {

  const myCld = new Cloudinary({
    cloud: {
      cloudName: "dmm5cr74r",
      api_key: '863166137145835', 
      api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
    }
  });

  const [profile, setProfile] = useState({
    username: '',
    email: '',
  })

  const [pfpUrl, setPfpUrl] = useState('pfp/default_pfp')
  const [pfp, setPfp] = useState(myCld.image(pfpUrl))

  useEffect(() => {
    setPfp(myCld.image(pfpUrl))
  }, [pfpUrl])

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

  const handleUpload = (e) => {
    console.log(e)
    setPfpUrl(e.info.public_id);
  }

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
      pfp
      .resize(thumbnail().gravity(focusOn(FocusOn.face())))
  }, []);

  return (
    <html>
      <WidgetLoader />
  <div className='profile_page'>
      <Sidenav/> 
      <Card variant="outlined" className='profile_card'>
      <CardContent>
      <h1>{profile.username}</h1>
      <AdvancedImage 
      cldImg={pfp} 
      className='avatar'/>
      <br/>
      <Widget
        resourceType={"image"}
        cloudName={'dmm5cr74r'}
        uploadPreset={'nsro5aio'}
        folder={'pfp'}
        onSuccess={handleUpload}
        ></Widget>
      <form onSubmit={handleSubmit}>
        <label for="username">Username:</label>
        <input
          id = "username"
          name="name"
          type="text"
          value={profile.username}
          placeholder={"Your names"}
          onChange={handleInput} 
          />
        <label for="username">E-mail: </label>
        <input
          id="email"
          name="email"
          type="email"
          value={profile.email}
          placeholder={"Your email"}
          onChange={handleInput}
        />
        <input type="submit" value="Update"/>
      </form>
      </CardContent>
      </Card>
  </div>
  </html>
  )
}

export default Profile