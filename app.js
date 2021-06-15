const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var dbInterface = require("./db/dbInterface");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");


const app = express();

//passport config
require('./config/passport')(passport)

//Connect to DB
dbInterface.connectMonogDB();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//BodyParser
app.use(express.urlencoded({extended: false}))

//Expression session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));