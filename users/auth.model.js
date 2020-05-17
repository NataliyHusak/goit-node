const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
	email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String
});

module.exports = model('User', schema);
