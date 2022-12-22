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
import SportsImg from '../../images/sports.jpg'
import CultureImg from '../../images/culture1.jpg'
import PartiesImg from '../../images/party.jpg'
import ConcertsImg from '../../images/concert.jpg'
import MusicImg from '../../images/music.jpg'
import OtherImg from '../../images/other.jpg'
import SocialImg from '../../images/social.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

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
    interests: [],
    activities: [],
  })

  const [pfp, setPfp] = useState(myCld.image(profile.url))
  const [interests, setInterests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [bio, setBio] = useState('My bio goes here');
  const [editMode, setEditMode] = useState(false);
  const [profileToken, setProfileToken] = useState('');


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

  const getAct = async (act) => {
    await axios.post('http://localhost:4000/app/users/activities', {actId: act}).then((res) => {
      if (res.status === 200){
        if(res.data.token){
          const token = jwt.decode(res.data.token)
          setActivities(old => [...old, ({activityName: token.activityName, activityType: token.activityType, _id: act})])
          console.log(token)
        }
      } else console.log("Server Error")

    })
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
              setProfileToken(res.data.profile);
              updatePfp(newProfile.url);
              setInterests(newProfile.interests);
              newProfile.activities.forEach(act => getAct(act))
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

  const getImage = (activityType) => {
    if(activityType === "Sports") return SportsImg;
    if(activityType === "Culture") return CultureImg;
    if(activityType === "Social") return SocialImg;
    if(activityType === "Music") return MusicImg;
    if(activityType === "Parties") return PartiesImg;
    if(activityType === "Concerts") return ConcertsImg;
    if(activityType === "Other") return OtherImg;
   }

   function handleDeleteActivity(act) {
    try {
      axios({
        url: 'http://localhost:4000/app/activity/leave',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          activityID: act._id,
          userToken: profileToken,
        }),
      }).then(res => {
        console.log(res)
        setActivities([])
        res.data.activities.forEach(act => getAct(act))
      })
    } catch (error) {console.log(error)}
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
        <div className='activities_container'>
            <Card className='activities_card'>
              <CardContent className='activities_card_content'>
                <div className='activities_title'> 
                <span> Activities</span>
                </div>
                <div className=' content_dividing_line dividing_line' />
                <div className='registered_activities'>
                  { profile && profile.activities && activities.length > 0 ? <> {activities.map(activity => <div key={activities.indexOf(activity)} className='activity_container'>
                    <div className='pic_container'>
                    <img src={getImage(activity.activityType)} alt="activity_picture"/>
                    </div>
                    <p>{activity.activityName}</p>
                    <Button onClick={() => handleDeleteActivity(activity)}><FontAwesomeIcon icon={faTrash} /></Button>
                    </div>
                    ) }</> : <p className='no_activities'>No activities yet!</p>}
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  </div>
  )
}

export default Profile