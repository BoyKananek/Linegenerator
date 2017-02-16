var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var uuid = require('uuid');
var events = require('events');
var fs = require('fs');
var async = require('async');
var waitUntil = require('wait-until');

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
//var rand = uuid.v4();  // uuid
//var currentTime = new Date().getTime(); //currentTime
var rand;
var currentTime;
var list;
var xml;

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
    //prepare process
    rand = uuid.v4();
    currentTime = new Date().getTime();
    xml = "";
    urls = [];
    shortlinks = [];
    titles = [];
    categories = [];
    images = [];
    contents = [];
    url_re1 = [];
    title_re1 = [];
    image_re1 = [];
    url_re2 = [];
    title_re2 = [];
    image_re2 = [];
    url_re3 = [];
    title_re3 = [];
    image_re3 = [];
    list = req.body.data;

    //processing
    for (var i = 0; i < list.length; i++) {
        urls.push(list[i].url);
        url_re1.push(list[i].recommended1);
        url_re2.push(list[i].recommended2);
        url_re3.push(list[i].recommended3);
    }

    var getMain = function (requestCountMain) {
        if (requestCountMain === list.length) {
            return;
        } else {
            request(urls[requestCountMain], function (err, res, html) {
                if (!err) {
                    var $ = cheerio.load(html);
                    //find shortlink
                    var pre_shortlink = $("link[rel='shortlink']").map(function () {
                        return $(this).attr('href');
                    }).toArray();
                    var temp = pre_shortlink[0];
                    shortlinks.push(temp.substr(24));

                    //find title
                    var pre_title = $("h1.article-title").map(function () {
                        return $(this).text();
                    }).toArray();
                    console.log(pre_title[0]);
                    titles.push(pre_title[0]);

                    //find category
                    var pre_category = $("div.breadcrumb a[rel='category tag']").map(function () {
                        return $(this).text();
                    }).toArray();
                    console.log(pre_category[0]);
                    if (pre_category[0].includes("&")) {
                        pre_category[0] = pre_category[0].replace("&", "&amp;");
                        console.log(pre_category[0]);
                        categories.push(pre_category[0]);
                    }
                    else {
                        categories.push(pre_category[0]);
                    }

                    //find image url
                    var pre_image = $("img.attachment-banner-image").map(function () {
                        return $(this).attr('src');
                    }).toArray();
                    images.push(pre_image[0]);

                    //find content 
                    var pre_content = $("div.article-detail div.col-md-11").remove("aside.mashsh-container").map(function () {
                        return $(this).html();
                    }).toArray();
                    var content = pre_content[0].split("</aside>");
                    contents.push(content[1]);

                }
                return getMain(requestCountMain + 1);
            })
            
        }
    }

    var getRecommended1 = function (requestCountRe1) {
        if (requestCountRe1 === list.length) {
            return;
        } else {
            request(url_re1[requestCountRe1], function (err, res, html) {
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
                return getRecommended1(requestCountRe1 + 1);
            });
            
        }
        
    }

    var getRecommended2 = function (requestCountRe2) {
        if (requestCountRe2 === list.length) {
            return;
        } else {
            request(url_re2[requestCountRe2], function (err, res, html) {
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
                return getRecommended2(requestCountRe2 + 1);
            });
            
        }
    }

    var getRecommended3 = function (requestCountRe3) {
        if (requestCountRe3 === list.length) {
            return;
        } else {
            request(url_re3[requestCountRe3], function (err, res, html) {
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
                 return getRecommended3(requestCountRe3+1);
            });
        }
    }

    getMain(0);
    getRecommended1(0);
    getRecommended2(0);
    getRecommended3(0);

     waitUntil()
        .interval(10000)
        .times(list.length)
        .condition(function () {
            //nothing
        })
        .done(function () {
            eventEmitter.emit('generate');
            res.end('Complete!!!');
        });

    /*for (var i = 0; i < list.length; i++) {
        console.log("Request for content " + (i + 1));
        request(urls[i], function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html);
                //find shortlink
                var pre_shortlink = $("link[rel='shortlink']").map(function () {
                    return $(this).attr('href');
                }).toArray();
                var temp = pre_shortlink[0];
                shortlinks.push(temp.substr(24));

                //find title
                var pre_title = $("h1.article-title").map(function () {
                    return $(this).text();
                }).toArray();
                console.log(pre_title[0]);
                titles.push(pre_title[0]);

                //find category
                var pre_category = $("div.breadcrumb a[rel='category tag']").map(function () {
                    return $(this).text();
                }).toArray();
                console.log(pre_category[0]);
                if(pre_category[0].includes("&")){
                    pre_category[0] = pre_category[0].replace("&","&amp;");
                    console.log(pre_category[0]);
                    categories.push(pre_category[0]);
                }
                else{
                    categories.push(pre_category[0]);
                }

                //find image url
                var pre_image = $("img.attachment-banner-image").map(function () {
                    return $(this).attr('src');
                }).toArray();
                images.push(pre_image[0]);

                //find content 
                var pre_content = $("div.article-detail div.col-md-11").remove("aside.mashsh-container").map(function () {
                    return $(this).html();
                }).toArray();
                var content = pre_content[0].split("</aside>");
                contents.push(content[1]);

            }
        })


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
    if (list.length <= 4) {
        waitUntil()
            .interval(6000)
            .times(1)
            .condition(function () {
                //nothing
            })
            .done(function () {
                eventEmitter.emit('generate');
                res.end('Complete!!!');
            });
    } else {
        waitUntil()
            .interval(10000)
            .times(1)
            .condition(function () {
                //nothing
            })
            .done(function () {
                eventEmitter.emit('generate');
                res.end('Complete!!!');
            });
    }
    */

})


