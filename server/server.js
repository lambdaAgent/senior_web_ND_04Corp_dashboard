var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require("path")
var dataApi_P = require("./dataAPI.js").init;
var	{cloneClosedToBeOpenIssue, simulatePurchases,simulateHiredEmployee} = require("./dataAPI")
var OPEN_ISSUE, CLOSED_ISSUE, EMPLOYEE, CUSTOMER, COUNTRY_CODE, CANDIDATE_EMPLOYEE;


dataApi_P().then(arr => {
  OPEN_ISSUE = arr[0];
  CLOSED_ISSUE = arr[1];
  EMPLOYEE = arr[2];
  CANDIDATE_EMPLOYEE = arr[3];
  CUSTOMER = arr[4];
  COUNTRY_CODE = arr[5];

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

  app.get("/getEmployee", (req, res) => {
      //do the simulation of new employee being hired
      simulateHiredEmployee(CANDIDATE_EMPLOYEE,EMPLOYEE)
      .then(employee => {
        res.json({employee: EMPLOYEE, countryCode:COUNTRY_CODE})
      })
  })


  app.get('/getKeyMetric', function (req, res) {

   	  //for each request, recycle old issues, add new purchases.. 
    	Promise.all([
        cloneClosedToBeOpenIssue(CLOSED_ISSUE, OPEN_ISSUE), 
        simulatePurchases(CUSTOMER)
        ])
      .then(result => {
          var Response = { openIssue:OPEN_ISSUE, closedIssue:CLOSED_ISSUE, customer: CUSTOMER};
          res.json(Response)
      })
         
      
  });

  app.get('/getDataView', function (req, res) {

      //for each request, recycle old issues, add new purchases.. 
      Promise.all([
        cloneClosedToBeOpenIssue(CLOSED_ISSUE, OPEN_ISSUE)
        ])
      .then(result => {
          var Response = { openIssue:OPEN_ISSUE, 
                           closedIssue:CLOSED_ISSUE, 
                           customer: CUSTOMER, // list of customer's names are needed for filtering purposes 
                           employee: EMPLOYEE  // list of employee's names are needed for filtering purposes
                         };
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

});