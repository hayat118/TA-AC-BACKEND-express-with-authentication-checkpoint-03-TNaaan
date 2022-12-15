var express=require('express');
var router=express.Router();

var Income=require('../models/income');
var Expense=require('../models/expense');
var User=require('../models/user');
var auth=require('../middleware/auth');

// var getTotal=require('../routes/dashboard');



router.get('/', (req,res,next) => {
  Income.find({userId:req.user.id},(err,income)=>{
    var totalIncome=getTotal(income)

  Expense.find({userId:req.user.id},(err,expense)=>{
    var totalExpense=getTotal(expense)
   
    res.render('dashboard',{income,expense,totalIncome,totalExpense})

  })

  })
})
// 
router.post('/income',(req,res,next)=>{
  req.body.userId=req.user.id;

  Income.create(req.body,(err,income)=>{
    res.redirect('/dashboard')
  })

 

})
// 
router.post('/expense',(req,res,next)=>{
   req.body.userId=req.user.id;

   Expense.create(req.body,(err,expense)=>{
    res.redirect('/dashboard')
  }) 
})

// 
router.get('/date',(req,res,next)=>{
  let start=req.query.start;
  let end=req.query.end;
  let source=req.query.source;
  let category=req.query.category;
  let month=req.query.month;

  if(start && end){
    Income.find({'date':{ $gte:start, $lte:end}, userId:req.user.id},(err,income)=>{
      var totalIncome=getTotal(income)

    Expense.find({'date': {$gte:start, $lte:end}, userId:req.user.id},(err,expense)=>{
      var totalExpense=getTotal(expense)

    res.render('dashboard',{income,expense,totalIncome,totalExpense})
    })
    })
  }else if(source){
     Income.find({source, userId:req.user.id},(err,income)=>{
       var totalIncome=getTotal(income);
       res.render('dashboard', {income:income, expense:[], totalExpense:0, totalIncome})
     })
  }else if(category){
    Expense.find({category, userId:req.user.id},(err,expense)=>{
      //  console.log(expense, 'expense')
      var totalExpense=getTotal(expense);
      res.render('dashboard',{income:[], expense:expense,totalIncome:0,totalExpense})
    })
  }else if(month){
    let year=req.query.month.split('-')[0]
    let month=req.query.month.split('-')[1];
    let date=year + '/' + month + '/' + '01';

    let firstDay= new Date(year, month - 1, 1)

    let lastday= new Date(
        year,
        month - 1,
        30
    )
     console.log(firstDay.toString(),lastday.toString(), date, "date");
    Income.find({date : {$gte:firstDay, $lte:lastday},userId:req.user.id},(err,income)=>{
      var totalIncome=getTotal(income);

    Expense.find({date:{$gte:firstDay, $lte:lastday}, userId:req.user.id},(err,expense)=>{
      var totalExpense=getTotal(expense)

      res.render('dashboard', {income:income, expense:expense, totalIncome, totalExpense});
    })  
    })

  }
})






function getTotal(arr = []){
  return arr.reduce((acc,cv)=>{
    acc=acc+cv.amount;
    return acc;
  },0)
}

module.exports = router;

