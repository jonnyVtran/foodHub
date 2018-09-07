const express = require('express'),
      router  = express.Router(),
      Restaurant = require('../../models/restaurant'),
      middleware = require('../../middleware')

router.get('/', (req,res)=>{
  res.render('index');
})

router.get('/restaurants', (req,res)=>{
  Restaurant.find({}, (err, allRestaurants)=>{
    if(err){
      req.flash("error", "Restaurant not found")
      res.redirect('back');
    } else {
      res.render('restaurants/restaurants', {restaurants:allRestaurants})
    }
  })
})

router.post('/restaurants', middleware.isLoggedIn, (req,res)=>{
  let name=req.body.name;
  let image=req.body.image;
  let desc=req.body.desc;
  let author= {
    id: req.user._id,
    username: req.user.username
  }
  let newRestaurant={name, image, desc, author}
  Restaurant.create(newRestaurant, (err, newRest)=>{
    if(err){
      req.flash('error', "Restaurant create error")
      res.redirect('/restaurants')
    } else {
      req.flash("success", "Restaurant successfully created!");
      res.redirect('/restaurants')
    }
  })
})

// NEW RESTAURANT PAGE
router.get('/restaurants/new', middleware.isLoggedIn, (req,res)=>{
  res.render('restaurants/new');
})

// SHOW PAGE
router.get('/restaurants/:id', (req,res)=>{
  Restaurant.findById(req.params.id).populate('comments').exec((err, foundRestaurant)=>{
    if(err || !foundRestaurant){
      req.flash("error", "Restaurant not found")
      res.redirect('/restaurants');
    } else {
      res.render('restaurants/show', {restaurant: foundRestaurant})
    }
  })
})

// EDIT

router.get('/restaurants/:id/edit', middleware.checkRestaurantOwnership, (req,res)=>{
    Restaurant.findById(req.params.id, (err, foundRestaurant)=>{
      res.render('restaurants/edit', {restaurant:foundRestaurant});
    });
})

// UPDATE

router.put('/restaurants/:id', middleware.checkRestaurantOwnership, (req,res)=>{
  Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, updatedRestaurant)=>{
    if(err){
      res.redirect('/restaurants');
    } else {
      req.flash('success', 'Restaurant successfully updated')
      res.redirect('/restaurants/' + req.params.id);
    }
  })
})

// DESTROY

router.delete("/restaurants/:id", middleware.checkRestaurantOwnership, (req,res)=>{
  Restaurant.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      req.flash('error', 'Restaurant not found')
      res.redirect("/restaurants");
    } else {
      req.flash('error', "Restaurant successfully deleted")
      res.redirect('/restaurants');
    }
  })
})

module.exports = router;
