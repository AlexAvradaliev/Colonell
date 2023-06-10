const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  firstName: {
    type: String
  },

  lastName: {
    type: String
  },

  avatar: {
    type: String
  },

  email: {
    type: String
  },

  password: {
    type: String
  },

  passwordChangedAt: {
    type: Date
  },

  passwordResetToken: {
    type: String
  },

  passwordResetExpires: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  updatedAt: {
    type: Date
  },

  verified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String
  },

  otp_expiry_time: {
    type: Date
  }
});

userSchema.index(
  { email: 1 },
  {
    collation: {
      locale: 'en',
      strength: 1
    }
  }
);

const User = model('User', userSchema);
module.exports = User;
