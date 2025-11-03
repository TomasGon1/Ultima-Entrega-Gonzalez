const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  oauth: {
    type: Boolean,
    default: false
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: function() {
      return !this.oauth;
    },
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.oauth;
    },
  },
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
  },
  resetToken: {
    token: String,
    expiresAt: Date,
  },
  documents: [{
    name: String,
    reference: String
  }],
  last_connection: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
