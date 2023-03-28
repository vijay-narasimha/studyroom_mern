const mongoose=require('mongoose')

const bcrypt=require('bcrypt')

const schema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'please provide user name']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'please provide your email']
    },
    password:{
        type:String,
        required:['true','please provide a password'],
        minlength:8
    },
    passwordconfirm:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            validator:function(val){
                return val===this.password
            },
            message:'password are not same'
        }
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    bio:{
        type:String,
        
    }
})

schema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password=await bcrypt.hash(this.password,10)
    this.passwordconfirm=undefined;
    next()
})

schema.methods.checkpassword=async function(password,userpassword){
    return await bcrypt.compare(password,userpassword)
}

const User=mongoose.model('User',schema)
module.exports=User