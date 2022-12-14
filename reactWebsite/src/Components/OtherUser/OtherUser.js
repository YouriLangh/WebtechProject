import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OtherUser.css'
import Comments from '../Comments/Comments'
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react'
import { Card, CardContent } from '@mui/material'
import SportsImg from '../../images/sports.jpg'
import CultureImg from '../../images/culture1.jpg'
import PartiesImg from '../../images/party.jpg'
import ConcertsImg from '../../images/concert.jpg'
import MusicImg from '../../images/music.jpg'
import OtherImg from '../../images/other.jpg'
import SocialImg from '../../images/social.jpg'
import StarRatingComponent from 'react-star-rating-component';
import Banner from '../Banner/Banner'

// The OtherUser component is a component which holds and displays the information of other users, 
function OtherUser() {

  // jwt gets used to decrypt the tokens sent from the server
    const jwt = require('jsonwebtoken')
    // We get the id of the user we are trying to look up from the searchparameters in the URL
    const {id} = useParams()
    const [user, setUser] = useState({})
    const [userExists, setUserExists] = useState(true)
    const [activities, setActivities] = useState([])
    const [avgRating, setAvgRating] = useState(5)

    const navigate = useNavigate()
    const myCld = new Cloudinary({
        cloud: {
          cloudName: "dmm5cr74r",
          api_key: '863166137145835', 
          api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
        }
      });

      // When fetching the user, they keep fields of all the activities they signed up for. This is kept with the id's of the activities, 
      // thus we have to fetch the information of each activity corresponding to that id.
    const getAct = async (act) => {
      await axios.post('http://localhost:4000/app/users/activities', {actId: act}).then((res) => {
        if (res.status === 200){
          if(res.data.token){
            const token = jwt.decode(res.data.token)
            setActivities(old => [...old, ({activityName: token.activityName, activityType: token.activityType})])
            console.log(token)
          }
        } else console.log("Server Error")

      })
    }

      // Returns the page of the user we are looking for, unless we are looking for ourselves, in which case we redirect to the profile.
      // Store all the fetched data in the "user" field of the UseState, if we did not find the user, we set the 'userexists' to false.
    const getUser = async (currentUserName) => {
        await axios.post('http://localhost:4000/app/users', {id: id}).then((res) => {
           if(res.status === 200){
              if(res.data.token){
                const token = jwt.decode(res.data.token)
                if(token.username === currentUserName) {navigate("/app/profile")} else{
                  console.log(token)
                const formattedDate = new Date(token.date_joined)
                const formattedInterests = token.interests.map((element, index) => element.substring(0, element.length - 9))
                const formatted = ({username: token.username, activities: token.activities,
                email: token.email, bio: token.bio, url: token.url, rating: token.rating, comments: token.comments, date_joined: formattedDate.toLocaleDateString(), interests: formattedInterests})
                setUser(formatted)
                setAvgRating(token.rating)
                token.activities.forEach(act => getAct(act))
                window.scrollTo(0, 0);
                }
              } else {
                setUserExists(false)
              }
           } else {
            console.log("error", res)
           }
        })
   }
   // check if the user is still logged in, if yes, find the user we are looking for with getUser
   useEffect( () => {
    setUser({})
    setUserExists(true)
    setActivities([])
    setAvgRating(5)
    const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if(!user) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
    
                // Get all the activities from the database 
             } else { getUser(user.username)
              }
        } else { navigate('/login', { replace: true })}
       
   },[id])

   // Hardcoded image fetch for each type of activity.
   // this is done because the activities did not have an option to upload pictures.
   const getImage = (activityType) => {
    if(activityType === "Sports") return SportsImg;
    if(activityType === "Culture") return CultureImg;
    if(activityType === "Social") return SocialImg;
    if(activityType === "Music") return MusicImg;
    if(activityType === "Parties") return PartiesImg;
    if(activityType === "Concerts") return ConcertsImg;
    if(activityType === "Other") return OtherImg;


   }

   // When the user receives a new comment, this callback gets called to update the current rating of the user on their profile.
   const updateRating = (new_rating, new_comments) => {
    setAvgRating( new_rating )
   }

   let content
   //If the user exists, we display all their information
   // A lot of divs for manual CSS
   // Main features:
   // - Uses the Banner component, which displays a banner with some user information at the top of the page
   // - Uses the Comments component, to hold and display all the comments of that user, and the ability to add more comments
   // - a separate container for all the activities for which that user is registered into
   // - A Card container for all the user data
   // - A star rating component to display the rating of the user
   // To display activities and interests, we map over those lists
   if(userExists){
    content = 
    <div className='content'>
      <div className='banner_container'>
      {user ? <Banner username= {user.username} url={user.url} date_joined={user.date_joined}/> : "" }
      </div>
      <div className='other_user_page_content'>
        <div className='other_user_content_container'>
          <div className='other_user_card_container card_container'>
          <Card className='other_user_card'>
          <CardContent className='card_content'>
          <span className='card_title'>{user.username}</span>
          <AdvancedImage className='other_user_pic' cldImg={myCld.image(user.url)}/>
          <div className='pic_line dividing_line' />
          <div className='other_user_rating'> <StarRatingComponent
              name="rate2" 
              editing={false}
              starCount={5}
              value={avgRating}/></div>
              <div className='pic_line dividing_line' />
              <span className='other_user_content_title'>ABOUT: </span>
              <div className=' content_dividing_line dividing_line' />
              <div className='user_info '>
                <div className='user_bio info_container'> 
                  <p className='info_title'>Bio </p> 
                  <p className='bio_text'>{user.bio}</p>
                </div>
                <div className='user_interests info_container'>  
                <p className='info_title'>Interested topics </p> 
                <div className='user_interest_container'>
                {Object.keys(user).length !== 0 &&  user.interests.map(interest => <div key={interest} className="user_interest"> {interest}
                 </div> )}
                </div>
            </div>
              </div>
              <div className='comments'>
              {user.comments ? <Comments updateCallback={updateRating} profile ={user}  />: ''}
              </div>
          </CardContent>
            </Card>
          </div>
          <div className='other_user_activities_container card_container'>
            <Card className='activities_card'>
              <CardContent className='activities_card_content'>
                <div className='activities_title'> 
                <span> Activities</span>
                </div>
                <div className=' content_dividing_line dividing_line' />
                <div className='registered_activities'>
                  { user && user.activities && activities.length > 0 ? <> {activities.map(activity => <div key={activities.indexOf(activity)} className='activity_container'>
                    <div className='pic_container'>
                    <img src={getImage(activity.activityType)} alt="activity_picture"/>
                    </div>
                    <p>{activity.activityName}</p>
                     </div>
                    ) }</> : <p className='no_activities'>No activities yet!</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

   } else {
    content = 
    <div className='content'>
      <div className='center'>
          <h1 className='centered'>User does not exist</h1>
      </div>
    </div>

   }

  return (
    <div className='other_user_page'>

        {content}
        <div className='background'></div>
    </div>

  )
}

export default OtherUser