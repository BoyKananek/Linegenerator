var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
    res.render("index");
});
router.get("/line_generate",function(req,res){
    res.render("lisa_generate_content");
});
router.get("/download",function(req,res){
    var file = './public/lisa_linetoday.xml';
    res.download(file); // Set disposition and send it.
});


module.exports = router;
