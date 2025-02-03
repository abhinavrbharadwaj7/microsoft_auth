const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  microsoftId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: v => !v || /^\d{10}$/.test(v),
      message: 'Phone number must be 10 digits'
    }
  },
  avatarUrl: {
  type: String,
  default: '',
  validate: {
    validator: function(v) {
      // Allow empty string or URLs starting with http/https or server uploads
      return !v || /^(https?:\/\/|\/uploads\/)/.test(v);
    },
    message: 'Avatar URL must be a valid HTTP URL or server upload path'
  }
}
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);