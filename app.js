const express         = require('express'),
      mongoose        = require('mongoose'),
      bodyParser      = require('body-parser'),
      methodOverride  = require('method-override'),
      path            = require('path'),
      passport        = require('passport'),
      LocalStrategy   = require('passport-local'),
      app             = express();

const Restaurant      = require('./models/restaurant'),
      Comments        = require('./models/comment'),
      User            = require('./models/user');

const commentRoutes   = require('./views/routes/comments'),
      restaurantRoutes= require('./views/routes/restaurant'),
      indexRoutes     = require('./views/routes/index');

mongoose.connect('mongodb://localhost:27017/food_log', {useNewUrlParser:true});

//APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(restaurantRoutes);

app.listen(3000 || process.env.PORT, ()=>{
  console.log("Server is running");
})
