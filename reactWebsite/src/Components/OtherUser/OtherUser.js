import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OtherUser.css'
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react'
import { Card, CardContent } from '@mui/material'
import noUser from '../../images/noUser.png'

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
                console.log(formattedInterests.join(', '))
                const formatted = ({username: token.username,
                email: token.email, url: token.url, date_joined: formattedDate.toLocaleDateString(), interests: formattedInterests.join(', ')})
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

   let content
   if(userExists){
    content = <div className='content'>
      <div className='top_banner'>
        <div className='top_banner_content'>
        <AdvancedImage className='other_user_pic' cldImg={myCld.image(user.url)}/>
      <span>{user.username}</span>

      </div>
      <p>Date joined: {user.date_joined}</p>
      </div>
      <div className='other_user_content'>
       
      <Card className='other_user_card card'>
        <CardContent className='card_content'>
        <span className='card_title'>{user.username}</span>
        <AdvancedImage className='other_user_pic' cldImg={myCld.image(user.url)}/>
        <div className='rating'> rating</div>
        <div className='pic_line'></div>
          <span>ABOUT: </span>
          <div className='line'></div>
          <div className='other_user_info'>
          <div className='other_user_bio info'><p className='explanation'>Bio </p> <p className='user_data'>I love adventure and excitement! Flowers are my go-to </p></div>
          </div>
          <div className='other_user_interests'>
          <span>Interested topics </span>

           {user && user.interests}
          </div>
        </CardContent>
      </Card>
      <Card className='registered_activities card'>

      <CardContent className=' '>
      <span>Activities</span>
</CardContent>
      </Card>

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