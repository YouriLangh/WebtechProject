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
import axios from 'axios';



function Creator() {

    const navigate = useNavigate()

    const[errorMessage, setErrorMessage] = useState('');

    const[activityName, setActivityName] = useState("");
    const[activityDate, setActivityDate] = useState('');
    const[activityType, setActivityType] = useState('');
    const[activityMinAge, setActivityMinAge] = useState('');
    const[activityMaxAge, setActivityMaxAge] = useState('');
    const[activityLocation, setActivityLocation] = useState('');
    const[activityMinGroupSize, setActivityMinGroupSize] = useState('');
    const[activityMaxGroupSize, setActivityMaxGroupSize] = useState('');


    function checkValues() {
        return true;
    }

    const createActivity = async (e) => {
        e.preventDefault()
        if (checkValues) {
            setErrorMessage("Invalid Entry");
            return;
        }
        try {
              const response = await axios({
                  url: 'http://localhost:4000/app/activities/post',
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activityName,
                    activityDate,
                    activityType,
                    activityMinAge,
                    activityMaxAge,
                    activityLocation,
                    activityMinGroupSize,
                    activityMaxGroupSize,
                }),
            })
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = (e) => {
        console.log(activityName)
    }
    return (


// <!-- Sign in & Log in-->
        <div className='creator_page' >
            <Sidenav />
            <div className='window_for_creator'>
                <div className="creator_container">
                    <div className="form creator">
                        <span className="creator_title">Create</span>

                        <form action="#">
                            <div className="input_field">
                                <input value= {activityName}
                                       onChange={(e) => setActivityName(e.target.value)}
                                       type="text" id="activityName" placeholder="Enter activity name" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSoccerBall} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityDate}
                                       onChange={(e) => setActivityDate(e.target.value)}
                                       type="date" id="AD" placeholder="Enter activity date" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faClock} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityType}
                                       onChange={(e) => setActivityType(e.target.value)}
                                       type="text" id="activityType" placeholder="Enter activity type" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faQuestion} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityMinAge}
                                       onChange={(e) => setActivityMinAge(e.target.value)}
                                       type="number" id="activityMinAge" placeholder="Enter min age" min="18" max="30" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericDown} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityMaxAge}
                                       onChange={(e) => setActivityMaxAge(e.target.value)}
                                       type="number" id="activityMaxAge" placeholder="Enter max age" min="18" max="30" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericUp} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityLocation}
                                       onChange={(e) => setActivityLocation(e.target.value)}
                                       type="text" id="activityLocation" placeholder="Enter activity location" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faMapPin} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityMinGroupSize}
                                       onChange={(e) => setActivityMinGroupSize(e.target.value)}
                                       type="number" id="activityMinGroupSize" placeholder="min group size" min="2" max="20" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericDown} /></i>
                            </div>

                            <div className="input_field">
                                <input value= {activityMaxGroupSize}
                                       onChange={(e) => setActivityMaxGroupSize(e.target.value)}
                                       type="number" id="activityMaxGroupSize" placeholder="max group size" min="2" max="20" required/>
                                <i className="fa-regular icon"><FontAwesomeIcon icon={faSortNumericUp} /></i>
                            </div>



                            <div className="input_field button">
                                <input onClick= {(e) => onSubmit(e)} type="button" value="Create Activity"/>
                            </div>
                            <Link to='/app/events'>Go to Events</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Creator