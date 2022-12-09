const mongoose = require('mongoose')

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }]
}, 
{ collection: 'user-data'}
)

const model = mongoose.model('UserData', User)

module.exports = model