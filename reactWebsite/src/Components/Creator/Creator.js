import React, { useState, useEffect } from 'react'
import'./Creator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSoccerBall,
    faClock,
    faQuestion,
    faSortNumericDown, faSortNumericUp, faMapPin
} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import createActivity from "../Activity/ActivityService";
import {preventDefault} from "leaflet/src/dom/DomEvent";

const jwt = require('jsonwebtoken')


//Component for creating activities

function Creator() {

    //constants

    const navigate = useNavigate()

    const[errorMessage, setErrorMessage] = useState('');
    const [activityMade,setActivityMade] = useState(false)

    const[activityName, setActivityName] = useState('');
    const[activityDate, setActivityDate] = useState('');
    const[activityType, setActivityType] = useState('Culture');
    const[minimumAge, setMinimumAge] = useState('');
    const[maximumAge, setMaximumAge] = useState('');
    const[country, setCountry] = useState('');
    const[city, setCity] = useState('');
    const[street, setStreet] = useState('');
    const[houseNumber, setHouseNumber] = useState('');
    const[minimumGroupSize, setMinimumGroupSize] = useState('');
    const[maximumGroupSize, setMaximumGroupSize] = useState('');
    const[dateCreated, setDateCreated] = useState(0);


    function checkValues() {
        return true;
    }

    //make sure the user is still logged in

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (userToken){
         const user = jwt.decode(userToken)
         if(!user){
           localStorage.removeItem('token')
           navigate('/login', { replace: true })}
           }
      }, []);

    //function for submitting a newly created activity when the submit button is pressed

    const onSubmit = (e) => {
        e.preventDefault()
        setDateCreated(Date.now);
        const location = country + ", " + city + ", " + street + " " + houseNumber;
        const userToken = localStorage.getItem('token');
        if (!checkValues) {
            setErrorMessage("Invalid Entry");
            return;
        }
        createActivity({
            activityName,
            activityDate,
            activityType,
            activityLocation: location,
            minimumGroupSize,
            maximumGroupSize,
            dateCreated,
            userToken,
        }).then(r => console.log(JSON.stringify(r))).catch(e => console.log(JSON.stringify(e)));
        setActivityMade(true);
    }

    const onReSubmit = (e) => {
        preventDefault(e);
        setActivityMade(false);
    }

    // set the screen to the html for after the creation of an activity

    if (activityMade) {
        return (
            <div className='aPage' >
                <div className='window_for_creator'>
                    <div className="creator_container">
                        <div className="formC login">
                            <span className="creator_title">Created</span>
                            <p>Activity was made</p>
                            <Link to='/app/home'>Go to Home</Link>
                                <Link to='/app/events'>Go to Events</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    let pseudoData = {username: '', url:''}

    //html for showing the creator

    return (


// <!-- Sign in & Log in-->
        <div className='aPage' >
            <div className='window_for_creator'>
                <div className="creator_container">
                    <div className="formC login">
                        <span className="creator_title">Create</span>

                        <form action="#">
                            <div className="input_fieldC">
                                <input value= {activityName}
                                       onChange={(e) => setActivityName(e.target.value)}
                                       type="text" id="activityName" placeholder="Enter activity name" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSoccerBall} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {activityDate}
                                       onChange={(e) => setActivityDate(e.target.value)}
                                       type="date" id="AD" placeholder="Enter activity date" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faClock} /></i>
                            </div>

                            <div className="dropdown">
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faQuestion} /></i>
                                <select name="type" onChange={(e) => setActivityType(e.target.value)} required>
                                    <option value="Culture">Culture</option>
                                    <option value="Music">Music</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Parties">Parties</option>
                                    <option value="Concerts">Concerts</option>
                                    <option value="Social">Social</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="input_fieldC">
                                <input value= {country}
                                       onChange={(e) => setCountry(e.target.value)}
                                       type="text" id="country" placeholder="Enter country" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faMapPin} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {city}
                                       onChange={(e) => setCity(e.target.value)}
                                       type="text" id="city" placeholder="Enter city" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faMapPin} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {street}
                                       onChange={(e) => setStreet(e.target.value)}
                                       type="text" id="street" placeholder="Enter street" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faMapPin} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {houseNumber}
                                       onChange={(e) => setHouseNumber(e.target.value)}
                                       type="text" id="houseNumber" placeholder="Enter address number" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faMapPin} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {minimumGroupSize}
                                       onChange={(e) => setMinimumGroupSize(e.target.value)}
                                       type="number" id="activityMinGroupSize" placeholder="min group size" min="2" max="20" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericDown} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {maximumGroupSize}
                                       onChange={(e) => setMaximumGroupSize(e.target.value)}
                                       type="number" id="activityMaxGroupSize" placeholder="max group size" min="2" max="20" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericUp} /></i>
                            </div>



                            <div className="input_fieldC button">
                                <input onClick= {(e) => onSubmit(e)} type="button" value="Create Activity"/>
                            </div>
                            <Link to='/app/events'>Go to Events</Link>
                        </form>
                    </div>
                </div>
            </div>
            {/* <Sidenav newData= {pseudoData}/> */}
        </div>
    )
}

export default Creator