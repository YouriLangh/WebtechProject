import React, {useEffect, useState} from "react";
import './Activity.css';
import './MockActivity';
import {Link} from "react-router-dom";
import axios from "axios";



function Activity() {


    const [showActivity,setShowActivity] = useState(true)
    const [showInfo,setShowInfo] = useState(false)
    const [current, setCurrent] = useState(0);
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([])
    const [swipedActivities, setSwipedActivities] = useState([]);
    const [filterType, setFilerType] = useState("");
    const [notYetFetched, setNotYetFetched] = useState(true);
    const userToken = localStorage.getItem('token');

    useEffect(() => {
        if (notYetFetched) {
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
        }
    })

    const notSwiped = (activity) => {
        if (swipedActivities.length === 0){
            return true
        }
        return !swipedActivities.includes(activity._id);
    }

    const applyFilter = (activity) => {
        if (filterType === "None") {
            return notSwiped(activity);
        }
        return activity.activityType === filterType && notSwiped(activity);
    }

    const addActivityToSwiped = (activity) => {
        setSwipedActivities(swipedActivities.concat(activity));
    }


    if (activities.length === 0) {
        return (
            // <!--Registration Form-->
            <div className='aPage'>
                <div className='window_for_activity'>
                    <div className='activity_container'>
                        <Link to='/app/events/create'>Go to Creator</Link>
                        <div className="formA">
                            <div>
                                <p>no more activities</p>
                            </div>
                            <span className="activity_title">{title}</span>
                            <div className="dropdown">
                                <select name="type" onChange={(e) => setFilerType(e.target.value)}>
                                    <option value="None">None</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Music">Music</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Parties">Parties</option>
                                    <option value="Concerts">Concerts</option>
                                    <option value="Social">Social</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input onClick= {(e) => onSetFilter(e)} type="button" value="Set Filter"/>
                            </div>
                        </div>
                        <Link to='/app/events/create'>Go to Creator</Link>

                    </div>
                </div>
                {/* <Sidenav newData={pseudoData}/> */}
            </div>
        )
    }



        let content
        let title

        const onInfo = (e) => {
            e.preventDefault();
            setShowInfo(true);
        }

    const onToggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(false);
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

    if (showActivity && showInfo) {
        const date = new Date(filteredActivities[current].activityDate)
        let activityContent =
            <div>
                <li>{filteredActivities[current].activityName}</li>
                <li>{date.toDateString()}</li>
                <li>{filteredActivities[current].activityType}</li>
                <li>{filteredActivities[current].activityLocation}</li>
                <li>{filteredActivities[current].minimumGroupSize.toString()}</li>
                <li>{filteredActivities[current].maximumGroupSize.toString()}</li>
            </div>;
        title = "Info";
        content =
            <div>
                <div>
                    {activityContent}
                </div>
                <div className="input_fieldA button info">
                    <input onClick= {(e) => onToggleInfo(e)} type="button" value="toggle info"/>
                </div>
                <div className="input_fieldA button accept">
                    <input onClick= {(e) => onAccept(e)} type="button" value="accept"/>
                </div>
                <div className="input_fieldA button deny">
                    <input onClick= {(e) => onDeny(e)} type="button" value="deny"/>
                </div>
            </div>
    }

        else if (showActivity) {
        const date = new Date(filteredActivities[current].activityDate)
            let activityContent =
                <div>
                    <li>{filteredActivities[current].activityName}</li>
                    <li>{date.toDateString()}</li>
                    <li>{filteredActivities[current].activityLocation}</li>
                </div>;
            title = "Find";
            content =
                <div>
                    <div>
                        {activityContent}
                    </div>
                    <div className="input_fieldA button info">
                        <input onClick= {(e) => onInfo(e)} type="button" value="info"/>
                    </div>
                    <div className="input_fieldA button accept">
                        <input onClick= {(e) => onAccept(e)} type="button" value="accept"/>
                    </div>
                    <div className="input_fieldA button deny">
                        <input onClick= {(e) => onDeny(e)} type="button" value="deny"/>
                    </div>
                </div>
        }
        else {
            title = "No more activities";
            content =
                <div>
                    <p>no more activities</p>
                </div>

    }
    let pseudoData = {username: '', url:''}

    const onSetFilter = (e) => {
            e.preventDefault();
            const filterArray = activities.filter(applyFilter);
            if (filterArray.length === 0) {
                setCurrent(0);
                setShowActivity(false);
            } else {
                setCurrent(0);
                setShowActivity(true);
            }
            setFilteredActivities(filterArray);
        }

    return (
            // <!--Registration Form-->
            <div className='aPage'>
                <div className='window_for_activity'>
                    <div className='activity_container'>
                        <Link to='/app/events/create'>Go to Creator</Link>
                        <div className="formA">
                            <span className="activity_title">{title}</span>
                            <div className="dropdown">
                                <select name="type" onChange={(e) => setFilerType(e.target.value)}>
                                    <option value="None">None</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Music">Music</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Parties">Parties</option>
                                    <option value="Concerts">Concerts</option>
                                    <option value="Social">Social</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input onClick= {(e) => onSetFilter(e)} type="button" value="Set Filter"/>
                            </div>
                            {content}
                        </div>
                        <Link to='/app/events/create'>Go to Creator</Link>

                </div>
            </div>
            {/* <Sidenav newData={pseudoData}/> */}
        </div>
    )
}



export default Activity

