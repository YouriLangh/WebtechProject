import axios from "axios";

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