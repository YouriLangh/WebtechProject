import React, { useState } from 'react'
import'./Creator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSoccerBall,
    faClock,
    faQuestion,
    faSortNumericDown, faSortNumericUp, faMapPin
} from '@fortawesome/free-solid-svg-icons'
import Sidenav from "../Sidenav/Sidenav";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import createActivity from "../Activity/ActivityService";
import jwt from "jsonwebtoken";




function Creator() {

    const navigate = useNavigate()

    const[errorMessage, setErrorMessage] = useState('');

    const[activityName, setActivityName] = useState("");
    const[activityDate, setActivityDate] = useState('');
    const[activityType, setActivityType] = useState('');
    const[minimumAge, setMinimumAge] = useState('');
    const[maximumAge, setMaximumAge] = useState('');
    const[activityLocation, setActivityLocation] = useState('');
    const[minimumGroupSize, setMinimumGroupSize] = useState('');
    const[maximumGroupSize, setMaximumGroupSize] = useState('');
    const[dateCreated, setDateCreated] = useState(0);


    function checkValues() {
        return true;
    }



    const onSubmit = (e) => {
        e.preventDefault()
        setDateCreated(Date.now);
        console.log(activityName);
        const userToken = localStorage.getItem('token');
        const creator = jwt.decode(userToken).username;
        if (!checkValues) {
            setErrorMessage("Invalid Entry");
            return;
        }
        createActivity({
            activityName,
            activityDate,
            activityType,
            minimumAge,
            maximumAge,
            activityLocation,
            minimumGroupSize,
            maximumGroupSize,
            dateCreated,
            creator,
        }).then(r => console.log(JSON.stringify(r))).catch(e => console.log(JSON.stringify(e)));
    }

    let pseudoData = {username: '', url:''}
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

                            <div className="input_fieldC">
                                <input value= {activityType}
                                       onChange={(e) => setActivityType(e.target.value)}
                                       type="text" id="activityType" placeholder="Enter activity type" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faQuestion} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {minimumAge}
                                       onChange={(e) => setMinimumAge(e.target.value)}
                                       type="number" id="activityMinAge" placeholder="Enter min age" min="18" max="30" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericDown} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {maximumAge}
                                       onChange={(e) => setMaximumAge(e.target.value)}
                                       type="number" id="activityMaxAge" placeholder="Enter max age" min="18" max="30" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericUp} /></i>
                            </div>

                            <div className="input_fieldC">
                                <input value= {activityLocation}
                                       onChange={(e) => setActivityLocation(e.target.value)}
                                       type="text" id="activityLocation" placeholder="Enter activity location" required/>
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
            <Sidenav newData= {pseudoData}/>
        </div>
    )
}

export default Creator