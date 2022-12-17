const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    body: {type: String},
    rating: {type: Number, default: 5},
});

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    url: {type: String, required: true, default: 'pfp/default_pfp'},
    interests: [{type: String}],
    comments: [CommentSchema],
    rating: {type: Number},
    activities: [{type: String}]
},
{ collection: 'user-data'}
)

const model = mongoose.model('UserData', User)

module.exports = model