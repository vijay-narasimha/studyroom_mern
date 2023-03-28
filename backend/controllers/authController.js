const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchasync = require('../utils/catchasync');
const AppError = require('../utils/apperror');

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: '1d',
  });
};

const createtoken = (user, statuscode, req, res) => {
  
  const token = signtoken(user._id);

  const cookieoptions = {
    samesite: 'none',
    secure:true,
    expires: new Date(Date.now() + 24*60*60* 1000),
  };
  user.password=undefined
  res.cookie('jwt', token, cookieoptions);
  res.status(statuscode).json({
    status: 'success',
    token,
    user
  });
};

exports.signup = catchasync(async (req, res, next) => {
  const {email}=req.body 
  if(email && (await User.findOne({email}))) {
return next(new AppError('User already exists',400))
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm,
  });

  createtoken(newUser, 201, req, res);
});

exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return next(new AppError('please provide user name',400));
  }
  if (!password) {
    return next(new AppError('please provide password',400));
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.checkpassword(password, user.password))) {
    return next(new AppError('incorrect email or password',401));
  }
  createtoken(user, 200, req, res);
});





exports.verifytoken=catchasync(async (req,res,next)=>{
  const token=req.cookies?.jwt
  // const token=req.headers['authorization'].split(' ')[1]
  
  
  
  if(token){
  const decoded=jwt.verify(token,process.env.JWTSECRET)
  
  req.id=decoded.id 
  
  return next()
  }
  next(new AppError('no token',400))
})