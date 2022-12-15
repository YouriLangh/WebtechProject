const mongoose = require('mongoose')

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    url: {type: String, required: true, default: 'pfp/default_pfp'},
    comments: [{type: String}]
}, 
{ collection: 'user-data'}
)

const model = mongoose.model('UserData', User)

module.exports = model