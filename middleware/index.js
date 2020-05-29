var Audit=require('../models/audit')
var Comment=require('../models/comments')
var middlewareObj={}


middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','please login first')
    res.redirect('/login')
}

middlewareObj.checkAuditOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Audit.findById(req.params.id)
        .then(foundaudit =>{
            if(!foundaudit){
                req.flash('error','Not found!')
                res.redirect('back')
            }else{
                if(foundaudit.author.id.equals(req.user._id)){
                    //  res.render('audit/edit',{audit:foundaudit})
                    next()
                  } else{
                      res.redirect('back')
                  }
                }
              }).catch(err =>{
                  req.flash('error','Something went wrong')
                  return res.redirect('back')
              })
            
            
    }else{
        req.flash('error','please login first')
        res.redirect('back')
    }
}

middlewareObj.checkCommentsOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id)
        .then(foundcomment =>{
            if(!foundcomment){
                req.flash('error','Not found!')
                res.redirect('back')
            }else{
                if(foundcomment.author.id.equals(req.user._id)){
                    //  res.render('audit/edit',{audit:foundaudit})
                    next()
                  } else{
                      res.redirect('back')
                  }
            }
          
        }).catch(err =>{
            req.flash('error','Something went wrong')
            return res.redirect('back')
        })
    }else{
        req.flash('error','please login first')
        res.redirect('back')
    }
}

module.exports=middlewareObj