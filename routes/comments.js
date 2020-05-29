var express=require('express')
var router=express.Router({mergeParams:true})
var Audit=require('../models/audit')
var Comment=require('../models/comments')
var middleware=require('../middleware')

//comment routes
router.get('/new',middleware.isLoggedIn,function(req,res){
    Audit.findById(req.params.id)
    .then(audit =>{
        if(!audit){
            req.flash('error','Not found')
            res.redirect('back')
        }else{
            res.render('comments/new',{audit:audit})
        }
       
    }).catch(err =>{
        console.log(err)
        req.flash('error',err.message)
        return res.redirect('back')
        
     }) 
        
    
})

router.post('/',middleware.isLoggedIn,function(req,res){
  Audit.findById(req.params.id)
  .then(audit =>{
      Comment.create(req.body.comment)
      .then(comment =>{
          comment.author.id=req.user._id
          comment.author.username=req.user.username
          comment.save()
          audit.comments.push(comment)
          audit.save()
          .then(comment => {
            req.flash('success','Comment created successfully!')
            res.redirect('/audit/'+audit._id)
          })
         
      }).catch(err =>{
          console.log(err)
          req.flash('error','err.message')
          res.redirect('/audit')
      })
  })
})

  //EDIT COMMENT
  router.get('/:comment_id/edit',middleware.checkCommentsOwnership,function(req,res){
      Audit.findById(req.params.id)
      .then(foundAudit =>{
          if(!foundAudit){
            req.flash('error','Not found')
            res.redirect('back')
          }else{
            Comment.findById(req.params.comment_id)
            .then(foundcomment =>{
                if(!foundcomment){
                    req.flash('error','Not found')
                    res.redirect('back')
                }else{
                    res.render('comments/edit',{auditid:req.params.id,comment:foundcomment})
                }
               
            }).catch(err =>{
                req.flash('error','Something went wrong')
                res.redirect('back')
            })
          }
      }).catch(err =>{
        req.flash('error','Something went wrong')
        res.redirect('back')
      })
    
    
})

//UPDATE COMMENT
router.put('/:comment_id',middleware.checkCommentsOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment)
    .then(updatedcomment =>{
        req.flash('success','Comment updated successfully!')
        res.redirect('/audit/'+req.params.id)
    }).catch(err =>{
        req.flash('error',err.message)
        res.redirect('back')
    })
})

//DELETE COMMENT
router.delete('/:comment_id',middleware.checkCommentsOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id)
    .then(() =>{
        req.flash('success','Comment deleted successfully!')
        res.redirect('/audit/'+req.params.id)
    }).catch(err =>{
        req.flash('error',err.message)
        res.redirect('/audit/'+req.params.id)
    })
})

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
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/login')
// }

module.exports=router
