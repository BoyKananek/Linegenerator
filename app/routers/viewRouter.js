var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
    res.render("index");
});
router.get("/line_generate",function(req,res){
    res.render("lisa_generate_content");
});
router.get("/hello_nererate",function(req,res){

});


module.exports = router;
