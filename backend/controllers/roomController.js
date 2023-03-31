const catchasync = require('../utils/catchasync');
const AppError = require('../utils/apperror');
const Topic = require('../models/Topic');
const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Messages');

exports.createRoom = catchasync(async (req, res, next) => {
  const { name, topic, description,private } = req.body;
  let topicId = await Topic.findOne({ name: topic });
  if (!topicId) {
    topicId = await Topic.create({ name: topic });
  }
  const user=await User.findById(req.id)
  const room = await Room.create({
    host: req.id,
    topic: topicId._id,
    name: name,
    description: description,
    private:private
  });
  room.participants.push(req.id);
  room.topicname=topic 
  room.hostname=user.name
  await room.save();
  res.status(201).json({
    status: 'success',
    room,
  });
});

exports.deleteRoom = catchasync(async (req, res, next) => {
  const id = req.params.id;

  await Room.findByIdAndDelete(id);

  const messages = await Message.find({ room: id });

  for (let i = 0; i < messages.length; i++) {
    await Message.findByIdAndDelete(messages[i]._id);
  }
  res.status(200).json({
    status: 'success',
  });
});

exports.updateRoom = catchasync(async (req, res, next) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const room = await Room.findByIdAndUpdate(
    id,
    {
      name,
      description,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: 'success',
    room,
  });
});

exports.topicData = catchasync(async (req, res, next) => {
  const topics = await Topic.find();
  var dict = {};
  for (let i = 0; i < topics.length; i++) {
    const rooms = await Room.find({ topic: topics[i]._id });

    if (rooms.length == 0) {
      await Topic.findByIdAndDelete(topics[i]._id);
    } else {
      dict[topics[i].name] = rooms.length;
    }
  }

  var items = Object.keys(dict).map((key) => {
    return [key, dict[key]];
  });
  items.sort((first, second) => {
    return second[1] - first[1];
  });
  res.status(200).json({
    status: 'success',
    items,
  });
});

exports.getRooms = catchasync(async (req, res, next) => {
  const topic = req.query.topic;
  const q=req.query.search
const keys=['name','hostname','topicname']
  
  const search = (data) =>{
    return data.filter((item) =>
    keys.some((key) => item[key].toLowerCase().includes(q.toLowerCase()))
  )}
  if (topic) {
    const topics = await Topic.findOne({ name: topic });
    var rooms = await Room.find({ topic: topics._id }).sort('-updatedAt');
  } else {
    var rooms = await Room.find({private:false}).sort('-updatedAt');
  }
if(req.id){
  var rooms1=await Room.find({host:req.id,private:true})
  rooms.push(...rooms1)
}
if(q){
  rooms=search(rooms)

}
  let topics = [],
    users = [];
  for (let i = 0; i < rooms.length; i++) {
    let topic = await Topic.findById(rooms[i].topic);
    let user = await User.findById(rooms[i].host);
    topics.push(topic.name);
    users.push({ name: user.name, photo: user.photo });
  }

  res.status(200).json({
    rooms,
    topics,
    users,
  });
});

exports.getRoom = catchasync(async (req, res, next) => {
  const room = await Room.findOne({ slug: req.params.slug });


  if (!room) return next(new AppError("Room doesn't exist", 200));
  
if(room.host.toString()!==req.id && room.private===true) return next(new AppError('UnAuthorized Room',400))

  const user = await User.findById(room.host);
  const topic = await Topic.findById(room.topic);
  const messages = await Message.find({ room: room._id });

  let topicname = topic.name;
  res.status(200).json({
    room,
    user,
    topicname,
    messages,
  });
});

exports.participants = catchasync(async (req, res, next) => {
  const room = await Room.findOne({ slug: req.params.id });

  room.participants.push(req.id);
  await room.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.roomparticipants = catchasync(async (req, res, next) => {
  const room = await Room.findOne({ slug: req.params.id });
  const array1 = room.participants;
  let users = [];
  for (let i = 0; i < array1.length; i++) {
    const user = await User.findById(array1[i]);

    users.push(user);
  }

  res.status(200).json({
    status: 'success',
    users,
  });
});

exports.getPrivateRoom=catchasync(async (req,res,next)=>{
  const code=req.params.code;

   const room=await Room.findOne({code})
   const array1 = room.participants;
   let users = [];
   for (let i = 0; i < array1.length; i++) {
     const user = await User.findById(array1[i]);
 
     users.push(user);
   }
   const user=await User.findById(room.host)
  const messages = await Message.find({ room: room._id });


  res.json({
    status:'success',room,users,user,messages
  })
})