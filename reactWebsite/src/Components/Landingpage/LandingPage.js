
import React from 'react'
import Header from '../Header/Header';
import './LandingPage.css';
import { Link } from 'react-router-dom';

//Landing page component which represents the landing page and implements the header navigation component
function LandingPage() {
  return (

    <div className='landing_page'>
      <Header />
        <section className='landing_page_content'>
          <p className='head'>Experience the world, one event at a time </p>
          <p className='body'> Just like on popular dating apps, you can swipe left or right on events to indicate interest in attending.
            We have a wide range of events available, from concerts and festivals to parties and small social gatherings,
            so you're sure to find something that interests you. Give it a try and start swiping today!
          </p>
   <Link to="/register"> <button className='join_button'> <span>Join now! </span></button></Link>
   </section>

    </div>
  )
}

export default LandingPage