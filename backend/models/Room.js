const mongoose=require('mongoose')

const schema=mongoose.Schema({
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    hostname:String,
    topicname:String,
    slug:String,

    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Topic',
        require:true,
    },
    name:{
        type:String,
        unique:true

    },
    description:{
        type:String,
    },
    participants:{
        type:Array,
    },
    private:{
        type:Boolean,
        default:false
    },
    code:{
        type:String,
        unique:true
    }

},{timestamps:true})

schema.pre('save',async function(next){
    this.slug=this.name.toLowerCase().split(' ').join('-')
    if(this.private===true){
    const code=Math.floor(1000+Math.random()*9000) 
    const existingdoc=await this.constructor.findOne({code})
    if(existingdoc){
        return this.generateCode()
    }
    this.code=code
}

    next()
})
schema.methods.generateCode = async function () {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const existingDoc = await this.constructor.findOne({ code });
    if (existingDoc) {
      return this.generateCode();
    }
    this.code = code;
  };
module.exports=mongoose.model('Room',schema)