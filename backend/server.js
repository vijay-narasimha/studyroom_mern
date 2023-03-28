const dotenv = require('dotenv');
const mongoose = require('mongoose');

const ws=require('ws')
const Message=require('./models/Messages')

dotenv.config();
const app = require('./app');
const db = process.env.MONGODB;
const port = process.env.PORT || 5000;




mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
const server=app.listen(port,()=>{console.log('listening')})

const wss=new ws.WebSocketServer({server})
wss.on('connection',connection=>{
  
  connection.on('message',async data=>{
    const data1=JSON.parse(data)
   const msg= await Message.create({
      user:data1.user,
      message:data1.message,
      room:data1.room
    })
    connection.send(JSON.stringify(msg))
    
  })

})


