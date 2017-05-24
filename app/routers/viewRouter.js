var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var User = require('../models/user');
var Log = require('../models/log');

function formatXML(input) {

    // PART 1: Add \n where necessary
    // A) add \n between sets of angled brackets without content between them
    // B) remove \n between opening and closing tags of the same node if no content is between them
    // C) add \n between a self-closing set of angled brackets and the next set
    // D) split it into an array

    xmlString = input.trim()
        .replace(/>\s*</g,'>\n<')                   
        .replace(/(<[^\/>].*>)\n(<[\/])/g,'$1$2')      
        .replace(/(<\/[^>]+>|<[^>]+\/>)(<[^>]+>)/g,'$1\n$2');            
    xmlArr = xmlString.split('\n');

    // PART 2: indent each line appropriately

    var tabs = '';          //store the current indentation
    var start = 0;          //starting line
    if (/^<[?]xml/.test(xmlArr[0])) start++;    //if the first line is a header, ignore it

    for (var i = start; i < xmlArr.length; i++) { //for each line
        var line = xmlArr[i].trim();    //trim it just in case
        if (/^<[/]/.test(line)) { // if the line is a closing tag                
            // remove one tab from the store
            // add the tabs at the beginning of the line
            tabs = tabs.replace(/.$/, '');
            xmlArr[i] = tabs + line;            
        } else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(line)) { // if the line contains an entire node                
            // leave the store as is
            // add the tabs at the beginning of the line
            xmlArr[i] = tabs + line;
        } else { // if the line starts with an opening tag and does not contain an entire node                
            // add the tabs at the beginning of the line
            // and add one tab to the store
            xmlArr[i] = tabs + line;            
            tabs += '\t';
        }                    
    }

    //rejoin the array to a string and return it
    return xmlArr.join('\n');
}


router.get("/login",function(req,res){
    res.render("login");
})

var auth = function(req,res,next){
    console.log('Cookie id :' + req.cookies.secret );
    Session.findOne({'secret':req.cookies.secret },function(err,result){
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            console.log(result);
            if(result){
                return next();
            }else{
                return res.redirect('/login');
            }
        }
    })
};

router.get('/admin',auth,function(req,res){
    Session.findOne({'secret':req.cookies.secret },function(err,result){
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            console.log(result);
            User.findOne({'username': result.username},function(err,user){
                if(err){
                    console.log(err);
                }else{
                    console.log(user);
                    if(user.isAdmin == true){
                        Log.find({},{},{sort: { 'uploadDate': -1 }},function(err,log){
                            if(err){
                                console.log(err);
                            }else{
                                res.render('admin',{log: log});
                            }
                        })
                        
                    }else{
                        res.redirect('/');
                    }
                }
            })
        }
    })
});
//make the xml file viewer 
router.get("/xmlViewer/:id",auth,function(req,res){
    Session.findOne({'secret':req.cookies.secret },function(err,result){
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            console.log(result);
            User.findOne({'username': result.username},function(err,user){
                if(err){
                    console.log(err);
                }else{
                    console.log(user);
                    if(user.isAdmin == true){
                        Log.findOne({'_id': req.params.id},function(err,log){
                            if(err){
                                console.log(err);
                            }else{
                                var formatedXML = formatXML(log.xmlfile);
                                res.render('xmlViewer',{log: formatedXML});
                            }
                        })
                        
                    }else{
                        res.redirect('/');
                    }
                }
            })
        }
    })
})
router.get("/",auth,function(req,res){
    res.render("index");
});

router.get("/lisa_linegenerate",auth,function(req,res){
    res.render("lisa_generate_content");
});

router.get("/hello_linegenerate",auth,function(req,res){
    res.render("hello_generate_content");
})

module.exports = router;
