var mongoose = require('mongoose');

var Log = mongoose.Schema({
    title : String,
    xmlfile : String,
    nArticle : Number,
    uploadDate : Date,
});
module.exports = mongoose.model('Log',Log);