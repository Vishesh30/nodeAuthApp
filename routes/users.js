const express = require("express");
const router  = express.Router();
const userModel  = require("../models/User");
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const passport = require("passport");

//Login Page
router.get('/login',(req,res) => res.render('login'))


//Register Page
router.get('/register',(req,res) => res.render('register'))

//RsgisterHandle
router.post('/register',(req,res) => {
    const { name,email,password,password2} = req.body;

    let errors = [];

    //check required field
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    //check password match
    if(password != password2){
        errors.push({msg: 'Password do not match'})
    }

    //check password length
    if(password.lenght < 6){
        errors.push({msg: 'Password should be atleast 6 characters'})
    }

    if(errors.length > 0 ){
        res.render('register',{
            errors,
            name,email,password,password2
        })
    }else{
        //Validation passed
        userModel.findOne({email:email})
        .then(user => {
            if(user){
                errors.push({msg: "User Exists"});
                res.render('register',{
                    errors,
                    name,email,password,password2
                })
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //hash password
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password,salt, (err,hash) => {
                        if(err) throw err;

                        newUser.password = hash;

                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are now registered and can login')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                    })
                })
            }
        })
    }
})

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;