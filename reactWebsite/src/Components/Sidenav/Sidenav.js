import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import'./Sidenav.css';
import axios from 'axios';
import logo from '../../images/Logo.png'
import { Cloudinary } from '@cloudinary/url-gen';
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AdvancedImage } from '@cloudinary/react'
import { faHouseChimney,faUser, faBarsStaggered, faCog, faMap, faCalendarAlt, faBars, faTimes, faStar, faCloud, faArrowRightFromBracket, faMagnifyingGlass, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
const jwt = require('jsonwebtoken')

function Sidenav(props) {
  const navigate = useNavigate()
  const myCld = new Cloudinary({
    cloud: {
      cloudName: "dmm5cr74r",
      api_key: '863166137145835', 
      api_secret: 'W7tHs7zxqZdPwxX8PSKqrXzx0aw' 
    }
  });
  // Collapse the sidebar on page load
  const [foldSidenav,setFoldSidenav] = useState(true)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [windowDimension, detectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight})
  const [userInfo, setUserInfo] = useState({username: "", pfp_url:""})
  const [pfp, setPfp] = useState(myCld.image(userInfo.pfp_url))

  const[filter, setFilter] = useState('')
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload()
}
const updatePfp = async (newUrl) => {
  if (newUrl === "") {
    setPfp(myCld.image("pfp/default_pfp"))
  } else {
    setPfp(myCld.image(newUrl));
  }
} 


useEffect(() => {
     const userToken = localStorage.getItem('token');
     if (userToken){
      const user = jwt.decode(userToken)
      if(!user){
        localStorage.removeItem('token')
        navigate('/login', { replace: true })}
        else{
          const username = jwt.decode(userToken).username;
          if(userInfo.username === ""){
      try{

        axios.post('http://localhost:4000/app/profile', {username: username})
        .then(res => {
          if(res.data.profile){
            let newProfile = jwt.decode(res.data.profile);
            let formattedInfo = {username: newProfile.username, pfp_url: newProfile.url}
            setUserInfo(formattedInfo);
            updatePfp(newProfile.url);
          }})
      } catch (error) {console.log(error)}
      pfp.resize(thumbnail().gravity(focusOn(FocusOn.face())))}
        }}
        else navigate('/login', { replace: true });
      
  }, [])

  useEffect(() => {
    if(props && props.newData.username !== ''){
    setUserInfo(props.newData)
    updatePfp(props.newData.url)
    }
  },[props])

const onMobileNavClicked = () => {
  setShowMobileNav(!showMobileNav)
}

