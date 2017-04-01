var app = angular.module('projectApp', ['ngRoute', 'smart-table', 'ui.router', 'ngDialog', 'angular-rating', 'gridshore.c3js.chart']);

//main controller
app.controller('MainController', function ($scope, $location, $http, $state, $stateParams, ngDialog) {

});

//route settings
app.config(function($routeProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/request');

    $stateProvider.state('request', {
            url: '/request',
            templateUrl: "request.html",
            controller: "MainController"
        })
        .state('waiting', {
            url: '/waiting',
            templateUrl:"waiting.html",
            controller: "MainController"
        })
        .state('ads', {
            url: '/ads',
            templateUrl:"info.html",
            controller: "MainController"
        })
        .state('employee', {
            url: '/employee',
            templateUrl:"employee.html",
            controller: "MainController"
        })
});
