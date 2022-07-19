const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re = /^[a-zA-Z0-9]{4,15}$/; // https://stackoverflow.com/a/6814901/13762501
        return value.match(re);
      },
      message: "Please enter a valid username",
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    validate: { validator: (value) => value.length > 6, message: "Password must be of more than 6 characters" },
  },
  avatar: {
    type: String,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
