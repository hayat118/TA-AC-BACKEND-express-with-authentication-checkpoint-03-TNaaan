var User=require('../models/user');
var Income=require('../models/income')
var Expense=require('../models/expense');

var getTotal=require('../routes/dashboard');

module.exports={
  loggedInUser:(req,res,next)=>{
    if(req.session && req.session.userId){
      next()
    }else{
      res.redirect('/users/login')
    }
  },

  userInfo:(req,res,next)=>{
    var userId=req.session && req.session.userId;
    if(userId){
      User.findById(userId, 'name email',(err,user)=>{
        if(err) return (err);
        req.user=user;
        req.user.locals=user;
        next();
      })
    }else{
      req.user=null;
      // req.user.locals=null;
      next()
    }
  },

  isAdmin:(req,res,next)=>{
    var isAdmin=req.user.isAdmin;
    // console.log(isAdmin)
    if(isAdmin===true){
      next()
    }else{
      res.redirect('/dashboard')
    }
  },

  isUser:(req,res,next)=>{
    var isAdmin=req.user.isAdmin;
    if(isAdmin===false){
      next()
    }else{
      res.redirect('/dashboard')
    }
  },

  allFilter:(req,res,next)=>{
    Income.find({userId:req.user.id},(err,income)=>{
      var totalIncome=income.reduce((acc,cv)=>{
        acc=acc+cv.amount;
        return acc;
      },0)
      
    Expense.find({userId:req.user.id},(err,expense)=>{
      var totalExpense=expense.reduce((acc,cv)=>{
        acc=acc+cv.amount;
        return acc;
      },0)
     
      var balance=totalIncome-totalExpense;
      res.locals.balance=balance;
    })
      next()
    })
  }



}