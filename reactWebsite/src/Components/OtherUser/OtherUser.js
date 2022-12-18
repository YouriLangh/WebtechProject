import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OtherUser.css'
import Comments from '../Comments/Comments'
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react'
import { Card, CardContent } from '@mui/material'
import noUser from '../../images/noUser.png'
import StarRatingComponent from 'react-star-rating-component';
import Banner from '../Banner/Banner'

// The OtherUser component is a component which holds and displays the information of other users, 
function OtherUser() {

    const jwt = require('jsonwebtoken')
    const {id} = useParams()
    const [user, setUser] = useState({})
    const [userExists, setUserExists] = useState(true)

    const navigate = useNavigate()
    const myCld = new Cloudinary({
        cloud: {
          cloudName: "dmm5cr74r",
          api_key: '863166137145835', 
          api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
        }
      });

      // Returns the page of the user we are looking for, unless we are looking for ourselves, in which case we redirect to the profile.
    const getUser = async (currentUserName) => {
        await axios.post('http://localhost:4000/app/users', {id: id}).then((res) => {
           if(res.status === 200){
              if(res.data.token){
                const token = jwt.decode(res.data.token)
                if(token.username === currentUserName) {navigate("/app/profile")} else{
                const formattedDate = new Date(token.date_joined)
                const formattedInterests = token.interests.map((element, index) => element.substring(0, element.length - 9))
                const formatted = ({username: token.username, activities: token.activities,
                email: token.email, url: token.url, rating: token.rating, comments: token.comments, date_joined: formattedDate.toLocaleDateString(), interests: formattedInterests})
                setUser(formatted)
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


   const updateRating = (new_rating) => {
    setUser( prev_state => ({...prev_state, rating: new_rating}))
   }
   let content
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
              value={user.rating}/></div>
              <div className='pic_line dividing_line' />
              <span className='other_user_content_title'>ABOUT: </span>
              <div className=' content_dividing_line dividing_line' />
              <div className='user_info '>
                <div className='user_bio info_container'> 
                  <p className='info_title'>Bio </p> 
                  <p>{false ? "{user.bio}" : "haha sofunnysofunny"} </p>
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
                  { user && user.activities && user.interests.length > 0 ? <> {user.interests.map(activity => <div className='activity_container'>
                    <img src={noUser} alt="activity_picture"/>
                    <p>haahah rzear ezrezar azer zear </p>
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
    navigate("/app/home")

   }

  return (
    <div className='other_user_page'>

        {content}
        <div className='background'></div>
    </div>

  )
}

export default OtherUser