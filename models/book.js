const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateOfPublication: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorPictureUrl: {
    type: String
  },
  pictureUrl: {
    type: String,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;