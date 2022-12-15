import React from 'react'
import Sidenav from '../Sidenav/Sidenav'
import "./Home.css"

function Home() {

  let pseudoData = {username: '', url:''}
  return (
    <div className='home_page'>
         <Sidenav newData={pseudoData}/> 
    </div>
  )
}

export default Home