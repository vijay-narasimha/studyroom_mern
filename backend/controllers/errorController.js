const AppError = require('../utils/apperror');

const sendError = (err, req, res) => {
  return res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
  });
 
};
const handlevalidation = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join('---')}`;

  return new AppError(message, 400);
};

const handleduplicate = (err) => {
  const value = Object.keys(err.keyValue)[0];

  const message = `${value} already exists! use another one!!`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || 'error';
  // console.log(err)
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  if (error.code === 11000) error = handleduplicate(error);
  if (error.name === 'ValidationError') error = handlevalidation(error);
// console.log(error)
  sendError(error, req, res);
};
