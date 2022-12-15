var passport=require('passport');
var User=require('../models/user')
var Strategy=require('passport-github')
var gitHubStrategy=require('passport-github').Strategy;
var googleStategy=require('passport-google-oauth20').Strategy;

// google login
passport.use(new googleStategy({
  clientID:process.env.CLIENT_ID_1,
  clientSecret:process.env.CLIENT_SECRET_1,
  callbackURL:'/auth/google/callback'
},(accessToken,refreshToken,profile,done)=>{
  // console.log(profile)
  var profileData={
    name:profile.displayName,
    username:profile.username,
    email:profile._json.email,
    photo:profile._json.avatar_url,
  }
 User.findOne({email:profile._json.email},(err,user)=>{
   if(err) return done(err)
   if(!user){
     User.create(profileData,(err,addedUser)=>{
       if(err) return done(err)
       return done(null,addedUser)
     })
   }else{
     done(null,user)
   }
 })

}
))

// github login

passport.use( new gitHubStrategy({
  clientID:process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,
  callbackURL:'/auth/github/callback'
},(accessToken, refreshToken, profile,done)=>{
  // console.log(profile)
  var profileData={
    name:profile.displayName,
    userName:profile.username,
    email:profile._json.email,
    photo:profile._json.avatar_url,
  }
  User.findOne({email:profile._json.email},(err,user)=>{
    if(err) return done(err)
    if(!user){
      User.create(profileData,(err,addedUser)=>{
        if(err) return done(err)
        return done(null,addedUser)
      })
    }else{
      done(null,user)
    }
  })
}))

passport.serializeUser((user,done)=>{
  done(null,user.id)
})

passport.deserializeUser(function(id,done){
  User.findById(id, "name email username",function(err,user){
    done(err,user)
  })
})



