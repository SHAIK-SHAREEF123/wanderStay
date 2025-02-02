const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

const userSchema = new Schema({ // No need to storeusername and password manually; handled by the plugin
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose); //Additionally, Passport-Local Mongoose adds some methods to your Schema.

module.exports = mongoose.model("User", userSchema);