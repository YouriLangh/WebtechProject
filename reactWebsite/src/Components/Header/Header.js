import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import'./Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes} from '@fortawesome/free-solid-svg-icons'
import logo from '../../images/Logo.png'

//Header component which is used as a navigation menu on any page before the user is logged in.
function Header() {

  const [showMenu,setShowMenu] = useState(false)

  const onMenuClick = event => {
    setShowMenu(!showMenu)
  }

  const [windowDimension, detectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight})

  // to detect changes in the window size, add event listeners. This is done to automatically close the mobile menu.
  const detectSize = () => {
      detectHW({
          winWidth: window.innerWidth,
          winHeight: window.innerHeight
      })
      if(window.innerWidth > 640){
        setShowMenu(false)
      }
  }
      useEffect(() => {
          window.addEventListener('resize', detectSize)
          return() => {
              window.removeEventListener('resize', detectSize)
          }
      }, [windowDimension])


  return (

    // A navigation bar gets made with a brand/logo and a login/register  button.
    <div className='navbar'>
    <Link className='brand' to="/">
    <img src={logo} alt='Eventer Logo' className='logo'/>
    <span className='brand_name'>Eventer</span>
    </Link>
      <nav>
        <ul>
          <li><Link className='nav_item'to="/login"> Login</Link></li>
          <li><Link className='nav_item' to="/register"> Register</Link></li>
        </ul>
      </nav>
      {/* If the window size gets small enough, we transition to a hamburger menu with a navigation menu that slides out */}
      <FontAwesomeIcon className={showMenu ? "menu_icon active" : 'menu_icon'} onClick= {() => onMenuClick(!showMenu)} icon={ showMenu ? faTimes : faBars} />
      <div className={showMenu ?  'slide_window_mask active' : 'slide_window_mask'} onClick={() => setShowMenu(false)}>   </div>  
      <div className= {showMenu ?  'slide_window active' : 'slide_window'}>
        <div className='slide_nav_container'>
      <ul>
          <li><Link onClick={() => {setShowMenu(false)}} className='slide_nav_item'to="/login">Login</Link></li>
          <li><Link  onClick={() => {setShowMenu(false)}} className='slide_nav_item' to="/register"> Register</Link></li>
        </ul>
        </div>
      </div>
    </div>

  )
}

export default Header