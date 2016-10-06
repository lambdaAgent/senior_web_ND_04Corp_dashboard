var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require("path")
var dataApi_P = require("./dataAPI.js").init;
var	{recycleClosedToBeOpenIssue, simulatePurchases} = require("./dataAPI")
var openIssue, closedIssue,employee, customer;

dataApi_P().then(arr => {
  openIssue = arr[0];
  closedIssue = arr[1];
  employee = arr[2];
  customer = arr[3];
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
	res.send("default server path")
})


app.get('/getAll', function (req, res) {
 	  //for each request, recycle old issues, add new purchases.. 
  	Promise.all([recycleClosedToBeOpenIssue(closedIssue, openIssue), simulatePurchases(customer)])
    .then(result => {
        var Response = { openIssue, closedIssue,  employee, customer };

        res.json(Response)
    })
       
    
});

//ERROR Handler


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(8000, function () {
  console.log('Example app listening on port 8000');
});