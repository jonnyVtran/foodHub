const express = require('express'),
      router  = express.Router(),
      Restaurant = require('../models/restaurant')

router.get('/', (req,res)=>{
  res.render('index');
})

router.get('/restaurants', (req,res)=>{
  Restaurant.find({}, (err, allRestaurants)=>{
    if(err){
      console.log("ERROR OCCURRED");
    } else {
      res.render('restaurants/restaurants', {restaurants:allRestaurants})
    }
  })
})

router.post('/restaurants', (req,res)=>{
  let name=req.body.name;
  let image=req.body.image;
  let desc=req.body.description;
  let newRestaurant={name:name, image:image, desc:desc}
  Restaurant.create(newRestaurant, (err, newRest)=>{
    if(err){
      console.log(err);
    } else {
      res.redirect('/restaurants/restaurants')
    }
  })
})

// NEW RESTAURANT PAGE
router.get('/restaurants/new', (req,res)=>{
  res.render('restaurants/new');
})

// SHOW PAGE
router.get('/restaurants/:id', (req,res)=>{
  Restaurant.findById(req.params.id).populate('comments').exec((err, foundRestaurant)=>{
    if(err){
      console.log(err)
    } else {
      res.render('restaurants/show', {restaurant: foundRestaurant})
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
