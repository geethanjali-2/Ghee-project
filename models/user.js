// user.js

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true}
});
userSchema.plugin(passportLocalMongoose);

// Define and export User model
module.exports = mongoose.model('User', userSchema);
