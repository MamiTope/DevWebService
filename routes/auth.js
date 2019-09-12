const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const JWT_KEY = "JwtSecretKey";

// create new user
router.post('/signup', async (req, res, next) => {
  const userInfos = req.body;

  try {
    const user = new User();

    // checking username
    const exits = await User.findOne({
      username: userInfos.username
    }).exec();
    if (exits) return res.status(400).json({
      error: 'Username already taken'
    });

    // copy all userInfos property to the new created user object
    for (let property in userInfos) {
      if (userInfos.hasOwnProperty(property)) {
        user[property] = userInfos[property];
      }
    }

    // hash password
    const hash = await bcrypt.hash(userInfos.password, 10);
    user['password'] = hash;

    // saving the new created user
    await user.save();

    // sending back response
    return res.status(201).json({
      message: 'User sucessfully created'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Tyr again later '});
  }
});

// sign in user
router.post('/signin', (req, res, next) => {
  passport.authenticate('signin', { session: false }, (error, user, info) => {
    try {
      if (error || !user) {
        return res.status(400).json({ 
          error: info.message ? info.message : 'Please, try again'
        });
      }
  
      req.login(user, { session: false }, (error) => {
        if (error) {
            res.status(400).json({ error });
        }
        const payload = { 
          _id: user._id,
          role: user.role
        };
        const token = jwt.sign(payload, JWT_KEY);
        return res.status(200).json({
          token: token,
          user: user
        });
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Please, try again later'
      });
    }
  })(req, res, next);
});

module.exports = router;