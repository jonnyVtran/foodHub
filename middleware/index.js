const Restaurant = require('../models/restaurant'),
      Comment = require('../models/comment')

let middlewareObj = {};

middlewareObj.checkRestaurantOwnership = (req, res, next) => {
  if(req.isAuthenticated()){
    Restaurant.findById(req.params.id, (err, foundRestaurant)=>{
      if(err || !foundRestaurant){
        req.flash('error', 'Restaurant not found')
        res.redirect('/restaurants');
      } else {
        if(foundRestaurant.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that')
          res.redirect('/restaurants');
        }
      }
    })
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
      if(err || !foundComment){
        req.flash('error', 'Comment not found')
        res.redirect('/restaurants');
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You do not have permission to do that')
          res.redirect('/restaurants');
        }
      }
    })
  } else {
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('/login');
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', "You need to be logged in to do that");
  res.redirect('/login');
}

module.exports = middlewareObj;
