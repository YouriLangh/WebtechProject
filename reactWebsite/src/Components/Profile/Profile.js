import React, { useState, useEffect } from 'react'
import'./Profile.css';
import Sidenav from '../Sidenav/Sidenav'
import axios from 'axios';
import Card from '@mui/material/Card';
import { CardContent, Typography, Button, Divider } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
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
    url: '',
    comments: [],
  })

  const [pfp, setPfp] = useState(myCld.image(profile.url))
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])

  const handleInput = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDb(profile);
  };
  
  const updateDb = async (new_profile) => {
    try {
      const res = await axios({
        url:'http://localhost:4000/app/profile/edit',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: new_profile,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };  

  const updatePfp = async (newUrl) => {
    if (newUrl == "") {
      setPfp(myCld.image("pfp/default_pfp"))
    } else {
      setPfp(myCld.image(newUrl));
    }
  } 

  const handleUpload = async (e) => {
    let new_profile = {...profile, url: e.info.public_id}
    setProfile(new_profile);
    updateDb(new_profile)
    updatePfp(e.info.public_id);
  }

  const addComment = async (e) => {
    const username = profile.username;
    try {
      axios({
        url: 'http://localhost:4000/app/profile/comment',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          username,
          comment,
        }),
      }).then(res => {
        console.log(res)
      })
    } catch (error) {console.log(error)}
    document.getElementById("comments_list").innerHTML += ('<li>'+comment+'</li>');
    setComment('')
    document.getElementById("comment_input").value = '';
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
          let newProfile = jwt.decode(res.data.profile);
          setProfile(newProfile);
          updatePfp(newProfile.url);
          setComments(newProfile.comments);
          console.log(newProfile.comments);})
      } catch (error) {console.log(error)}
      pfp
      .resize(thumbnail().gravity(focusOn(FocusOn.face())))
  }, []);

  return (
    <div> 
      <WidgetLoader />
      <div className='profile_page'>
        <Sidenav/> 
        <Card variant="outlined" className='profile_card'>
        <CardContent>
        <Typography variant="h1" align="center">
          {profile.username}
        </Typography>
        <div className='pfp'>
        <AdvancedImage 
        cldImg={pfp} 
        className='avatar'/>
        <br/>
        <Widget
          buttonText={'Upload image'}
          id='cloudinary_upload_button'
          resourceType={"image"}
          cloudName={'dmm5cr74r'}
          uploadPreset={'nsro5aio'}
          folder={'pfp'}
          onSuccess={handleUpload}
          ></Widget>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            id = "username"
            name="name"
            type="text"
            value={profile.username}
            placeholder={"Your names"}
            onChange={handleInput} 
            />
          <label htmlFor="username">E-mail: </label>
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
        <Divider>Comments</Divider>
        <div className="comments">
          <ul id="comments_list">
            {comments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
        <textarea
          id="comment_input"
          rows='5'
          cols='50'
          placeholder='Type your comment here'
          onChange={e => setComment(e.target.value)}
        />
        <br/>
        <Button variant="outlined" onClick={addComment} id="add_comment_button">
          Add comment
        </Button>
        </div>
        </CardContent>
        </Card>
    </div>
  </div>
  )
}

export default Profile