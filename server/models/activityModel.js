const mongoose = require('mongoose')

const Activity = new mongoose.Schema({
            activityName: {type: String, required: true, unique: false},
            activityDate: {type: Date, required: true, unique: false},
            activityType: {type: String, required: true, unique: false},
            minimumAge: {type: String, required: false, unique: false},
            maximumAge: {type: String, required: false, unique: false},
            activityLocation: {type: String, required: true, unique: false},
            minimumGroupSize: {type: String, required: true, unique: false},
            maximumGroupSize: {type: String, required: true, unique: false},
            dateCreated: {type: Date, default:Date.now},
            creator: {type: String, required: true, unique: false},
            participators: {type: Number, required: true, unique: false, default: 0}
    },
    { collection: 'event-data'}
)

const activityModel = mongoose.model('ActivityData', Activity)

module.exports = activityModel