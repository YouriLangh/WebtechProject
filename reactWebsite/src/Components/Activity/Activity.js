import React, {useEffect, useState} from "react";
import './Activity.css';
import './MockActivity';
import {Link} from "react-router-dom";
import Sidenav from "../Sidenav/Sidenav";
import { fetchActivities } from "./ActivityService";
import { getActivities } from "./ActivityService";
import axios from "axios";


function Activity() {


    const [showActivity,setShowActivity] = useState(true)
    const [current, setCurrent] = useState(0);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        console.log('fetch');
        if (activities.length === 0) {
            try {
                axios({
                    url: 'http://localhost:4000/app/activities/fetch',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(res => {
                        setActivities(res.data);
                        console.log(activities);
                    }
                );
            } catch (error) {
                console.log(error);
            }
        }
    })

    if (activities.length === 0) {
        return <p>fetching</p>
    }
        console.log('fetched');

        console.log("activities: ", activities);
        let activityContent =
            <div>
                <li>{activities[current].activityName}</li>
                <li>{activities[current].activityType}</li>
                <li>{activities[current].minimumAge.toString()}</li>
                <li>{activities[current].maximumAge.toString()}</li>
                <li>{activities[current].activityLocation}</li>
                <li>{activities[current].minimumGroupSize.toString()}</li>
                <li>{activities[current].maximumGroupSize.toString()}</li>
            </div>;

        let content
        let title

        const onInfo = (e) => {
            e.preventDefault();
            console.log(activities);
            console.log('info');
        }

        const onAccept = (e) => {
            e.preventDefault();
            console.log(current);
            console.log(activities[current].activityName);
            if (current >= activities.length-1){
                setShowActivity(false);
            }
            else setCurrent(current+1);
        }

        const onDeny = (e) => {
            e.preventDefault();
            console.log("deny");
            if (current >= activities.length-1){
                setShowActivity(false);
            }
            else setCurrent(current+1);
        }

        if (showActivity) {
            title = "Find";
            content =
                <div>
                    <div>
                        {activityContent}
                    </div>
                    <div className="input_fieldA button">
                        <input onClick= {(e) => onInfo(e)} type="button" value="info"/>
                    </div>
                    <div className="input_fieldA button">
                        <input onClick= {(e) => onAccept(e)} type="button" value="accept"/>
                    </div>
                    <div className="input_fieldA button">
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

        return (
            // <!--Registration Form-->
            <div className='aPage'>
                <div className='window_for_activity'>
                    <div className='activity_container'>
                        <Link to='/app/events/create'>Go to Creator</Link>
                        <div className="formA">
                            <span className="activity_title">{title}</span>
                            {content}
                        </div>
                        <Link to='/app/events/create'>Go to Creator</Link>

                    </div>
                </div>
                <Sidenav/>
            </div>
        )


}



export default Activity

