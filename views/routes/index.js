const express = require('express'),
      router  = express.Router(),
      passport= require('passport'),
      User    = require("../../models/user");

router.get('/register', (req,res)=>{
  res.render('register');
})

router.post('/register', (req,res)=>{
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
      req.flash('error', err.message);
      return res.redirect('register');
    } else {
      passport.authenticate('local')(req,res, ()=>{
        req.flash('success', "Welcome to the Food Hub " + user.username);
        res.redirect('/restaurants');
      })
    }
  })
})

// LOGIN FORM

router.get('/login', (req,res)=>{
  res.render('login');
})

router.post('/login', passport.authenticate('local',
  {
      successRedirect: "/restaurants",
      failureRedirect: "/login"
  }), (req,res)=>{
})

router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success', "Successfully Logged Out!");
  res.redirect('/restaurants')
})

module.exports = router;
