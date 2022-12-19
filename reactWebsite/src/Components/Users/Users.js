import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import { Card, CardContent, Checkbox, FormControlLabel } from '@mui/material'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import "./Users.css"
import { useNavigate } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faArrowUpAZ, faArrowDownAZ } from '@fortawesome/free-solid-svg-icons'
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
    const[filteredList, setFilteredList] = useState([])

 
    const getUsers = async (CurrentUser) => {
         await axios.get('http://localhost:4000/app/users').then((res) => {
            if(res.status === 200){
                setUsers(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
                setFilteredList(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
            }
         })
    }
    useEffect( () => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if(!user) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
                // Get all the activities from the database 
             } else {getUsers(user)
              }
        } else { navigate('/login', { replace: true })}

    },[])


    const changeFilter = (string) => {
        console.log(string)
        setFilter(string)
    }

    const checkFilter = (user) => {
        const theName = user.username
        return theName.includes(filter)

    }

    const handleSearch = () => {
        setFilteredList(users.filter(user => checkFilter(user)))
        setFilter('')
        var search_field = document.getElementById('searchbar')
        search_field.value =''
    }
  return (
    <div className='users_page'>

        <div className='topbar_users'> 
        <div className='searchbar_container top_container'>
        <FontAwesomeIcon className ='searchbar_icon'icon= {faMagnifyingGlass}/>
        <input id="searchbar"className='searchbar' type="text" placeholder='Search for other users . . .'  onChange={(e) => changeFilter(e.target.value)}></input>
        <button onClick={() => handleSearch()}> Search</button></div>
        <div className='sort_container top_container' >
            <span> {filteredList.length} results
            </span>
            <div className='sort_by_container'>
            <label htmlFor='sort_menu' > <span>Sort by:</span></label>
            <select id="sort_menu">
                <option value="name">name</option>
                <option value="Rating">rating</option>
            </select>
            </div>
        </div>
        </div>
        <div className='results_wrapper'>


            <div className='results_container'>
            {users && filteredList.length > 0 ? filteredList.map(user => <div className='card_wrapper'> 
            <Card onClick={(e) => navigate(`/app/users/${user.id}`)} key={user.id} className='user_card'>
                <CardContent className='user_content'>
                    <div className='pic_container'>
                <AdvancedImage className='user_pic' cldImg={myCld.image(user.url)}/>
                </div>
                 <div className='user_info'>

                    <p>{user.username}</p>
                    <p>{user.date_joined}</p>
                    <StarRatingComponent
              name="user_rating" 
              className="user_rating"
              editing={false}
              starCount={5}
              value={user.rating}/>
              <div className='interest_container'> 
                     {Object.keys(user).length !== 0 &&  user.interests.map(interest => <div key={interest} className="user_interest"> {interest.substring(0, interest.length - 9)}
                 </div> )}
                    </div> 
                    </div>
                </CardContent>
            </Card>
            </div>) : <h1>No users found!</h1>}
    

        </div>
        </div>


       
    </div>
  )
}

export default Users