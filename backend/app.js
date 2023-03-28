const express=require('express')
const app=express()
const cookieparser=require('cookie-parser')
const cors=require('cors')
const router=require('./router')
const errorhandler=require('./controllers/errorController')
const path=require('path')

app.use(cookieparser())

app.use(cors({
    credentials:true,
    origin:process.env.CLIENTURL
}))

app.use(express.static(path.join(__dirname,'users')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.use('',router)
app.use(errorhandler)
module.exports=app