var mongo = require('mongodb');
var mongoose = require('mongoose');

var Dept = mongoose.model('DeptModel');
var Employee = mongoose.model('EmployeeModel');
var _Request = mongoose.model('ReqModel');

var arr_requests;

