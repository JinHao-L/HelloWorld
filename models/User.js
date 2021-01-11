const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create User schema
const UserSchema = new Schema({
  _id: false,
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  lat: {
    type: String,
  },
  lng: {
    type: String,
  },
  sessionActivity: {
    type: Date,
    expires: '15m',
    default: Date.now()
  }
});

UserSchema.pre("save", next => {
  this.sessionActivity = new Date();
  next();
})

// Exports the model using the specified Schema
module.exports = mongoose.model('users', UserSchema);
