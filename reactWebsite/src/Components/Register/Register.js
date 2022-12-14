import React, { useState } from 'react'
import'./Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser, faEyeSlash, faEye, faEnvelope, faArrowRight, faInfoCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Header from "../Header/Header"
import {useRef, useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StyledEngineProvider } from '@mui/material';

  
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  

function Register() {

    const userRef = useRef();

    const navigate = useNavigate()
    const[username, setUser] = useState('');
    const[validName, setValidName] = useState(false)
    const[userFocus, setUserFocus] = useState(false)

    const[email, setEmail] = useState('');
    const[validEmail, setValidEmail] = useState(false)
    const[emailFocus, setEmailFocus] = useState(false);

    const[password, setPassword] = useState('');
    const[validPassword, setValidPassword] = useState(false)
    const[passwordFocus, setPasswordFocus] = useState(false)

    const[matchPassword, setMatchPassword] = useState('');
    const[validMatch, setValidMatch] = useState(false)
    const[matchFocus, setMatchFocus] = useState(false)

    const[errorMessage, setErrorMessage] = useState('');
    const[success, setSuccess] = useState(false);

    const[ToS, setToS] = useState(false)
    const[interests, setInterests] = useState([])
    
    useEffect(()=> {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidName(result);
    }, [username])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPassword(result)
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    useEffect(() => {
        setErrorMessage('')
        
    }, [username, password, matchPassword])



    const handleSubmit = async (e) => {
        e.preventDefault();

      try {
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrorMessage("Invalid Entry");
            return;
        }
         console.log(interests)
         const { data } = await axios({
             url: 'http://localhost:4000/app/register', 
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             data: JSON.stringify({
                 username,
                 email,
                 password,
             }),
         })

         console.log(data)
         if(data.status === 201) {
             navigate('/login')
             setSuccess(true)
         }

    } catch (error) {
        console.log(error)
    }
    }
 const [showPass,setShowPass] = useState(false)
 const [showFirst,setShowFirst] = useState(true)


 const handleInterest = (id) => {
    var element = document.getElementById(id);
    element.classList.toggle("selected")
    if(element.classList.contains("selected")){
        setInterests(prevArray => [...prevArray, id])
    } else {setInterests(interests.filter(eId => eId !== id))}
    console.log(interests)
 }

 const getClasses = (id) => {
    if(interests.includes(id)){
        return "interests selected"
    } else return "interests"
 }

  let passIcon, passType

  let content, title, arrow
  

  if(showPass){
    passIcon = faEye
    passType = "text"

  } else {
    passIcon =faEyeSlash
    passType = "password"
  }


  if(showFirst){
    title = "Register"
    arrow = <div></div>
    content =    
        <div>
        <div className="input_field">
           
            <input type="text" 
            id="username"
            value= {username}
            ref={userRef}
            autoComplete= "off"
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid= {validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
           placeholder="Enter your username"  />
            <i className={username && !validName ? "invalid fa-regular fa-user icon" : "fa-regular fa-user icon"}><FontAwesomeIcon icon={faUser}  /></i>
            
        </div>
        <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                <FontAwesomeIcon className="icon" icon={faInfoCircle} />
                4 to 24 characters. <br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hyphens allowed.
            </p>
    <div className="input_field">
        <input type="text" 
        id ="email"
        value= {email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid= {validEmail ? "false" : "true"}
        aria-describedby = 'emailnote'
        onFocus={() => setEmailFocus(true)}
        onBlur={() => setEmailFocus(false)}
        placeholder="Enter your email" required />
        <i className={email && !validEmail ? "invalid fa-regular fa-envelope icon" : "fa-regular fa-envelope icon"}><FontAwesomeIcon icon={faEnvelope}  /></i>
    </div> 
    <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                <FontAwesomeIcon className="icon" icon={faInfoCircle} />
                Not a valid e-mail.
            </p>
    <div className="input_field">
        <input type= {passType} className="password" 
        id='password'
        value= {password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid= {validPassword ? "false" : "true"}
        aria-describedby="pwdnote"
        onFocus={() => setPasswordFocus(true)}
        onBlur={() => setPasswordFocus(false)}
         placeholder="Create a password" required />
        <i className = {password && !validPassword ? "invalid fa-sharp fa-solid fa-lock icon" : "fa-sharp fa-solid fa-lock icon"}><FontAwesomeIcon icon={faLock}  /></i>
        <i className="fa-regular fa-eye-slash showHidePw"><FontAwesomeIcon icon={passIcon} onClick= {() => setShowPass(!showPass)} /></i>

    </div>
    <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                <FontAwesomeIcon className="icon" icon={faInfoCircle} />
                8 to 24 characters. <br />
                Must include upper- and lowercase letters and a number<br />
            </p>
    <div className="input_field">
        <input type={passType} className="password"
        id='confirm_password'
        value = {matchPassword}
        onChange={(e) => setMatchPassword(e.target.value)}
        aria-invalid= {validMatch ? "false" : "true"}
        aria-describedby="confirmnote"
        onFocus={() => setMatchFocus(true)}
        onBlur={() => setMatchFocus(false)}
         placeholder="Confirm your password" required />
        <i className= {matchPassword && !validMatch ? "invalid fa-sharp fa-solid fa-lock icon" : "fa-sharp fa-solid fa-lock icon"}><FontAwesomeIcon className="icon"icon={faLock}  /></i>

    </div>
    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon className="icon" icon={faInfoCircle} />
                Must match other password.
            </p>
         
    <div className="checkbox_text">
        <div className="checkbox_content">
            <input type="checkbox" onChange={(e) => setToS(!ToS)} checked={ToS} id= "termsCheck" />
            <label htmlFor="logCheck" className="text">Accept terms & conditions</label>
        </div>
    </div>
    <div className={!validName || !validPassword || !validMatch || !ToS ? "input_field button disabled" : "input_field button"}>
        <input type="button"  disabled={!validName || !validPassword || !validMatch || !ToS} onClick= {() => setShowFirst(false)}value="Continue"/>
        <FontAwesomeIcon className='arrow_icon' icon={faArrowRight} />
    </div>
    </div>
  } else {
    title = "Nearly there!"
    content = 
    <div>
    <div className="input_fields">
        <p>Select activities that interest you!</p>
        <div id="interests"className='interest_options'>
        <input id="culture_interest" onClick= {() => handleInterest("culture_interest")} className={getClasses("culture_interest")} value="Culture" type="button" />
        <input id="music_interest" onClick= {() => handleInterest("music_interest")} className={getClasses("music_interest")} value="Music" type="button" />
        <input id="sports_interest" onClick= {() => handleInterest("sports_interest")} className={getClasses("sports_interest")} value="Sports" type="button" />
        <input id="parties_interest" onClick= {() => handleInterest("parties_interest")} className={getClasses("parties_interest")} value="Parties" type="button" />
        <input id="concerts_interest" onClick= {() => handleInterest("concerts_interest")} className={getClasses("concerts_interest")} value="Concerts" type="button" />
        <input id="social_interest" onClick= {() => handleInterest("social_interest")} className={getClasses("social_interest")} value="Social" type="button" />
        <input id="other_interest" onClick= {() => handleInterest("other_interest")} className={getClasses("other_interest")} value="Other" type="button" />
        </div>
    </div>
    <div>
    <div className={!validName || !validPassword || !validMatch || !ToS ? "input_field button disabled" : "input_field button"}>
        <input  type="button" value="Submit"  disabled={!validName || !validPassword || !validMatch || !ToS} onClick= {(e) => handleSubmit(e)} />
        </div>
    </div>
    </div>
    arrow = <div className='backarrow'>  <FontAwesomeIcon onClick={() => setShowFirst(true)} className="backarrow" icon={faArrowLeft} /></div>
  }


  return (
    // <!--Registration Form-->
    <div className='page'>
        <Header />
        <div className='page_container'>
    <div className='windowForRegister'> 
    <div className='register_container'>
        {arrow}
    <div className="form register">
    <span className="login_title">{title}</span>
    <form  >
                {content}
                </form>
                <div className="login_signup">
        <span className="text">Already have an account?
        <a href="/login" className="text login_link">Log in</a>
        </span>
        </div>
    </div>
        </div>
        </div>
        </div>
        </div>
  )
}

export default Register