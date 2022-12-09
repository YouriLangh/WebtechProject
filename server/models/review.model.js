const mongoose = require('mongoose')

const Review = new mongoose.Schema({
    reviewText: String,
    rating: Number
  },
  {collection: 'Review-data'});

const model = mongoose.model('ReviewData', Review)

module.exports = model