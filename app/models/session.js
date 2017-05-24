var mongoose = require('mongoose');

var session = mongoose.Schema({
    secret : String,
    username : String,
    createdAt : {
        type: Date,
        expires: 1296000000, //15 days
        default: Date.now
    }
});

module.exports = mongoose.model('session',session);