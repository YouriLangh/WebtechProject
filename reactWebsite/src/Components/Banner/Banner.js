import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react'
import "./Banner.css"


function Banner(props) {
    const myCld = new Cloudinary({
        cloud: {
          cloudName: "dmm5cr74r",
          api_key: '863166137145835', 
          api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
        }
      });

  return (
    <div className='top_banner'>
        <div className='top_banner_content'>
        <AdvancedImage className='other_user_pic' cldImg={myCld.image(props.url)}/>
      <span>{props.username}</span>
      </div>
      <p>Date joined: {props.date_joined}</p>
      </div>
  )
}

export default Banner