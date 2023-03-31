const User = require('../models/User');
const catchasync = require('../utils/catchasync');
const AppError = require('../utils/apperror');
const multer = require('multer');
const sharp = require('sharp');
const Room = require('../models/Room');
const Topic = require('../models/Topic');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchasync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`users/${req.file.filename}`);
  next();
});

exports.getUser = catchasync(async (req, res, next) => {
  
  const user = await User.findOne({ name: req.params.name });
  var rooms=[]
  
  if(user._id.toString()===req.id){
   rooms = await Room.find({ host: user._id });
  }else{
     rooms=await Room.find({host:user._id,private:false})
  }

  let topics = [];
  for (let i = 0; i < rooms.length; i++) {
    const topic = await Topic.findById(rooms[i].topic);
    topics.push(topic.name);
  }
  res.status(200).json({
    user,
    rooms,
    topics,
  });
});

exports.updateUser = catchasync(async (req, res, next) => {
  var obj = {};

  const { name, bio } = req.body;

  if (name) obj['name'] = name;
  if (req.file) obj['photo'] = req.file.filename;
  if (bio) obj['bio'] = bio;

  const user = await User.findByIdAndUpdate(req.id, obj, {
    new: true,
  });
  res.status(200).json({
    status: 'success',
    user,
  });
});
