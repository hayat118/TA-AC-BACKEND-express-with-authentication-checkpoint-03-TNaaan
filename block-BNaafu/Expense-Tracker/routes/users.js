var express = require('express');
const User = require('../models/user');
var flash=require('connect-flash')
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// log out
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect-sid');
  res.redirect('/')
})


// register
router.get('/register',(req,res,next)=>{
  res.render('registerform')
})
// cerate user
router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,createUser)=>{
    if(err) return next(err)
    res.redirect('/users')
  })
})
// find user
router.get('/',(req,res,next)=>{
  User.find({},(err,users)=>{
    if(err) return next(err)
    // console.log(users)
    res.render('userList',{users:users})
  })
})



// log in
router.get('/login',(req,res,next)=>{
  var error=req.flash('error')[0]
  res.render('login',{error})
})

router.post('/login',(req,res,next)=>{
  var {email,password}=req.body;
  if(!email || !password){
    req.flash('error',"email/password is required")
    return res.redirect('/users/login')
  }

  User.findOne({email},(err,user)=>{
    if(err) return next(err)
    // no user
    if(!user){
    return res.redirect('/users/login')
    }
    // compare
    user.verifyPassword(password,(err,result)=>{
      if(err) return next(err)
      if(!result){
        req.flash('error',"incorrect password")
        return res.redirect('/users/login')
      }
    // persist logged in user
    req.session.userId=user.id;
    if(user.isAdmin===true){
      return res.redirect('/')
    }
    if(user.isAdmin===false){
      return res.redirect('/')

    }

    })

  })
})





module.exports = router;
