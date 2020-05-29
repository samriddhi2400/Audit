var express=require('express')
var router=express.Router()
var passport=require('passport')
var User=require('../models/user')


router.get('/',function(req,res){
    res.render('home')
})


//AUTH ROUTES
router.get('/register',function(req,res){
    res.render('auth/register')
})

router.post('/register',function(req,res){
  var newUser=new User({username:req.body.username})
  User.register(newUser,req.body.password)
  .then(user =>{
      passport.authenticate('local')(req,res,function(){
        req.flash('success','Welcome to Audit' +user.username)
          res.redirect('/audit')
      
      })
}).catch(err =>{
    console.log(err)
   // req.flash('error',err.message)
   return res.render('auth/register',{'error':err.message})
})
})

router.get('/login',function(req,res){
   res.render('auth/login')
})

router.post('/login',passport.authenticate('local',{
    successFlash:'Successfully logged in',
   successRedirect:'/audit',
   failureFlash:true,
   failureRedirect:'/login'
}),function(req,res){

}
)
  


router.get('/logout',function(req,res){
   req.logout()
   req.flash('error','logged out successfully!!')
    return res.redirect('/')
})

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/login')
// }
module.exports=router