

class MockActivity {
    constructor(activityName, activityDate, activityType, minimumAge, maximumAge, activityLocation, minimumGroupSize, maximumGroupSize, dateCreated) {
        this.activityName = activityName;
        this.activityDate = activityDate;
        this.activityType = activityType;
        this.minimumAge = minimumAge;
        this.maximumAge = maximumAge;
        this.activityLocation = activityLocation;
        this.minimumGroupSize = minimumGroupSize;
        this.maximumGroupSize = maximumGroupSize;
        const timeElapsed = Date.now();
        this.dateCreated = new Date(timeElapsed);
    }


}

export default MockActivity