const detectSize = () => {
  detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
  })
  if(window.innerWidth > 420){
    setShowMobileNav(false)
  }
}
  useEffect(() => {
      window.addEventListener('resize', detectSize)
      return() => {
          window.removeEventListener('resize', detectSize)
      }
  }, [windowDimension])

  let profilePic = <AdvancedImage 
  cldImg={pfp} 
  className='sidenav_profile_pic'/>

  let userName = <span className='sidenav_user_name'>{foldSidenav ? '' : userInfo.username} </span>

  const handleSearch = async () => {
    if(filter.length > 0){
    await axios.post('http://localhost:4000/app/user/search', {aName: filter}).then((res) => {
      if(res.status === 200){
        const aToken = jwt.decode(res.data.token)
        if(aToken){
          const id = aToken.id
          navigate(`/app/users/${id}`)
          setFilter('')
          setFoldSidenav(true)
        } else {console.log("user not found")}
      }

    })}
  }


  return (
    <div>
    <div className={foldSidenav ? 'sidenav close' : 'sidenav'}>
      <div className='sidenav_header'>
         <Link className='sidenav_brand' to="/app/home">
         <img src={logo} alt='Eventer Logo' className='sidenav_logo'/>
         <span className='sidenav_brand_name'>{foldSidenav ? '': 'Eventer'}</span>
        </Link>
        <div onClick={() => setFoldSidenav(!foldSidenav)} className= 'fold_nav_toggle'>
        <FontAwesomeIcon className ='sidenav_icon' icon= {foldSidenav ? faArrowRight : faArrowLeft}/>
        </div>
      </div>
      <div className='sidenav_user'>
        {profilePic}
      {/* <img src= {userInfo.pfp_url} alt='profile_picture' className='sidenav_profile_pic'/>  */}
      {userName}
        {/* <span className='sidenav_user_name'>{foldSidenav ? '' : userInfo.username} </span> */}
      </div>
      <nav className={foldSidenav ? "sidebar closed" : "sidebar"}>
      {foldSidenav ? '' : <div className='search_bar'> <input id="searchbar"type="text" onChange={(e) => setFilter(e.target.value)}className='sidenav_search' placeholder='Find user...'></input> <FontAwesomeIcon onClick={() => handleSearch()} className ='searchbar_icon' icon= {faMagnifyingGlass}/></div>}
        <ul className='sidenav_ul'>
        <Link onClick={() => setFoldSidenav(true)} className='side_nav_item' to="/app/home"><li className='sidenav_li'><FontAwesomeIcon className ='sidenav_icon'icon= {faHouseChimney}/><span> {foldSidenav ? '': 'Home'} </span></li></Link> 
        <Link onClick={() => setFoldSidenav(true)} className='side_nav_item' to="/app/profile"> <li className='sidenav_li'>  <FontAwesomeIcon className ='sidenav_icon'icon= {faUser}/><span> {foldSidenav ? '': 'Profile'} </span></li> </Link>
        <Link  onClick={() => setFoldSidenav(true)} className='side_nav_item' to="/app/events"> <li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faCalendarAlt}/> <span> {foldSidenav ? '': 'Events'} </span></li> </Link>
        {/* <Link className='side_nav_item' to="/app/review"><li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faStar}/><span> {foldSidenav ? '': 'Review'} </span></li> </Link>  */}
        <Link onClick={() => setFoldSidenav(true)} className='side_nav_item' to="/app/map"><li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faMap}/>  <span> {foldSidenav ? '': 'Map'} </span></li></Link>
        <Link onClick={() => setFoldSidenav(true)} className='side_nav_item' to="/app/settings"><li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faCog}/>  <span> {foldSidenav ? '': 'Settings'} </span></li></Link>
        <Link onClick={() => setFoldSidenav(true)} className='side_nav_item' to="/app/users"> <li className='sidenav_li'><FontAwesomeIcon className ='sidenav_icon'icon= {faMagnifyingGlass}/>  <span> {foldSidenav ? '': 'Search'} </span></li></Link>
        {/* <Link className='side_nav_item' to="/app/weather"> <li className='sidenav_li'><FontAwesomeIcon className ='sidenav_icon'icon= {faCloud}/>  <span> {foldSidenav ? '': 'Weather'} </span></li></Link> */}
        <li onClick={() => {handleLogout()}} className='sidenav_li'> <FontAwesomeIcon className ='side_nav_item sidenav_icon'icon= {faArrowRightFromBracket}/> <span> {foldSidenav ? '': 'Logout'} </span></li>
        </ul>
      </nav>
      
    </div>
    <FontAwesomeIcon className= 'mobile_nav_icon' onClick= {() => onMobileNavClicked()} icon={ showMobileNav ? faTimes : faBars} />
      <div className={showMobileNav ?  'slide_mobile_mask active' : 'slide_mobile_mask'} onClick={() => setShowMobileNav(false)}>   </div>  
      <div className= {showMobileNav ?  'slide_mobile active' : 'slide_mobile'}>
        <div className='mobile_nav_container'>
      <ul>
        <Link className='mobile_nav_item' to="/app/home"><li className='mobile_nav_li'><FontAwesomeIcon className ='mobile_icon'icon= {faHouseChimney}/><span> Home </span></li></Link> 
        <Link className='mobile_nav_item' to="/app/profile"> <li className='mobile_nav_li'>  <FontAwesomeIcon className ='mobile_icon'icon= {faUser}/><span> Profile </span></li> </Link>
        <Link className='mobile_nav_item' to="/app/events"> <li className='mobile_nav_li'> <FontAwesomeIcon className ='mobile_icon'icon= {faCalendarAlt}/> <span> Events </span></li> </Link>
        <Link className='mobile_nav_item' to="/app/review"><li className='mobile_nav_li'> <FontAwesomeIcon className ='mobile_icon'icon= {faStar}/><span> Review </span></li> </Link> 
        <Link className='mobile_nav_item' to="/app/map"><li className='mobile_nav_li'> <FontAwesomeIcon className ='mobile_icon'icon= {faMap}/>  <span> Map </span></li></Link>
        <Link className='mobile_nav_item' to="/app/users"> <li className='mobile_nav_li'><FontAwesomeIcon className ='mobile_icon'icon= {faMagnifyingGlass}/>  <span> Search </span></li></Link>
        <li onClick={() => {handleLogout()}} className='mobile_nav_li logout_button'> <FontAwesomeIcon className ='side_nav_item mobile_icon'icon= {faArrowRightFromBracket}/> <span> Logout </span></li>
        </ul>
        </div>
        </div>
    </div>
  )
}

export default Sidenav