import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import "./Users.css"
import { useNavigate } from 'react-router-dom';
const jwt = require('jsonwebtoken')

function Users() {

    const navigate = useNavigate()
    
    const myCld = new Cloudinary({
        cloud: {
          cloudName: "dmm5cr74r",
          api_key: '863166137145835', 
          api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
        }
      });

    const[users, setUsers] = useState([])
    const[filter, setFilter] = useState('')
    const getUsers = async () => {
         await axios.get('http://localhost:4000/app/users').then((res) => {
            if(res.status === 200){
                setUsers(res.data.formatted.map(element => jwt.decode(element)))
            }
         })
    }
    useEffect( () => {
        getUsers()
    },[])


    const changeFilter = (string) => {
        console.log(string)
        setFilter(string)
    }

    const checkFilter = (user) => {
        const theName = user.username
        return theName.includes(filter)

    }
  return (
    <div className='users_page'>
        <h1>Look for other users</h1>
        <input type="text"   onChange={(e) => changeFilter(e.target.value)}></input>
        <div className='all_users'>
            {users && users.filter(user => 
                checkFilter(user)
            ).map(user =>
            <Card onClick={(e) => navigate(`/app/users/${user.id}`)} key={user.id} className='user_card'>
                <CardContent className='users_content'>
                <AdvancedImage className='users_pic' cldImg={myCld.image(user.url)}/>
                <div className='users_info'>
                    <p>{user.username}</p>
                    </div>
                </CardContent>
            </Card>
                )}
        </div>
    </div>
  )
}

export default Users