const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const JWT_KEY = "JwtSecretKey";

passport.use('signin', 
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      const user = await User.findOne({
        username: username
      }).exec();
      if (!user) {
        return done(null, false, {
          message: 'Username not found'
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }

      return done(null, user, {
        'message': 'Successfully logged in'
      });
    } catch (error) {
      console.log(error)
      done(error);
    }
  })
);

passport.use(
  new JwtStrategy({
    secretOrKey: JWT_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, (payload, done) => {
    User.findById(payload._id).then(user => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }).catch(error => {
      return done(error, false);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(error, user);
  });
});