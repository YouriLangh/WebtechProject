import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import'./Sidenav.css';
import logo from '../../images/Logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseChimney,faUser, faBarsStaggered, faCog, faMap, faCalendarAlt, faMagnifyingGlass, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import hardcodedpfp from '../../images/pandaprofile.png'



function Sidenav() {


  const [foldSidenav,setFoldSidenav] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload()
}

  return (
    <div className={foldSidenav ? 'sidenav close' : 'sidenav'}>
      <div className='sidenav_header'>
         <Link className='sidenav_brand' to="/home">
         <img src={logo} alt='Eventer Logo' className='sidenav_logo'/>
         <span className='sidenav_brand_name'>{foldSidenav ? '': 'Eventer'}</span>
        </Link>
        <div onClick={() => setFoldSidenav(!foldSidenav)} className= 'fold_nav_toggle'>
        <FontAwesomeIcon className ='sidenav_icon' icon= {faBarsStaggered}/>
        </div>
      </div>
      <div className='sidenav_user'>
      <img src={hardcodedpfp} alt='harcoded user' className='sidenav_profile_pic'/> 
        <span className='sidenav_user_name'>{foldSidenav ? '' : 'John Joe'} </span>
      </div>
      <nav className='sidebar'>
        <ul className='sidenav_ul'>
        <li className='sidenav_li'><Link className='side_nav_item'to="/dashboard"><FontAwesomeIcon className ='sidenav_icon'icon= {faHouseChimney}/></Link> <span> {foldSidenav ? '': 'Dashboard'} </span></li>
        <li className='sidenav_li'><Link className='side_nav_item'to="/profile"> <FontAwesomeIcon className ='sidenav_icon'icon= {faUser}/> </Link> <span> {foldSidenav ? '': 'Profile'} </span></li>
        <li className='sidenav_li'><Link className='side_nav_item'to="/dashboard"> <FontAwesomeIcon className ='sidenav_icon'icon= {faCalendarAlt}/> </Link> <span> {foldSidenav ? '': 'Events'} </span></li>
        <li className='sidenav_li'><Link className='side_nav_item'to="/dashboard"> <FontAwesomeIcon className ='sidenav_icon'icon= {faMagnifyingGlass}/> </Link> <span> {foldSidenav ? '': 'Search'} </span></li>
        <li className='sidenav_li'><Link className='side_nav_item'to="/dashboard"> <FontAwesomeIcon className ='sidenav_icon'icon= {faMap}/> </Link> <span> {foldSidenav ? '': 'Map'} </span></li>
        <li className='sidenav_li'><Link className='side_nav_item'to="/dashboard"> <FontAwesomeIcon className ='sidenav_icon'icon= {faCog}/> </Link> <span> {foldSidenav ? '': 'Settings'} </span></li>
        <li onClick={() => handleLogout()} className='sidenav_li'> <FontAwesomeIcon className ='side_nav_item sidenav_icon'icon= {faArrowRightFromBracket}/> <span> {foldSidenav ? '': 'Logout'} </span></li>
        </ul>
      </nav>
      
    </div>
  )
}

export default Sidenav