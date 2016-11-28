var express = require('express');
var events = require('events');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var port = 3000 || process.env.PORT;

var lisaRouter = require('./app/routers/lisaRouter');
var viewRouter = require('./app/routers/viewRouter');

//app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//setting template for app
app.set('view engine', 'ejs');


app.use('/lisa',lisaRouter);
app.use('/',viewRouter);


app.listen(port);
console.log('Magic happens on port '+port);