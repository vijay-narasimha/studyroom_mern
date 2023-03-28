const mongoose=require('mongoose')

const schema=mongoose.Schema({
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    slug:String,

    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Topic'
    },
    name:{
        type:String,

    },
    description:{
        type:String,
    },
    participants:{
        type:Array,
    }

},{timestamps:true})

schema.pre('save',function(next){
    this.slug=this.name.toLowerCase().split(' ').join('-')
    next()
})

module.exports=mongoose.model('Room',schema)