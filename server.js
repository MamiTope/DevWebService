const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

// import routes
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const MONGODB_URI = 'mongodb+srv://dev-manager:mnhvAg0ER00KsPfN@dev-database-ilbld.mongodb.net/database?retryWrites=true&w=majority';

// configure passport
require('./config/passport');

// initialize app
const app = express();

// configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize cors 
app.use(cors());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('[message] successfully connected to MongoDB');
}).catch(error => {
  console.log('[message] se could not connect to MongoDB : ', error);
});

// define routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', passport.authorize('jwt', { session: false }), booksRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.clear();
  console.log(`[message] server started on port ${PORT}`);
});