import React, { useState } from 'react'
import'./Signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faLock, faUser, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import Header from "../Header/Header"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import jwt_decode from "jwt-decode"
import axios from 'axios'



function Signin() {

  const navigate = useNavigate()
  const [showPass,setShowPass] = useState(false)
  const[username, setUser] = useState('');



  const[password, setPassword] = useState('');

  
  let passIcon, passType

  if(showPass){
    passIcon = faEye
    passType = "text"

  } else {
    passIcon =faEyeSlash
    passType = "password"
  }

  


  const handleCredentialResponse = async (response) => {
    var userObject = jwt_decode(response.credential)
    console.log(userObject)
    const userEmail = userObject.email
    const emailVerified = userObject.email_verified
    if (userEmail.substring(userEmail.length - 10) === "@gmail.com" && emailVerified){

        //name without whitespaces
    const username = userObject.name.replace(/\s+/g, '').substring(0, 19)
    const uniqueId = userObject.sub
    const payload = {username: username, email: userEmail, iq: uniqueId}
     try{ 
         const { data } = await axios.post('http://localhost:4000/app/login/auth/google', payload)
         if(data.user){
            localStorage.setItem('token', data.user)
            navigate('/home')
         }
        
     } catch (error) { console.log(error)}
       
    } else {
        console.log("Use a verified Google account")
    }
    }
    

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
        client_id: "1017318377357-88ogmqp851mrijq93olcll9lcg1kb1i6.apps.googleusercontent.com",
        callback: handleCredentialResponse
    })

    google.accounts.id.renderButton(
        document.getElementById("google_login"),
        { theme: "outline", size: "large", width: "340px"}
    )
    google.accounts.id.renderButton(
        document.getElementById("google_login_medium"),
        { theme: "outline", size: "large", width: "320px"}
    )
    google.accounts.id.renderButton(
        document.getElementById("google_login_small"),
        { theme: "outline", size: "large", width: "280px"}
    )
    google.accounts.id.renderButton(
        document.getElementById("google_login_xs"),
        { theme: "outline", size: "medium", width: "200px"}
    )

  }, [])


  const loginUser = async (e) => {
    e.preventDefault();
    try{ 
    const { data } = await axios({
        url: 'http://localhost:4000/app/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            username,
            password,
        }),
    })

     if(data.user){
        localStorage.setItem('token', data.user)
        navigate('/home')
        
    }else {
        alert('Please check your username and password')
    }
    
} catch (error) { console.log(error)}
   
}

  return (
    

// <!-- Sign in & Log in-->
<div className='page' >
    <Header />
    <div className='page_container'>
    <div className='window_for_login'>
<div className="login_container">
        <div className="form login">
            <span className="login_title">Login</span>

            <form action="#">
                <div className="input_field">
                <input value= {username} 
                 onChange={(e) => setUser(e.target.value)}
                 type="text username" id="username" placeholder="Enter your username" required/>
                <i className="fa-regular fa-user icon"><FontAwesomeIcon icon={faUser} /></i>
            </div>
            <div className="input_field">
                <input type={passType} className="password" 
                 value= {password}
                 onChange={(e) => setPassword(e.target.value)}
                 id="loginPassword" placeholder="Enter your password" required />
                <i className="fa-sharp fa-solid fa-lock icon"><FontAwesomeIcon icon={faLock}  /></i>
                <i className="fa-regular fa-eye-slash showHidePw"><FontAwesomeIcon icon= {passIcon} onClick= {() => setShowPass(!showPass)} /></i>

            </div>

            <div className="checkbox_text">
                <div className="checkbox_content">
                    <input type="checkbox" id= "logCheck"/>
                    <label htmlFor="logCheck" className="text">Remember me</label>
                </div>
                <a href="/" className="text">Forgot password?</a>
            </div>
            <div className="input_field button">
                <input onClick= {(e) => loginUser(e)} type="button" value="Login now"/>
            </div>
            <div className="login_signup">
                <span className="text">Don't have an account? 
                    <a href="/register" className="text signup_link">Signup now</a>
                </span>
            </div>
        </form>
        
        <div className="or_line">
        </div>
        {/* <div className="facebook_login">
             <a href="/" className="facebook_button">
                <i className="fa-brands fa-facebook facebook"><FontAwesomeIcon icon={faFacebook} /></i>
                <span className="facebook_text">Login with Facebook</span>
            </a> 
        </div> */}
        <div id='google_login' className="google_login">
            </div>
            <div id='google_login_medium' className="google_login">
            </div>
            <div id='google_login_small' className="google_login">
            </div>
            <div id='google_login_xs' className="google_login">
            </div>
        </div>
    </div>
</div>
</div>
</div>
  )
}

export default Signin