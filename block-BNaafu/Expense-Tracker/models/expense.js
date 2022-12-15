var mongoose=require('mongoose');
// const { schema } = require('./user');
var Schema=mongoose.Schema;

var expenseSchema= new Schema({
  category:{type:String},
  amount:{type:Number},
  date:{type:Date},
  userId:[{type:Schema.Types.ObjectId, ref:"User"}]
},{timestamps:true});

var Expense=mongoose.model("Expense",expenseSchema)
module.exports=Expense;