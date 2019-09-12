const express = require('express');
const router = express.Router();
const authorize = require('../config/auth');
const Book = require('../models/book');
const { ROLE_USER } = require('../utils/enums');

// public route
router.post('/', authorize(ROLE_USER), async (req, res, next) => {
  const bookInfos = req.body;

  try {
    const book = new Book();

    // copy all userInfos property to the new created user object
    for (let property in bookInfos) {
      if (bookInfos.hasOwnProperty(property)) {
        book[property] = bookInfos[property];
      }
    }

    // saving created book
    await book.save();

    // sending back response
    return res.status(201).json({
      message: 'Book successfully created'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Tyr again later '});
  }
});

// getting all books (secure route)
router.get('/', authorize(ROLE_USER), async (req, res, next) => {
  try {
    const result = await Book.find({}).exec();
    return res.status(200).json({
      docs: result
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Tyr again later '});
  }
});

module.exports = router;