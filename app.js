const express         = require('express'),
      mongoose        = require('mongoose'),
      bodyParser      = require('body-parser'),
      methodOverride  = require('method-override'),
      path            = require('path'),
      passport        = require('passport'),
      LocalStrategy   = require('passport-local'),
      flash           = require('connect-flash'),
      app             = express();

const Restaurant      = require('./models/restaurant'),
      Comments        = require('./models/comment'),
      User            = require('./models/user');

const commentRoutes   = require('./views/routes/comments'),
      restaurantRoutes= require('./views/routes/restaurants'),
      indexRoutes     = require('./views/routes/index');

mongoose.connect('mongodb://localhost:27017/food_log', {useNewUrlParser:true});

//APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION

app.use(require('express-session')({
  secret: "I like dogs",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ADDS CURRENT USER TO EVERY ROUTE
app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash('success');
  next();
});

//MODELS INFO

app.use(indexRoutes);
app.use(commentRoutes);
app.use(restaurantRoutes);

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Server is running");
})
