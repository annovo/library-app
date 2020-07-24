const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: {
    type: String,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  description: String,
  rating: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

module.exports = mongoose.model('Book', bookSchema)