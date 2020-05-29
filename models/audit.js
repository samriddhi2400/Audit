var mongoose=require('mongoose')

var auditSchema=new mongoose.Schema({
    title:String,
    description:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
       username: String,
   
    },
    comments:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }
]
})

module.exports=mongoose.model("Audit",auditSchema)