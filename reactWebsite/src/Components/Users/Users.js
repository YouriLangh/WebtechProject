import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import { Card, CardContent} from '@mui/material'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import "./Users.css"
import { useNavigate } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownAZ, faArrowDownZA, faMagnifyingGlass, faStar} from '@fortawesome/free-solid-svg-icons'
const jwt = require('jsonwebtoken')



//The users component displays all the users of the website, excluding the current user
// With options to sort and filter this list.
function Users() {

    // Used to navigate to different pages
    const navigate = useNavigate()
    // Used to display the profile pictures of users 
    // Please hide this API key - Youri
    const myCld = new Cloudinary({
        cloud: {
          cloudName: "dmm5cr74r",
          api_key: '863166137145835', 
          api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
        }
      });

      // The users const holds all the users that we fetched
    const[users, setUsers] = useState([])
    // The filter holds the value of the current input given in the top searchbar
    const[filter, setFilter] = useState('')
    // The filtered list holds all the users after they have been filtered with the filter parameters (the interests)
    const[filteredList, setFilteredList] = useState([])
    // Option to hide or show the filters
    const[showFilter, setShowFilter] = useState(false)
    // All the selected interests from the filter section
    const[interestList, setInterestList] = useState([])
    // A copy of the filtered list, in case filters get removed or added. 
    // A  'dirty' trick
    const[copyList,setCopyList] = useState([])
    // The sorting option that is currently chosen, there is "name_sort" and "rating_sort" and direction can be "default" or "reverse"
    const[sortOption, setSortOption] = useState({sort: "name_sort", direction: "default"})

    // Fetch all the users from the database
    const getUsers = async (CurrentUser) => {
         await axios.get('http://localhost:4000/app/users').then((res) => {
            if(res.status === 200){
                // remove the current user from this list
                setUsers(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
                setFilteredList(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
                setCopyList(res.data.formatted.map(element => jwt.decode(element)).filter(user => user.username !== CurrentUser.username))
            }
         })
    }
    // Check if the user is still logged in, if they are, fetch all the users.
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


    // Update the classes when the "showfilter" field gets changed, CSS purpose.
    useEffect(() => {
        const element = document.getElementById("filter_container")
        element.classList.toggle("hide")
    },[showFilter])


    // change the filter when the user types letters in the searchbar
    const changeFilter = (string) => {
        setFilter(string)
    }

    // Remove all the users that do not contain the inputted username in the searchbar
    const checkFilter = (user) => {
        const theName = user.username
        return theName.includes(filter)

    }

    //Search has to clear all interest filters aswell
    const handleSearch = () => {
        // update the filteredlist and copy list to only hold all the users containing the inputted string in the searchbar
        setFilteredList(users.filter(user => checkFilter(user)))
        setCopyList(users.filter(user => checkFilter(user)))
        setFilter('')
        var search_field = document.getElementById('searchbar')
        search_field.value =''
        interestList.forEach(interest => 
            document.getElementById(interest).classList.toggle("activated"))
        setInterestList([])
    }

    // Check if a user contains a certain interest
    // Substring is taken because interests are stored as "music_interest", we thus remove the last part of that string to get the interest itself
    // If they share that interest, return true.
    const userWithInterest = (user, filterValue) => {
        const userInterests = user.interests
        if(userInterests.filter(anInterest => anInterest.substring(0, anInterest.length - 9) === filterValue).length > 0){
            return true
        } else return false
    }

    // Check if a certain user contains all the interests that were activated as filters
    // This is done by checking if the user matches a certain interest and then combining those result with a && operator.
    const matchesAllInterests = (user) => {
        var res = true
        interestList.map(interest => res = res && userWithInterest(user, interest))
        return res
    }

    // Loop over the current list (including the search filter) and filter out anyone who doesn't contain all the selected interests.
    const applyFilters = () => {
        var aCopy = copyList
        var resList = []
        resList = aCopy.filter(user => matchesAllInterests(user))
        setFilteredList(resList)
        

    }


    // When a certain filter gets pressed, their classes get toggled and they get added or removed from the "interestList"
    // This is basically "remove X interest if it gets deactivated" and class-toggling for CSS purposes
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

    // If we select a different sort option, first check if we are selecting the same one and just want to reverse it
    // Else deactivate the previous one by toggling its classes and set the current sortOption to an object containing the correct sort and direction
    const handleSortOption = (currentsort) => {
        // if we selected the same option, this means we want to reverse the order.
        if(currentsort === sortOption.sort){
            var element = document.getElementById(currentsort)
        element.classList.toggle("reverse")
        if(sortOption.direction === "default") setSortOption(old => ({...old, direction: "reverse"}));
        else setSortOption(old => ({...old, direction: "default"}));
        } // If not, delete the classes from the old option (for CSS) and set the new sortOption as what we selected and direction: default
        else{
        var oldSortOption = document.getElementById(sortOption.sort)
        oldSortOption.classList.toggle("enabled")
        oldSortOption.classList.remove("reverse")
        //enable the pressed button
        var element = document.getElementById(currentsort)
        element.classList.toggle("enabled")
        setSortOption({sort: currentsort, direction: "default"})
        }

    }

    // the sorting algorithm to sort users either on username (case insenstive)
    const sortUsers = (list) => {
        if(sortOption.sort === "name_sort"){
            // name_sort
            // Take two elements from the list, take their username fields and compare them
            return list.sort((a, b) =>  {
               var name1 = a.username
               var name2 = b.username;
               if(sortOption.direction === "default"){
                // if the direction is default we want to go in ascending order
                return name1.localeCompare(name2, 'en', { sensitivity: 'base'})
               } else { 
                // else in descending order
               return name2.localeCompare(name1, 'en', { sensitivity: 'base'})
            }})
        }
        else{
            // rating sort
            // Take two elements from the list, take their rating fields and compare them
            return list.sort((a, b)  => {
                var rating1 = a.rating
                var rating2 = b.rating;
                // In descending order if the direction is default
                if(sortOption.direction === "default"){
                if (rating1 > rating2) return -1;
                if (rating1 < rating2) return 1;
                return 0;
                } 
                // Else is ascending order
                else {if (rating1 < rating2) return -1;
                    if (rating1 > rating2) return 1;
                    return 0; }
             })
        }
    }

  return (
    <div className='users_page'>
        {/* A top bar containing the seach bar and sorting options/amount of results */}
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
        {/* The results wrapper contains the filter div and the list of all the users */}
        <div className='results_wrapper'>
            <div className='filter_wrapper'>
        <span className ='filter_toggle' onClick={() => setShowFilter(!showFilter)} >{showFilter ? "Hide filters" : "Show filters"}</span>
            <div id="filter_container" className='filter_container'>
                <div className='filters'>
                    {/* All the possible filters that can be selected */}
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
            {/* The list of all found users matching the filter requirements */}
            <div className='results_container'>
            {/* If we have fetched the users and there are users that match these requirements, sort them (with correct sortOption) and for each of them make a div .. (CSS) */}
            {users && filteredList.length > 0 ? sortUsers(filteredList).map(user => <div key={user.id} className='card_wrapper'> 
            <Card onClick={(e) => navigate(`/app/users/${user.id}`)} className='user_card'>
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
              {/* For each of the users, display their interests if they have any */}
                     {Object.keys(user).length !== 0 &&  user.interests.map(interest => <div key={interest} className="user_interest"> {interest.substring(0, interest.length - 9)}
                 </div> )}
                    </div> 
                    </div>
                </CardContent>
            </Card>
            {/* If No users match these requirements, just return a header tag  */}
            </div>) : <h1>No users found!</h1>}
    

        </div>
        </div>


       
    </div>
  )
}

export default Users