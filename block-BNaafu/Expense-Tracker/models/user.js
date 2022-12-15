var mongoose=require('mongoose')
var bcrypt=require('bcrypt');
var Schema=mongoose.Schema;


var userSchema= new Schema({
  name:{type:String, required:true},
  email:{type:String, unique:true},
  password:{type:String,minlength:3,required:true},
  age:{type:Number},
  phone:{type:Number},
  country:{type:String},
  isAdmin:{type:Boolean}
},{timestamps:true});


userSchema.pre("save",function(next){
  console.log(this,'This in the pre')
  // admin
  let allAdmin=["tariqueht6@gmail.com"];
  if(allAdmin.includes(this.email)){
    this.isAdmin=true
  }else{
    this.isAdmin=false
  }
  // hashed
  if(this.password && this.isModified ('password')){
    bcrypt.hash(this.password, 10, (err,hashed)=>{
      if(err) return next(err);
      this.password=hashed;
      return next();
    })
  }else{
    next()
  }
})

// verify password
userSchema.methods.verifyPassword=function(password,cb){
  bcrypt.compare(password, this.password, (err,result)=>{
    console.log(result)
    return cb(err,result)
  })
}








var User=mongoose.model("User", userSchema);
module.exports=User;