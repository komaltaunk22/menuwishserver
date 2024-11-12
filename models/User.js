const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: function () {
      return this.userType === 'user';
    }
  },
  location: {
    type: String,
    required: false
  },
  aboutMe: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);  // Ensures a valid 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  userType: {
    type: String,
    enum: ['user', 'restaurant'],
    required: true
  },
  ownerName: {
    type: String,
    required: function () {
      return this.userType === 'restaurant';
    }
  },
  restaurantName: {
    type: String,
    required: function () {
      return this.userType === 'restaurant';
    }
  },
  address: {
    type: String,
    required: function () {
      return this.userType === 'restaurant';
    }
  }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
