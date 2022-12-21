import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import { Card, CardContent} from '@mui/material'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import "./Users.css"
import { useNavigate } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownAZ, faArrowDownZA, faArrowUpAZ, faArrowUpZA, faMagnifyingGlass, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
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
    const[showFilter, setShowFilter] = useState(false)
    const[interestList, setInterestList] = useState([])
    const[copyList,setCopyList] = useState([])
    const[sortOption, setSortOption] = useState({sort: "name_sort", direction: "default"})

    const getUsers = async (CurrentUser) => {
         await axios.get('http://localhost:4000/app/users').then((res) => {
            if(res.status === 200){
                setUsers(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
                setFilteredList(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
                setCopyList(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
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


    useEffect(() => {
        const element = document.getElementById("filter_container")
        element.classList.toggle("hide")
    },[showFilter])

    const changeFilter = (string) => {
        console.log(string)
        setFilter(string)
    }

    const checkFilter = (user) => {
        const theName = user.username
        return theName.includes(filter)

    }

    //Search has to clear all filters
    const handleSearch = () => {
        setFilteredList(users.filter(user => checkFilter(user)))
        setCopyList(users.filter(user => checkFilter(user)))
        setFilter('')
        var search_field = document.getElementById('searchbar')
        search_field.value =''
        interestList.forEach(interest => 
            document.getElementById(interest).classList.toggle("activated"))
        setInterestList([])
    }

    const userWithInterest = (user, filterValue) => {
        const userInterests = user.interests
        if(userInterests.filter(anInterest => anInterest.substring(0, anInterest.length - 9) === filterValue).length > 0){
            return true
        } else return false
    }

    const matchesAllInterests = (user) => {
        var res = true
        interestList.map(interest => res = res && userWithInterest(user, interest))
        return res
    }

    const applyFilters = () => {
        var aCopy = copyList
        var resList = []
        resList = aCopy.filter(user => matchesAllInterests(user))
        if(resList.length > 0) setFilteredList(resList)
        else setFilteredList(copyList);

    }


    const handleFilter = (filterValue) => {
        const element = document.getElementById(filterValue)
        element.classList.toggle("activated")
        if(interestList.indexOf(filterValue) > -1){
            const idx = interestList.indexOf(filterValue)
            interestList.splice(idx, 1)
        } else {
            interestList.push(filterValue)
        }

    }

    const handleSortOption = (currentsort) => {
        if(currentsort === sortOption.sort){
            var element = document.getElementById(currentsort)
        element.classList.toggle("reverse")
        if(sortOption.direction === "default") setSortOption(old => ({...old, direction: "reverse"}));
        else setSortOption(old => ({...old, direction: "default"}));
        } else{
        var oldSortOption = document.getElementById(sortOption.sort)
        oldSortOption.classList.toggle("enabled")
        oldSortOption.classList.remove("reverse")
        //enable the pressed button
        var element = document.getElementById(currentsort)
        element.classList.toggle("enabled")
        setSortOption({sort: currentsort, direction: "default"})
        }

    }

    const sortUsers = (list) => {
        if(sortOption.sort === "name_sort"){
            // name_sort
            return list.sort((a, b) =>  {
               var name1 = a.username
               var name2 = b.username;
               if(sortOption.direction === "default"){
                return name1.localeCompare(name2, 'en', { sensitivity: 'base'})
               } else { 
               return name2.localeCompare(name1, 'en', { sensitivity: 'base'})
            }})
        }
        else{
            return list.sort((a, b)  => {
                var rating1 = a.rating
                var rating2 = b.rating;
                if(sortOption.direction === "default"){
                if (rating1 > rating2) return -1;
                if (rating1 < rating2) return 1;
                return 0;
                } else {if (rating1 < rating2) return -1;
                    if (rating1 > rating2) return 1;
                    return 0; }
             })
        }
    }

  return (
    <div className='users_page'>

        <div className='topbar_users'> 
        <div className='searchbar_container top_container'>
        <FontAwesomeIcon className ='searchbar_icons'icon= {faMagnifyingGlass}/>
        <input id="searchbar"className='searchbar' type="text" placeholder='Search for other users . . .'  onChange={(e) => changeFilter(e.target.value)}></input>
        <button onClick={() => handleSearch()}> Search</button></div>
        <div className='sort_container top_container' >
            <span> {filteredList.length} results
            </span>
            <div className='sort_by_container'>
             <span>Sort by:</span>
             <div className='sort_options'>
                <div onClick={() => handleSortOption("name_sort")} id="name_sort" className='sort_div enabled'>
                <FontAwesomeIcon className='sort_icon default' icon= {faArrowDownAZ}/>
                <FontAwesomeIcon className='sort_icon reverse' icon= {faArrowDownZA}/>
                </div>
                <div onClick={() => handleSortOption("rating_sort")} id="rating_sort" className='sort_div'>
                <FontAwesomeIcon className='sort_icon default' icon= {faStar}/>
                <FontAwesomeIcon className='sort_icon reverse' icon= {faStar}/>
                </div>
                 </div>
            </div>
            </div>
           
        </div>
        <div className='results_wrapper'>
            <div className='filter_wrapper'>
        <span className ='filter_toggle' onClick={() => setShowFilter(!showFilter)} >{showFilter ? "Hide filters" : "Show filters"}</span>
            <div id="filter_container" className='filter_container'>
                <div className='filters'>
                <button id="sports" onClick={() => handleFilter("sports")} className='user_interest'>Sports</button>
                <button id="culture" onClick={() => handleFilter("culture")} className='user_interest'>Culture</button>
                <button id="music" onClick={() => handleFilter("music")} className='user_interest'>Music</button>
                <button id="parties" onClick={() => handleFilter("parties")} className='user_interest'>Parties</button>
                <button id="social" onClick={() => handleFilter("social")} className='user_interest'>Social</button>
                <button id="concerts" onClick={() => handleFilter("concerts")} className='user_interest'>Concerts</button>
                <button id="other" onClick={() => handleFilter("other")} className='user_interest'>Other</button>
                </div>
                <button onClick={() => applyFilters()} className='apply_filter'>Apply</button>
            </div>
            </div>

            <div className='results_container'>
            {users && filteredList.length > 0 ? sortUsers(filteredList).map(user => <div className='card_wrapper'> 
            <Card onClick={(e) => navigate(`/app/users/${user.id}`)} key={user.id} className='user_card'>
                <CardContent className='user_content'>
                    <div className='pic_container'>
                <AdvancedImage className='user_pic' cldImg={myCld.image(user.url)}/>
                </div>
                 <div className='user_info'>

                    <p>{user.username}</p>
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