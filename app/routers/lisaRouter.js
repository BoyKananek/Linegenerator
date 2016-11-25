var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var uuid = require('uuid');
var events = require('events');
var fs = require('fs');
var eventEmitter = new events.EventEmitter();

//main content
/*
    //POST METHOD
    parameter: {
        "data" : [
            "url" : String,
            "recommended1" : String,
            "recommended2" : String,
            "recommended3" : String,
        ]
    }
    output: {
        xml : String;
    }


*/
var rand = uuid.v4();  // uuid
var currentTime = new Date().getTime(); //currentTime
var list;


var urls = new Array(); // list of url
var shortlinks = new Array(); // list of shortlink
var titles = new Array(); // list of the title of the content
var categories = new Array(); // list of category of the content
var images = new Array();  //list of image of the content
var contents = new Array(); //list of content
var url_re1 = new Array();
var title_re1 = new Array();
var image_re1 = new Array();

var url_re2 = new Array();
var title_re2 = new Array();
var image_re2 = new Array();

var url_re3 = new Array();
var title_re3 = new Array();
var image_re3 = new Array();
router.post('/generateContent', function (req, res) {
    list = req.body.data;
    /*var rand = uuid.v4();  // uuid
    var currentTime = new Date().getTime(); //currentTime
    var list = req.body.data;

    var urls = Array(); // list of url
    var shortlinks = Array(); // list of shortlink
    var titles = Array(); // list of the title of the content
    var categories = Array(); // list of category of the content
    var images = Array();  //list of image of the content
    var contents = Array(); //list of content

    //recommended article
    var url_re1 = Array();
    var title_re1 = Array();
    var image_re1 = Array();

    var url_re2 = Array();
    var title_re2 = Array();
    var image_re2 = Array();

    var url_re3 = Array();
    var title_re3 = Array();
    var image_re3 = Array();
    */
    var isDone = false;
    console.log("Getting each content data");
    for (var i = 0; i < list.length; i++) {
        urls.push(list[i].url);
        url_re1.push(list[i].recommended1);
        url_re2.push(list[i].recommended2);
        url_re3.push(list[i].recommended3);
    }
    console.log("Grabbing content inside of the each content")
    for (var i = 0; i < list.length; i++) {
        console.log("Request for content " + i);
        request(urls[i], function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html);
                //find shortlink
                var pre_shortlink = $("link[rel='shortlink']").map(function () {
                    return $(this).attr('href');
                }).toArray();
                var temp = pre_shortlink[0];
                shortlinks.push(temp.substr(24));
                console.log(temp.substr(24));
                console.log(shortlinks[i]);
                //find title
                var pre_title = $("h1.article-title").map(function () {
                    return $(this).text();
                }).toArray();
                titles.push(pre_title[0]);

                //find category
                var pre_category = $("div.breadcrumb a[rel='category tag']").map(function () {
                    return $(this).text();
                }).toArray();
                categories.push(pre_category[0]);

                //find image url
                var pre_image = $("img.attachment-banner-image").map(function () {
                    return $(this).attr('src');
                }).toArray();
                images.push(pre_image[0]);

                //find content 
                var pre_content = $("div.article-detail div.col-md-11").remove("aside.mashsh-container").map(function () {
                    return $(this).html();
                }).toArray();
                content = pre_content[0];
                var len = 4138;
                contents.push(pre_content[0].substr(len));
            }
        })
        //recommended 1
        console.log("Request for recommended 1 in content " + i);
        request(url_re1[i], function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html);
                var title = $("h1.article-title").map(function () {
                    return $(this).text();
                }).toArray();
                title_re1.push(title[0]);

                var image = $("img.attachment-banner-image").map(function () {
                    return $(this).attr('src');
                }).toArray();
                image_re1.push(image[0]);

            }
        });

        //recommended2
        console.log("Request for recommended 3 in content " + i);
        request(url_re2[i], function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html);
                var title = $("h1.article-title").map(function () {
                    return $(this).text();
                }).toArray();
                title_re2.push(title[0]);

                var image = $("img.attachment-banner-image").map(function () {
                    return $(this).attr('src');
                }).toArray();
                image_re2.push(image[0]);

            }
        });

        //recommended3
        console.log("Request for recommended 3 in content " + i);
        request(url_re3[i], function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html);
                var title = $("h1.article-title").map(function () {
                    return $(this).text();
                }).toArray();
                title_re3.push(title[0]);

                var image = $("img.attachment-banner-image").map(function () {
                    return $(this).attr('src');
                }).toArray();
                image_re3.push(image[0]);

            }
        });
        
    }
    //eventEmitter.emit('generate');
    res.end('Complete');
    /*eventEmitter.on('generate',function(){
        var xml = "<?xml version='1.0' encoding='UTF-8' ?><articles><UUID>";
        xml += xml + rand;
        xml += xml + "</UUID><time>"
        var currentTime = new Date().getTime();
        xml += xml + currentTime + "</time>";

    });*/
})

eventEmitter.on('generate', function () {
    for (var i = 0; i < list.length; i++) {
        console.log("This is the " + i + " article");
        console.log(urls[i]);
        console.log(shortlinks[i]);
        console.log(titles[i]);
        console.log(categories[i]);
        console.log(images[i]);
        console.log(contents[i]);

        console.log("Recommened Article");
        console.log(url_re1[i]);
        console.log(title_re1[i]);
        console.log(image_re1[i]);
        console.log(url_re2[i]);
        console.log(title_re2[i]);
        console.log(image_re2[i]);
        console.log(url_re3[i]);
        console.log(title_re3[i]);
        console.log(image_re3[i]);
    }
    eventEmitter.removeAllListeners();
})


module.exports = router;