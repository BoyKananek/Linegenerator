var express = require('express');
var events = require('events');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config/database.js');
var mongoose = require('mongoose');

mongoose.connect(config.url);

var app = express();
app.use(cookieParser());
var port = process.env.PORT || 3000;

var lisaRouter = require('./app/routers/lisaRouter');
var viewRouter = require('./app/routers/viewRouter');
var helloRouter = require('./app/routers/helloRouter');
var apiRouter = require('./app/routers/apiRouter');

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));


//setting template for app
app.set('view engine', 'ejs');


app.use('/lisa',lisaRouter);
app.use('/hello',helloRouter);
app.use('/',viewRouter);
app.use('/api',apiRouter);


app.listen(port);
console.log('Magic happens on port '+port);