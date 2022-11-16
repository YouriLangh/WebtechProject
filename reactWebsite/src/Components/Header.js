
import React from 'react'
import'./Header.css';

function Header() {


  return (
    <div className='page'>
    <nav className=" extend navbar navbar-expand-sm bg-dark navbar-dark">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <a className="nav-link" href="/">Home</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/register">Register</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/login">Login</a>
      </li>
    </ul>
  </nav>
  </div>
  )
}

export default Header