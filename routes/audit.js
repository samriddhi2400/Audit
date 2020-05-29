var express=require('express')
var router=express.Router()
var anchorme=require('anchorme').default
var Audit=require('../models/audit')
var middleware=require('../middleware')

//routes
router.get('/',middleware.isLoggedIn,function(req,res){
    Audit.find().sort({createdAt:'desc'})
    .then(allaudit =>{
     res.render('audit/info',{audit:allaudit})
    }).catch(err => {
        req.flash('error','Something went wrong!')
        console.log(err)
    })
})

router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render('audit/new')
})

router.post('/',middleware.isLoggedIn,function(req,res){
    var title=req.body.title
    var description=anchorme(req.body.description)
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newaudit={title:title,description:description,author:author}
     Audit.create(newaudit)
    .then(audit => {
    req.flash('success','Audit Successfully created!!')
     res.redirect('/audit')
    }).catch(err => {
        req.flash('error','Something went wrong!')
        console.log(err)
    })
    
      
    
   
})


router.get('/:id',function(req,res){
    Audit.findById(req.params.id).populate('comments').exec()
      .then(foundaudit =>{
          if(!foundaudit){
            req.flash('error','Not found!')
            res.redirect('back')
          }else{
            res.render('audit/show',{audit:foundaudit})
          }
        }).catch(err => {
            console.log(err)
            req.flash('error','Something went wrong!')
            res.redirect('back')
            
        })
          
        
})

//EDIT ROUTES
router.get('/:id/edit',middleware.checkAuditOwnership,function(req,res){
    Audit.findById(req.params.id)
        .then(foundaudit =>{
            if(!foundaudit){
                req.flash('error','Not found!')
                res.redirect('back')
            }else{
                res.render('audit/edit',{audit:foundaudit})
            }
               }).catch(err =>{
                console.log(err)
                req.flash('error','Something went wrong!')
                res.redirect('back')
               })
    // if(req.isAuthenticated()){
    //     Audit.findById(req.params.id)
    //     .then(foundaudit =>{
    //         if(foundaudit.author.id.equals(req.user._id)){
    //             res.render('audit/edit',{audit:foundaudit})
    //         } else{
    //             res.send("you do not have permission" )
    //         }
    //     }).catch(err =>console.log(err))
    // }else{
    //     res.send("ýou need to log in" )
    // }
})

//UPDATE ROUTES
router.put('/:id',middleware.checkAuditOwnership,function(req,res){
    Audit.findByIdAndUpdate(req.params.id,req.body.audit)
    .then(updatedaudit =>{
        req.flash('success','Audit Successfully updated!!')
        res.redirect('/audit/'+req.params.id)
    }).catch(err =>{
        req.flash('error',err.message)
        res.redirect('/audit')
    })
})

//DELETE ROUTES
router.delete('/:id',middleware.checkAuditOwnership,function(req,res){
    Audit.findByIdAndRemove(req.params.id)
    .then(() =>{
        req.flash('success','Audit Successfully deleted!!')
        res.redirect('/audit')
    }).catch(err =>{
        req.flash('error',err.message)
        res.redirect('/audit')
    }) 
})
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
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/login')
// }

module.exports=router