eventEmitter.on('generate', function () {
    console.log("main title");
    console.log(titles);
    console.log("main url");
    console.log(urls);
    console.log("recommended1 url");
    console.log(url_re1);
    console.log(title_re1);
    console.log("recommended2 url");
    console.log(url_re2);
    console.log(title_re2);
    console.log("recommended3 url");
    console.log(url_re3);
    console.log(title_re3);
    xml = "<?xml version='1.0' encoding='UTF-8' ?><articles><UUID>";
    xml += rand;
    xml += "</UUID><time>";
    xml += currentTime.toString() + "</time>";

    for (var i = 0; i < list.length; i++) {

        xml += "<article>";
        xml += "<ID>" + shortlinks[i] + "</ID>";
        xml += "<nativeCountry>TH</nativeCountry><language>th</language><publishCountries><country>TH</country></publishCountries>";
        var time = currentTime - (360000 * (i + 1));
        xml += "<startYmdtUnix>" + time.toString() + "</startYmdtUnix><endYmdtUnix>7274196000000</endYmdtUnix>"
        xml += "<title><![CDATA[" + titles[i] + "]]></title>";
        xml += "<category>" + categories[i] + "</category>";
        xml += "<publishTimeUnix>" + time.toString() + "</publishTimeUnix>";
        xml += "<updateTimeUnix>" + time.toString() + "</updateTimeUnix>";
        xml += "<contents><image><url>" + images[i] + "</url><thumbnail>" + images[i] + "</thumbnail></image>";
        xml += "<text><content><![CDATA[" + contents[i] + "]]></content></text></contents>";
        xml += "<recommendArticles><article><title><![CDATA[" + title_re1[i] + "]]></title>";
        xml += "<url><![CDATA[" + url_re1[i] + "?utm_source=line&utm_medium=referral&utm_campaign=linetoday]]></url>";
        xml += "<thumbnail><![CDATA[" + image_re1[i] + "]]></thumbnail></article>";
        xml += "<article><title><![CDATA[" + title_re2[i] + "]]></title>";
        xml += "<url><![CDATA[" + url_re2[i] + "?utm_source=line&utm_medium=referral&utm_campaign=linetoday]]></url>";
        xml += "<thumbnail><![CDATA[" + image_re2[i] + "]]></thumbnail></article>";
        xml += "<article><title><![CDATA[" + title_re3[i] + "]]></title>";
        xml += "<url><![CDATA[" + url_re3[i] + "?utm_source=line&utm_medium=referral&utm_campaign=linetoday]]></url>";
        xml += "<thumbnail><![CDATA[" + image_re3[i] + "]]></thumbnail></article>";
        xml += "</recommendArticles><author>Lisaguru.com</author>";
        xml += "<sourceUrl><![CDATA[" + urls[i] + "?utm_source=line&utm_medium=referral&utm_campaign=linetoday]]></sourceUrl></article>"
    }
    xml += "</articles>";
    fs.truncate('./public/lisa_linetoday.xml', 0, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("remove");
            fs.writeFile("./public/lisa_linetoday.xml", xml, { flag: 'w' }, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('Save!');
            });
        }
    });


})


module.exports = router;