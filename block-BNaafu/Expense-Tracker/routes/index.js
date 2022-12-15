var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

// success
router.get('/success',(req,res)=>{
  res.render('success')
})
// failure
router.get('/failure',(req,res)=>{
  res.render('failure')
})
// 
router.get('/auth/google',passport.authenticate('google',{
  scope:["profile","email"]
}));

router.get('/auth/google/callback',passport.authenticate('google',
{failureRedirect:'/failure'}),(req,res)=>{
   res.redirect('/success')
})

// 
router.get('/auth/github',passport.authenticate('github'));
router.get('/auth/github/callback',passport.authenticate('github',
{failureRedirect:'/failure'}),(req,res)=>{
  res.redirect('/success')
})


module.exports = router;
