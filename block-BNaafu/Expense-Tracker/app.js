var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var flash=require('connect-flash');
var MongoStore=require('connect-mongo');
var session=require('express-session');
var passport=require('passport');
var gitHubStrategy=require('passport-github').Strategy;


require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter=require('./routes/dashboard');
var auth=require('./middleware/auth');

// connect mongo
mongoose.connect("mongodb://localhost:27017/Expense-Tracker",(err)=>{
  console.log( err ? err: "connected true")
});
// 
require('./module/passport');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// add session
app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  store:MongoStore.create({mongoUrl:"mongodb://localhost:27017/Expense-Tracker"})
}))
// 
app.use(flash());
app.use(auth.userInfo);

// 
app.use(passport.initialize());
app.use(passport.session());

// 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard',dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
