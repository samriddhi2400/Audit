var express=require('express')
var app=express()
var bodyParser=require('body-parser')
var mongoose=require('mongoose')
var passport=require('passport')
var LocalStrategy=require('passport-local')
var methodOverride=require('method-override')
var flash=require('connect-flash')
var Audit=require('./models/audit')
var Comment=require('./models/comments')
var User=require('./models/user')
var auditRoutes=require('./routes/audit')
var commentRoutes=require('./routes/comments')
var authRoutes=require('./routes/auth')

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(__dirname + '/public/'));
app.use(flash())
mongoose.connect("mongodb://localhost:27017/audit",{useNewUrlParser:true,useUnifiedTopology:true, useCreateIndex:true,useFindAndModify:false})
//passport configuration
app.use(require('express-session')({
    secret:"audit",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
    res.locals.currentUser=req.user
    res.locals.error=req.flash('error')
    res.locals.success=req.flash('success')
    next()
})

// //routes
// app.get('/',function(req,res){
//     res.render('home')
// })

// app.get('/audit',isLoggedIn,function(req,res){
//     Audit.find().sort({createdAt:'desc'})
//     .then(allaudit =>{
//      res.render('audit/info',{audit:allaudit})
//     }).catch(err => console.log(err))
 
// })

// app.get('/audit/new',isLoggedIn,function(req,res){
//     res.render('audit/new')
// })

// app.post('/audit',isLoggedIn,function(req,res){
//     var title=req.body.title
//     var description=req.body.description
//     var author={
//         id:req.user._id,
//         username:req.user.username
//     }
//     var newaudit={title:title,description:description,author:author}
//      Audit.create(newaudit)
//     .then(audit => {
//      res.redirect('/audit')
//     }).catch(err => console.log(err))
    
   
// })


// app.get('/audit/:id',function(req,res){
//     Audit.findById(req.params.id).populate('comments').exec()
//       .then(foundaudit =>{
//         res.render('audit/show',{audit:foundaudit})
//     }).catch(err => console.log(err))
// })

// //comments route
// app.get('/audit/:id/comments/new',isLoggedIn,function(req,res){
//     Audit.findById(req.params.id)
//     .then(audit =>{
//         res.render('comments/new',{audit:audit})
//     }).catch(err =>console.log(err))
    
// })

// app.post('/audit/:id/comments',isLoggedIn,function(req,res){
//   Audit.findById(req.params.id)
//   .then(audit =>{
//       Comment.create(req.body.comment)
//       .then(comment =>{
//           comment.author.id=req.user._id
//           comment.author.username=req.user.username
//           comment.save()
//           audit.comments.push(comment)
//           audit.save()
//           .then(comment => {
//             res.redirect('/audit/'+audit._id)
//           })
         
//       }).catch(err =>{
//           console.log(err)
//           res.redirect('/audit')
//       })
//   })

// })
// //EDIT ROUTES
// app.get('/audit/:id/edit',checkAuditOwnership,function(req,res){
//     Audit.findById(req.params.id)
//         .then(foundaudit =>{
//                 res.render('audit/edit',{audit:foundaudit})
//             })
//     // if(req.isAuthenticated()){
//     //     Audit.findById(req.params.id)
//     //     .then(foundaudit =>{
//     //         if(foundaudit.author.id.equals(req.user._id)){
//     //             res.render('audit/edit',{audit:foundaudit})
//     //         } else{
//     //             res.send("you do not have permission" )
//     //         }
//     //     }).catch(err =>console.log(err))
//     // }else{
//     //     res.send("ýou need to log in" )
//     // }
// })

// //UPDATE ROUTES
// app.put('/audit/:id',checkAuditOwnership,function(req,res){
//     Audit.findByIdAndUpdate(req.params.id,req.body.audit)
//     .then(updatedaudit =>{
//         res.redirect('/audit/'+req.params.id)
//     }).catch(err =>{
//         res.redirect('/audit')
//     })
// })

// //DELETE ROUTES
// app.delete('/audit/:id',checkAuditOwnership,function(req,res){
//     Audit.findByIdAndRemove(req.params.id)
//     .then(() =>
//     req.redirect('/audit')
//     ).catch(err =>
//         res.redirect('/audit')
//         ) 
// })

// //EDIT COMMENT
// app.get('/audit/:id/comments/:comment_id/edit',checkCommentsOwnership,function(req,res){
//     Comment.findById(req.params.comment_id)
//     .then(foundcomment =>{
//         res.render('comments/edit',{auditid:req.params.id,comment:foundcomment})
//     }).catch(err =>{
//         res.redirect('back')
//     })
    
// })

// //UPDATE COMMENT
// app.put('/audit/:id/comments/:comment_id',checkCommentsOwnership,function(req,res){
//     Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment)
//     .then(updatedcomment =>{
//         res.redirect('/audit/'+req.params.id)
//     }).catch(err =>{
//         res.redirect('back')
//     })
// })

// //DELETE COMMENT
// app.delete('/audit/:id/comments/:comment_id',checkCommentsOwnership,function(req,res){
//     Comment.findByIdAndRemove(req.params.comment_id)
//     .then(() =>{
//         res.redirect('/audit/'+req.params.id)
//     }).catch(err =>{
//         res.redirect('/audit/'+req.params.id)
//     })
// })

// //AUTH ROUTES
// app.get('/register',function(req,res){
//     res.render('auth/register')
// })

// app.post('/register',function(req,res){
//   var newUser=new User({username:req.body.username})
//   User.register(newUser,req.body.password)
//   .then(user =>{
//       passport.authenticate('local')(req,res,function(){
//           res.redirect('/audit')
      
//       })
// }).catch(err =>{
//     console.log(err)
//     res.render('auth/register')
// })
// })

// app.get('/login',function(req,res){
//    res.render('auth/login')
// })

// app.post('/login',passport.authenticate('local',{
//    successRedirect:'/audit',
//    failureRedirect:'/login'
// }),function(req,res){

// }
// )
  


// app.get('/logout',function(req,res){
//    req.logout()
//    res.redirect('/')
// })

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/login')
// }

// function checkAuditOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Audit.findById(req.params.id)
//         .then(foundaudit =>{
//             if(foundaudit.author.id.equals(req.user._id)){
//               //  res.render('audit/edit',{audit:foundaudit})
//               next()
//             } else{
//                 res.redirect('back')
//             }
//         }).catch(err =>{
//             res.redirect('back')
//         })
//     }else{
//         res.redirect('back')
//     }
// }

// function checkCommentsOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id)
//         .then(foundcomment =>{
//             if(foundcomment.author.id.equals(req.user._id)){
//               //  res.render('audit/edit',{audit:foundaudit})
//               next()
//             } else{
//                 res.redirect('back')
//             }
//         }).catch(err =>{
//             res.redirect('back')
//         })
//     }else{
//         res.redirect('back')
//     }
// }

app.use('/audit',auditRoutes)
app.use('/audit/:id/comments',commentRoutes)
app.use('/',authRoutes)






// create new info get/post
// create new comment get/post
// create show page
// create authentucatio 
//create delete/edit functionality

app.listen(5000,function(){
    console.log('server started for audit')
})