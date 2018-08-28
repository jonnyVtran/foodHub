const express = require('express'),
      router  = express.Router(),
      Restaurant = require('../models/restaurant'),
      Comment    = require('../models/comment')

router.get("/restaurants/:id/comments/new", isLoggedIn, (req,res)=>{
  Restaurant.findById(req.params.id, (err, restaurant)=>{
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {restaurant})
    }
  })
})

router.post('/restaurants/:id/comments', isLoggedIn, (req,res)=>{
  Restaurant.findById(req.params.id, (err, restaurant)=>{
    if(err){
      console.log(err);
      res.redirect('/restaurants');
    } else {
      Comment.create(req.body.comment, (err,comment)=>{
        if(err){
          console.log(err);
        } else {
          restaurant.comments.push(comment);
          restaurants.save();
          res.redirect('/restaurants/' + restaurants._id);
        }
      })
    }
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
