require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');



const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/users', require('./routes/user'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/shop', require('./routes/shop'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

