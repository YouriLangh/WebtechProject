import React, { useState, useEffect } from 'react'
import'./Profile.css';
import Sidenav from '../Sidenav/Sidenav'
import axios from 'axios';

function Profile() {
    useEffect(() => {
        try{ 
        axios({
            method: "GET",
            url: "http://localhost:4000/app/profile",
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            console.log(res.data.message);})
        } catch (error) { console.log(error)}

    });

    return (
    <div className='profile_page'>
        <Sidenav/> 
       <div>Home</div>
       <button >Logout</button>
    </div>
    )
}

export default Profile