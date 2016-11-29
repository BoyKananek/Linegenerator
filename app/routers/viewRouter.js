var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
    res.render("index");
});
router.get("/lisa_linegenerate",function(req,res){
    res.render("lisa_generate_content");
});
//router.get("/hello_linegenerate",function(req,res){
//    res.render("hello_generate_content");
//})
router.get("/lisa_download",function(req,res){
    var file = './public/lisa_linetoday.xml';
    res.download(file); 
});
router.get("/hello_download",function(req,res){
    var file = './public/hello_linetoday.xml';
    res.download(file);
})


module.exports = router;
