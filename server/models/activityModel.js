const mongoose = require('mongoose')

const Activity = new mongoose.Schema({
        activityName: {type: String, required: true, unique: false},
        date: {type: Date, required: true, unique: false},
        type: {type: String, required: true, unique: false},
        minimumAge: {type: String, required: true, unique: false},
        maximumAge: {type: String, required: true, unique: false},
        location: {type: String, required: true, unique: false},
        minimumGroupSize: {type: String, required: true, unique: false},
        maximumGroupSize: {type: String, required: true, unique: false},
        dateCreated: {type: Date, default:Date.now},

    },
    { collection: 'user-data'}
)

const activityModel = mongoose.model('ActivityData', Activity)

module.exports = activityModel