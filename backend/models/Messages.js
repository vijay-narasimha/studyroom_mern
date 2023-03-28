const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    user: {
      type: String,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Messages', schema);
