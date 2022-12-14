import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import'./Sidenav.css';
import logo from '../../images/Logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseChimney,faUser, faBarsStaggered, faCog, faMap, faCalendarAlt, faBars, faTimes, faStar, faCloud, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'


function Sidenav(props) {

  // Collapse the sidebar on page load
  const [foldSidenav,setFoldSidenav] = useState(true)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [windowDimension, detectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight})


  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload()
}


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

  return (
    <div>
    <div className={foldSidenav ? 'sidenav close' : 'sidenav'}>
      <div className='sidenav_header'>
         <Link className='sidenav_brand' to="/app/home">
         <img src={logo} alt='Eventer Logo' className='sidenav_logo'/>
         <span className='sidenav_brand_name'>{foldSidenav ? '': 'Eventer'}</span>
        </Link>
        <div onClick={() => setFoldSidenav(!foldSidenav)} className= 'fold_nav_toggle'>
        <FontAwesomeIcon className ='sidenav_icon' icon= {faBarsStaggered}/>
        </div>
      </div>
      <div className='sidenav_user'>
      <img src= {props.profilePictureURL} alt='profile_picture' className='sidenav_profile_pic'/> 
        <span className='sidenav_user_name'>{foldSidenav ? '' : props.username} </span>
      </div>
      <nav className='sidebar'>
        <ul className='sidenav_ul'>
        <Link className='side_nav_item' to="/app/home"><li className='sidenav_li'><FontAwesomeIcon className ='sidenav_icon'icon= {faHouseChimney}/><span> {foldSidenav ? '': 'Home'} </span></li></Link> 
        <Link className='side_nav_item' to="/app/profile"> <li className='sidenav_li'>  <FontAwesomeIcon className ='sidenav_icon'icon= {faUser}/><span> {foldSidenav ? '': 'Profile'} </span></li> </Link>
        <Link className='side_nav_item' to="/app/events"> <li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faCalendarAlt}/> <span> {foldSidenav ? '': 'Events'} </span></li> </Link>
        <Link className='side_nav_item' to="/app/search"><li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faStar}/><span> {foldSidenav ? '': 'Review'} </span></li> </Link> 
        <Link className='side_nav_item' to="/app/map"><li className='sidenav_li'> <FontAwesomeIcon className ='sidenav_icon'icon= {faMap}/>  <span> {foldSidenav ? '': 'Map'} </span></li></Link>
        <Link className='side_nav_item' to="/app/settings"> <li className='sidenav_li'><FontAwesomeIcon className ='sidenav_icon'icon= {faCog}/>  <span> {foldSidenav ? '': 'Settings'} </span></li></Link>
        <Link className='side_nav_item' to="/app/weather"> <li className='sidenav_li'><FontAwesomeIcon className ='sidenav_icon'icon= {faCloud}/>  <span> {foldSidenav ? '': 'Weather'} </span></li></Link>
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
        <Link className='mobile_nav_item' to="/app/search"><li className='mobile_nav_li'> <FontAwesomeIcon className ='mobile_icon'icon= {faStar}/><span> Review </span></li> </Link> 
        <Link className='mobile_nav_item' to="/app/map"><li className='mobile_nav_li'> <FontAwesomeIcon className ='mobile_icon'icon= {faMap}/>  <span> Map </span></li></Link>
        <Link className='mobile_nav_item' to="/app/settings"> <li className='mobile_nav_li'><FontAwesomeIcon className ='mobile_icon'icon= {faCog}/>  <span> Settings </span></li></Link>
        <li onClick={() => {handleLogout()}} className='mobile_nav_li logout_button'> <FontAwesomeIcon className ='side_nav_item mobile_icon'icon= {faArrowRightFromBracket}/> <span> Logout </span></li>
        </ul>
        </div>
        </div>
    </div>
  )
}

export default Sidenav