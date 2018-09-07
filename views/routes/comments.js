const express = require('express'),
      router  = express.Router(),
      Restaurant = require('../../models/restaurant'),
      Comment    = require('../../models/comment'),
      middleware = require('../../middleware')

router.get("/restaurants/:id/comments/new", middleware.isLoggedIn, (req,res)=>{
  Restaurant.findById(req.params.id, (err, restaurant)=>{
    if(err){
      req.flash("error", "Restaurant not found");
      res.redirect('back');
    } else {
      res.render('comments/new', {restaurant})
    }
  })
})

router.post('/restaurants/:id/comments', middleware.isLoggedIn, (req,res)=>{
  Restaurant.findById(req.params.id, (err, restaurant)=>{
    if(err){
      req.flash('error', 'Restaurant not found')
      res.redirect('/restaurants');
    } else {
      Comment.create(req.body.comment, (err,comment)=>{
        if(err){
          req.flash('error', 'Error creating new comment')
          res.redirect('back');
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          restaurant.comments.push(comment);
          restaurant.save();
          req.flash('success', 'Comment successfully added!')
          res.redirect('/restaurants/' + restaurant._id);
        }
      })
    }
  })
})

//COMMENT EDIT

router.get('/restaurants/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req,res)=>{
  Restaurant.findById(req.params.id, (err, foundRestaurant)=>{
    if(err){
      req.flash('error', 'Restaurant not found');
       return res.redirect('back');
    } else {
      Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err || !foundComment){
          req.flash('error', "Comment not found")
          res.redirect('/restaurants');
        } else {
          res.render('comments/edit', {restaurant_id: req.params.id, comment: foundComment});
        }
      })
    }
  })
})

//COMMENT UPDATE

router.put('/restaurants/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
    if(err){
      req.flash("error", "Comment not found");
      res.redirect("back");
    } else {
      req.flash("success", "Comment successfully updated!");
      res.redirect('/restaurants/'+req.params.id);
    }
  })
})

//COMMENT DESTROY

router.delete('/restaurants/:id/comments/:comment_id', middleware.checkCommentOwnership, (req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      req.flash("error", "Comment not found")
      res.redirect("back");
    } else {
      req.flash("success", "Comment successfully deleted");
      res.redirect('/restaurants/'+req.params.id);
    }
  })
})

module.exports = router;
