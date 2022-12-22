import React, { useState, useEffect } from 'react'
import'./Profile.css';
import Comments from '../Comments/Comments'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Card from '@mui/material/Card';
import { CardContent, Button } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const jwt = require('jsonwebtoken')

function Profile(props) {

  const navigate = useNavigate()
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
    interests: []
  })

  const [pfp, setPfp] = useState(myCld.image(profile.url))
  const [interests, setInterests] = useState([]);
  const [bio, setBio] = useState('My bio goes here');
  const [editMode, setEditMode] = useState(false);

  const updatePfp = async (newUrl) => {
    if (newUrl == "") {
      setPfp(myCld.image("pfp/default_pfp"))
    } else {
      setPfp(myCld.image(newUrl));
      try{ 
        axios({
          url: 'http://localhost:4000/app/profile/edit',
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          data: JSON.stringify({
              username: profile.username,
              url: newUrl,
          }),
          }).then(res => console.log(res))
           } catch (error) {console.log(error)}
        pfp
        .resize(thumbnail().gravity(focusOn(FocusOn.face())))
      } 
    } 

  const handleUpload = async (e) => {
    let new_profile = {...profile, url: e.info.public_id}
    setProfile(new_profile);
    updatePfp(e.info.public_id);
    props.updateCallback({username: profile.username, url: e.info.public_id})
  }

  useEffect(() => {

    const userToken = localStorage.getItem('token');
    if (userToken){
     const user = jwt.decode(userToken)
     if(!user){
      //if it is not, redirect the user to the login page and remove the 'token' variable
       localStorage.removeItem('token')
       navigate('/login', { replace: true })}
       else{
        const username = user.username
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
              setInterests(newProfile.interests);
              setBio(newProfile.bio);})
          } catch (error) {console.log(error)}
          pfp
          .resize(thumbnail().gravity(focusOn(FocusOn.face())))
         
      }
       }

  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      axios({
        url:'http://localhost:4000/app/profile/edit',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username: profile.username,
          bio: bio,
          interests: interests,
        },
    }).then(res => {
      console.log(res);
      setProfile(res.data);
      setEditMode(false);
    })
    } catch (error) {
      console.log(error);
    }
  };

  const handleInterest = (id) => {
    var element = document.getElementById(id);
    element.classList.toggle("selected")
    if(element.classList.contains("selected")){
        setInterests(prevArray => [...prevArray, id])
    } else {setInterests(interests.filter(eId => eId !== id))}
  }

  const getClasses = (id) => {
    if(interests.includes(id)){
        return "interests selected"
    } else return "interests"
 }

  return (
    <div> 
      <WidgetLoader />
      <div className='profile_page'>
        <Card variant="outlined" className='profile_card'>
        <CardContent>  
        <div className="edit_button">
        <Button variant="outlined" onClick={() => setEditMode(!editMode)}>Edit</Button>
        </div><br/>
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
        <div className="profile-username">{profile.username}</div>
        <p align="center">
          {profile.email}
        </p>
        <div className="bio">
          {editMode ? (
          <div>
            <textarea 
            value={bio} 
            onChange={(event) => setBio(event.target.value)}
            rows='5'
            cols='50' /><br/>
            <Button variant="outlined" onClick={handleSave}>Save</Button>
          </div>
          ) : (
          <div>{bio}</div>
          )}
        </div>
        <div className='user_interests info_container'>  
                {editMode ? (
                <div>
                <div className="input_fields">
                  <p>Select activities that interest you!</p>
                  <div id="interests"className='interest_options'>
                  <input id="culture_interest" onClick= {() => handleInterest("culture_interest")} className={getClasses("culture_interest")} value="Culture" type="button" />
                  <input id="music_interest" onClick= {() => handleInterest("music_interest")} className={getClasses("music_interest")} value="Music" type="button" />
                  <input id="sports_interest" onClick= {() => handleInterest("sports_interest")} className={getClasses("sports_interest")} value="Sports" type="button" />
                  <input id="parties_interest" onClick= {() => handleInterest("parties_interest")} className={getClasses("parties_interest")} value="Parties" type="button" />
                  <input id="concerts_interest" onClick= {() => handleInterest("concerts_interest")} className={getClasses("concerts_interest")} value="Concerts" type="button" />
                  <input id="social_interest" onClick= {() => handleInterest("social_interest")} className={getClasses("social_interest")} value="Social" type="button" />
                  <input id="other_interest" onClick= {() => handleInterest("other_interest")} className={getClasses("other_interest")} value="Other" type="button" />
                  </div>
                </div>
                <div className='save_interests'>
                <Button variant="outlined" onClick={handleSave}>Save</Button>
                </div>
                </div>
                ) : (
                  <div className='user_interest_container'>
                    <p className='info_title'>Interested topics </p>
                  {Object.keys(profile).length !== 0 &&  profile.interests.map(interest => <div key={interest} className="user_interest"> {interest}
                   </div> )}
                  </div>)}
        </div>
        <div className='user_comments'>
        <Comments showStars= {true} profile={profile}/>
        </div>
        </CardContent>
        </Card>
    </div>
  </div>
  )
}

export default Profile