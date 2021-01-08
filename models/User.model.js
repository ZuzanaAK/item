const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      //required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationTime: {
      type: Date
    },
    googleID: String,
    profileImage: {
      type: String,
      default: "https://data.whicdn.com/images/346305623/original.jpg"
    }
  },
  {
    timestamps: true
  }
);

 module.exports = model('User', userSchema);