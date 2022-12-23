import axios from "axios";

//attempt at creating a service for the activities.
//function is still used in create activities in order to send a created event to the server

const createActivity = async (activity) => {
    console.log('create');
    try {
        const response = await axios({
            url: 'http://localhost:4000/app/activities/publish',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            data: activity
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}


export default createActivity