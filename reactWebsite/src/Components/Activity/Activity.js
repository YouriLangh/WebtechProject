import React, {useState} from "react";
import './Activity.css';
import './MockActivity';
import MockActivity from "./MockActivity";
import {Link} from "react-router-dom";
import Sidenav from "../Sidenav/Sidenav";



function Activity() {



    const firstA = new MockActivity("bowling activity one", new Date("2022-12-17"), "bowling", 18, 25, "Brussels", 4, 8, Date.now());
    const secondA = new MockActivity("bowling activity two", new Date("2023-02-17"), "bowling", 20, 30, "Gent", 2, 6, Date.now());
    const thirdA = new MockActivity("concert activity one", new Date("2022-12-10"), "concert", 18, 20, "Hasselt", 2, 20, Date.now());
    const fourthA = new MockActivity("sport activity one", new Date("2023-12-01"), "hockey", 25, 28, "Leuven", 10, 20, Date.now());
    const fifthA = new MockActivity("theatre activity one", new Date("2023-03-14"), "theatre", 22, 27, "Antwerpen", 2, 20, Date.now());
    const mockActivities = [firstA, secondA, thirdA, fourthA, fifthA]
    const [current, setCurrent] = useState(0);
    let activityContent =
        <div>
            <li>{mockActivities[current].activityName}</li>
            <li>{mockActivities[current].activityDate.toDateString()}</li>
            <li>{mockActivities[current].activityType}</li>
            <li>{mockActivities[current].minimumAge.toString()}</li>
            <li>{mockActivities[current].maximumAge.toString()}</li>
            <li>{mockActivities[current].activityLocation}</li>
            <li>{mockActivities[current].minimumGroupSize.toString()}</li>
            <li>{mockActivities[current].maximumGroupSize.toString()}</li>
            <li>{mockActivities[current].dateCreated.toDateString()}</li>
        </div>;

    let content
    let title

    const [showActivity,setShowActivity] = useState(true)

    const onInfo = (e) => {
        e.preventDefault();
        console.log(firstA.activityName, firstA.activityDate.toDateString(), firstA.activityType, firstA.minimumAge, firstA.maximumAge, firstA.activityLocation, firstA.minimumGroupSize, firstA.maximumGroupSize, firstA.dateCreated.toDateString());
    }

    const onAccept = (e) => {
        e.preventDefault();
        console.log(current);
        console.log(mockActivities[current].activityName);
        if (current >= mockActivities.length-1){
            setShowActivity(false);
        }
        else setCurrent(current+1);
    }

    const onDeny = (e) => {
        e.preventDefault();
        console.log("deny");
        if (current >= mockActivities.length-1){
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
    let pseudoData = {username: '', url:''}

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

                </div>
            </div>
            {/* <Sidenav newData={pseudoData}/> */}
        </div>
    )
}



export default Activity

