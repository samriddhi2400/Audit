var mongoose=require('mongoose')



//Schema setup
var commentsSchema=new mongoose.Schema({
	text:String,
	author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
    
    
})

module.exports=mongoose.model("Comment",commentsSchema)