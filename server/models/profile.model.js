const mongoose = require('mongoose')

const ProfileUser = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
}, 
{ collection: 'profile-user-data'}
)

const model = mongoose.model('ProfileUserData', ProfileUser)

module.exports = model