import React, {useEffect, useState} from "react";
import './Activity.css';
import './MockActivity';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import logo from '../../images/Logo.png'
import background from '../../images/backgrounde.jpg'
import { CardContent, Card } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faInfo, faMultiply } from '@fortawesome/free-solid-svg-icons'
import Weather from "../Weather/Weather";
import jwt from "jsonwebtoken";



function Activity() {

    const navigate = useNavigate()

    const [showActivity,setShowActivity] = useState(true)
    const [showInfo,setShowInfo] = useState(false)
    const [current, setCurrent] = useState(0);
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([])
    const [swipedActivities, setSwipedActivities] = useState([]);
    const [interests, setInterests] = useState([]);
    const [filterType, setFilterType] = useState("Interests");
    const [notYetFetched, setNotYetFetched] = useState(true);
    const [notYetFetchedInterests, setNotYetFetchedInterests] = useState(true);
    const userToken = localStorage.getItem('token');

    // Fetching initial data from the server

    const convertInterests = (i) => {
        let newTypes = [];
        if (i.includes("culture_interest")){
            newTypes.push("Culture");
        }
        if (i.includes("music_interest")){
            newTypes.push("Music");
        }
        if (i.includes("sports_interest")){
            newTypes.push("Sports");
        }
        if (i.includes("parties_interest")){
            newTypes.push("Parties");
        }
        if (i.includes("concerts_interest")){
            newTypes.push("Concerts");
        }
        if (i.includes("social_interest")){
            newTypes.push("Social");
        }
        if (i.includes("other_interest")){
            newTypes.push("Other");
        }
        return newTypes;
    }


    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (userToken) {
            const user = jwt.decode(userToken)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/login', {replace: true})
            } else if (notYetFetched || notYetFetchedInterests) {
                try {
                    axios({
                        url: 'http://localhost:4000/app/activities/fetch',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            userToken,
                        }),
                    }).then(res => {
                            setActivities(res.data);
                            setFilteredActivities(res.data);
                            setNotYetFetched(false);
                        }
                    );
                } catch (error) {
                    console.log(error);
                }
                try {
                    axios({
                        url: 'http://localhost:4000/app/user/fetch/interests',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            userToken,
                        }),
                    }).then(res => {
                            const interestTypes = convertInterests(res.data);
                            setInterests(interestTypes);
                            console.log("in setting: " + interestTypes)
                            setNotYetFetchedInterests(false);
                        }
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }, [])

    // Helper functions for filtering

    useEffect(() => {
        const filterArray = activities.filter(applyFilter)
        if (filterArray.length === 0) {
            setCurrent(0);
            setShowActivity(false);
        } else {
            setCurrent(0);
            setShowActivity(true);
        }
        setFilteredActivities(filterArray);
    }, [filterType])


    const onSetFilter = (e, value) => {
        e.preventDefault();
        setFilterType(value);
    }

    useEffect(() => {
        setFilter(filterType)
    }, [interests])

    const setFilter = (value) => {
        setFilterType(value);
    }

    const notSwiped = (activity) => {
        if (swipedActivities.length === 0){
            return true
        }
        return !swipedActivities.includes(activity._id);
    }

    const interestsFilter = (activity) => {
        if (interests.length === 0) {
            return false;
        }
        return interests.includes(activity.activityType);
    }

    const applyFilter = (activity) => {
        if (filterType === "None") {
            console.log("none");
            return notSwiped(activity);
        }
        if (filterType === "Interests") {
            return interestsFilter(activity) && notSwiped(activity);
        }
        return activity.activityType === filterType && notSwiped(activity);
    }

    const addActivityToSwiped = (activity) => {
        setSwipedActivities(swipedActivities.concat(activity));
    }


    // Functions to handle input


        const onInfo = (e) => {
            e.preventDefault();
            setShowInfo(!showInfo);
            const element = document.getElementById("activity_info")
            element.classList.toggle("flip")
        }


        const onAccept = (e) => {
            e.preventDefault();
            try {
                axios({
                    url: 'http://localhost:4000/app/activity/join',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        userToken,
                        activityID: filteredActivities[current]._id,
                    }),
                }).then(res => {
                    console.log(res);
                })
            } catch (error) {console.log(error)}
            try {
                axios({
                    url: 'http://localhost:4000/app/activity/increase',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        activityID: filteredActivities[current]._id,
                    }),
                }).then(res => {
                    console.log(res);
                })
            } catch (error) {console.log(error)}
            addActivityToSwiped(filteredActivities[current]._id)
            if (current >= filteredActivities.length-1){
                setShowActivity(false);
            }
            else {
                setCurrent(current+1);
            }
        }

        const onDeny = (e) => {
            e.preventDefault();
            try {
                axios({
                    url: 'http://localhost:4000/app/activity/deny',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        userToken,
                        activityID: filteredActivities[current]._id,
                    }),
                }).then(res => {
                    addActivityToSwiped(filteredActivities[current]._id)
                    console.log(res);
                })
            } catch (error) {console.log(error)}
            if (current >= filteredActivities.length-1){
                setShowActivity(false);
            }
            else {
                setCurrent(current+1);
            }
        }
       


    let activity_content 
    if(showActivity && showInfo){
        const date = new Date(filteredActivities[current].activityDate)
        activity_content =
            <div className="show_info">
                        <div className="activity_text">
                <p>Name: {filteredActivities[current].activityName}</p>
                <p>Date: {date.toDateString()}</p>
                <p>Type: {filteredActivities[current].activityType}</p>
                <p>Location: {filteredActivities[current].activityLocation}</p>
                <p>min. size: {filteredActivities[current].minimumGroupSize.toString()}</p>
                <p>max. size:{filteredActivities[current].maximumGroupSize.toString()}</p>
                </div>
            </div>;
    } else if (showActivity && activities.length > 0){
        const date = new Date(filteredActivities[current].activityDate)
        activity_content = 
        <div className="justify">
        <div className="weather_component"> 
        {/* Event Date moet zoiets zijn  let aDate = new Date("2022-12-19 13:00:00") en dan {aDate} meegeven */}
        {/* eventLat="50.8833" eventLon="4.5" */}
            {/* <Weather eventLat= "" eventLon= "" eventDate=""/> */}
        </div>
        <div className="activity_text">
        <p>{filteredActivities[current].activityName}</p>
        <p>{date.toLocaleDateString()}</p>
        <p>{filteredActivities[current].activityLocation}</p>
        </div>
    </div>;
    } else {
            activity_content =
                    <p className="no_activities">That's it!</p>

    }

    return (
            <div className='activity_page'>
                        <Card className='activity_card'>
                            <CardContent className="activity_content">
                                <div className="filter_container">
                                <div className="">
                                <select name="type" onChange={(e) => onSetFilter(e, e.target.value)}>
                                    <option value="Interests">Interests</option>
                                    <option value="None">None</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Music">Music</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Parties">Parties</option>
                                    <option value="Concerts">Concerts</option>
                                    <option value="Social">Social</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                                </div>
                                <img src={logo} alt='Eventer Logo' className='activity_title logo'/>
                                <div className="flip_outer">
                                <div id="activity_info" className="activity_info">
                                    {activity_content}

                                <img src={background} alt='Eventer Logo' className='activity_background'/>
                                    <div className="gradient"></div>



                                </div>
                                </div>
                                <div className="buttons">
                                    <button disabled={activities.length === 0} className="main_button button deny" onClick= {(e) => onDeny(e)}> <FontAwesomeIcon className='button_icon' icon= {faMultiply}/></button>
                                    <button disabled={activities.length === 0} className="info_button button" onClick= {(e) => onInfo(e)}> <FontAwesomeIcon className='button_icon' icon= {faInfo}/></button>
                                    <button disabled={activities.length === 0} className="main_button button accept" onClick= {(e) => onAccept(e)}>  <FontAwesomeIcon className='button_icon' icon= {faHeart}/></button>
                                </div>
                            </CardContent>
                        </Card>
                        {/* <Link to='/app/events/create'>Go to Creator</Link>
                        <div className="formA">
                            <span className="activity_title">{title}</span>
                           
                        <Link to='/app/events/create'>Go to Creator</Link> */}

                </div>
    )
}



export default Activity

