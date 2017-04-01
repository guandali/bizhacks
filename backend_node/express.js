var mongo = require('mongodb');
var express = require('express'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser')
  logger = require('morgan')
  mongoose = require('mongoose');
  async = require('async'); 

var path = require('path');
var favicon = require('serve-favicon');

var app = express()


// var routes = require('./routes/index');
//         var users = require('./routes/users');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))

var port = process.env.PORT || 3000;


var mongodbURL = "mongodb://lli-dev:nwhacks@ds021663.mlab.com:21663/nodeproject1"

var mongooseConn = mongoose.connect(mongodbURL, function(err,db){
    if (!err){
        console.log('Connected to MongoDB!');
    } else{
        console.dir(err); //failed to connect
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');

var Schema = mongoose.Schema;

var DeptSpecializationSchema = new Schema({
  dept: String,
  rating: Number
})

var RequestSchema = new Schema({
  dept: String,
  time: { type : Date, default: Date.now }, 
  cancelled: Boolean,
  resolved: {type: String,default:''}
})

var EmployeeSchema = new Schema({
  login: String,
  pwd: String,
  specialization: [DeptSpecializationSchema]

})

var DeptModel = mongoose.model('DeptModel', DeptSpecializationSchema)

var ReqModel = mongoose.model('ReqModel', RequestSchema)

var EmployeeModel = mongoose.model('EmployeeModel', EmployeeSchema)

var compDept = new DeptModel({dept: 'computers', rating: 3 })
var cameraDept = new DeptModel({dept: 'camera', rating: 1})

var larry = new EmployeeModel({login: 'larry', pwd: 'password', specialization: [compDept,cameraDept ]})

var req_1 = new ReqModel({dept: 'computers', cancelled: false })

// compDept.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('compDept');
//   }
// });

// cameraDept.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('cameraDept');
//   }
// });

// larry.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('add larry');
//   }
// });

// req_1.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('add larry');
//   }
// });

app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /collections/messages')
})

// test route to make sure everything is working 
app.get('/larry', function(req, res) {
    res.json({ message: 'too much larry!' });   
});

// param is employeemodels
// function: do something every time there is this value in the URL pattern of the request handler
// select a particular collection when request pattern contains a sting collectionName
app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})


// newEmployeemodels
app.param('newEmployee', function(req, res, next){
  return next()
})

app.post('/newEmployee', function(req, res) {
  console.log(JSON.stringify(req.body));

  var dept_arr;

for (i = 0; i< req.body.specialization.length ; i++) {
  var _dept = req.body.specialization[i][0]
  var _rating = req.body.specialization[i][1]
  
  var newDept = new DeptModel({dept: _dept, rating: _rating})

  dept_arr.push(newDept)
}
   var newEmployee = new ReqModel({login: req.body.login, pwd: req.body.pwd, specialization: dept_arr});

   newEmployee.save(function (err) {
     if (err) {
      console.log(err);
    } else {
     console.log(req.body.login + " successfully added");
    }
  })

})


// newRequest
app.param('newReq', function(req, res, next){
  return next()
})

app.post('/newReq', function(req, res) {
  console.log(JSON.stringify(req.body));

   var _request = new ReqModel({dept: req.body.dept, time: req.body.time, cancelled: req.body.cancelled, resolved: req.body.resolved });

   _request.save(function (err) {
     if (err) {
      console.log(err);
    } else {
     console.log(req.body.dept + " successfully added");
    }
  })

})


// newDeptModel
app.param('newDeptModel', function(req, res, next){
  return next()
})

app.post('/newDeptModel', function(req, res) {
  console.log(JSON.stringify(req.body));

   var dept = new DeptModel({dept: req.body.dept, rating: req.body.rating });

   dept.save(function (err) {
     if (err) {
      console.log(err);
    } else {
     console.log(req.body.dept + " successfully added");
    }
  })

})

app.get('/collections', function(req, res, next) {
  
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)

  })
})

app.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

app.delete('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result === 1)?{msg: 'success'} : {msg: 'error'})
  })
})




app.listen(port, function(){
  console.log('Express server listening on port ' + port);
})

