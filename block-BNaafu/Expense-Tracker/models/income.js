var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var incomeSchema= new mongoose.Schema({
  source:{type:String},
  amount:{type:Number},
  date:{type:Date},
  userId:{type:Schema.Types.ObjectId, ref:"User"}
},{timestamps:true});

var Income=mongoose.model("Income",incomeSchema);
module.exports=Income;