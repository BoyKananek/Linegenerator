var express = require('express');
var events = require('events');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT;

var lisaRouter = require('./app/routers/lisaRouter');
var viewRouter = require('./app/routers/viewRouter');
var helloRouter = require('./app/routers/helloRouter');

//app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//setting template for app
app.set('view engine', 'ejs');


app.use('/lisa',lisaRouter);
app.use('/hello',helloRouter);
app.use('/',viewRouter);


app.listen(port);
console.log('Magic happens on port '+port);