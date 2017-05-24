var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Session = require('../models/session');
var uuid = require('uuid');

router.post('/signup',function(req,res){
    var newUser = new User();
    User.findOne({'username': req.body.username},function(err,result){
        if(err){
            console.log(err);
            res.json({error: true, message: err});
        }else{
            if(result == null){
                newUser.username = req.body.username;
                newUser.password = newUser.generateHash(req.body.password);
                newUser.isAdmin = req.body.isAdmin;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        res.json({save:false,message:err});
                    }else{
                        console.log("Save user already");
                        res.json({save:true, message:"Saved!"});
                    }
                })
            }
        }
    });

});
router.post("/login", function (req, res) {
    var session = new Session();
    User.findOne({ 'username': req.body.username }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ error: true, message: err });
            //res.end(err);
        } else {
            //user not found!
            if (user === null) {
                res.cookie('success', false, { expires: new Date(new Date().getTime() + 60000) });
                console.log('Authentication failed; username or password is incorrect. Try again.');
                res.redirect('/login');

            }
            //user found!
            else {
                if (!user.validPassword(req.body.password)) {
                    res.cookie('success', false, { expires: new Date(new Date().getTime() + 60000) });
                    console.log('Authentication failed; username or password is incorrect. Try again.')
                    res.redirect('/login');

                }
                else {
                    if(user.isAdmin == false){
                        var secret = uuid.v4();
                        session.secret = secret;
                        session.username = user.username;
                        session.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.end(err);
                            } else {
                                console.log("Login successfully");
                                res.cookie('secret', secret, { expires: new Date(new Date().getTime() + 1296000000) });
                                res.clearCookie("success");
                                res.redirect('/');
                            }
                        });
                    }else if(user.isAdmin == true){
                        var secret = uuid.v4();
                        session.secret = secret;
                        session.username = user.username;
                        session.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.end(err);
                            } else {
                                console.log("Login successfully");
                                res.cookie('secret', secret, { expires: new Date(new Date().getTime() + 1296000000) });
                                res.clearCookie("success");
                                res.redirect('/admin');
                            }
                        });
                    }
                }
            }
        }
    })
});

router.get('/logout', function (req, res) {
    Session.remove({ 'secret': req.cookies.secret }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.clearCookie("success");
            res.clearCookie("secret");
            res.redirect('/login');
        }
    });
});

module.exports = router;