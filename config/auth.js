const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorMessage = {
  error: 'You are not authorized to access this resource'
};

const authorize = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json(errorMessage);

    const payload = jwt.decode(token);
    const userId = payload._id;
    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(401).json(errorMessage);

    req.user = user;
    next();
  }
}

module.exports = authorize;