var app = angular.module('projectApp', ['ngRoute', 'smart-table', 'ui.router', 'ngDialog', 'angular-rating', 'gridshore.c3js.chart']);

//Main controller
app.controller('MainController', function ($scope, $location, $http, $state, $stateParams, ngDialog) {
    
    $scope.course = false;
    $scope.error = false;
    $scope.loading = true;

    $scope.advanceSearch = {
        'dow':'',
        'tod':''
    }; 

    if ($state.current.name == "details" && $stateParams.courseId) {
        $scope.course = {}; 
        
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/courseinfo/' + $stateParams.courseId
        }).then(function successCallback(response) {
            $scope.course = response.data[0];
            // var d = angular.copy($scope.course); 
            // console.log(d);
            $scope.chartData1 = $scope.course.num0To9;
            $scope.chartData2 = $scope.course.num10To19;
            $scope.chartData3 = $scope.course.num20To29; 
            $scope.chartData4 = $scope.course.num30To39;
            $scope.chartData5 = $scope.course.num40To49;
            $scope.chartData6 = $scope.course.num50To54; 
            $scope.chartData7 = $scope.course.num55To59;
            $scope.chartData8 = $scope.course.num60To63;
            $scope.chartData9 = $scope.course.num64To67;
            $scope.chartData10 = $scope.course.num68To71; 
            $scope.chartData11 = $scope.course.num72To75;
            $scope.chartData12 = $scope.course.num76To79; 
            $scope.chartData13 = $scope.course.num80To84;
            $scope.chartData14 = $scope.course.num85To89;
            $scope.chartData15 = $scope.course.num90To100;
            $scope.course.averageGrade = Math.round($scope.course.averageGrade * 100) / 100;
            $scope.loading = false; 
        }, function errorCallback(response) {
            $scope.loading = false; 
            $scope.error = true;
        });

        // TO-DO: Call server to get additional data with course ID

    } else {
        $scope.courses = []; 

        $scope.showDetails = function (course){
            $state.go('details', {'courseId': course.CourseInfoID});  
        }

        $scope.clearFilters = function(){
            $scope.courses = $scope.allCourses;

            $scope.advanceSearch = {
                'dow':'',
                'tod':''
            };

            ngDialog.open({
                template: 'successful_clear.html', 
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };

        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/list'
        }).then(function successCallback(response) {
            $scope.courses = response.data
            $scope.allCourses = angular.copy($scope.courses); 
            $scope.loading = false; 
        }, function errorCallback(response) {
            $scope.loading = false; 
            $scope.error = true;
        });
    }

    // Open modal
    $scope.openAdvanceSearch = function () {
        //https://github.com/likeastore/ngDialog
        ngDialog.open({ 
            template: 'advanced_search.html', 
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };  

    $scope.search = function(){
        //TODO make api call to perform advance search
        ngDialog.close();
        // ngDialog.open({
        //         template: 'to_be_implemented.html', 
        //         className: 'ngdialog-theme-default',
        //         scope: $scope
        //     });
    }

    $scope.cancel = function(){
        ngDialog.close();
    }  
});

// Routing setttings
app.config(function($routeProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/request');

    $stateProvider.state('list', {
        url: '/list',
        templateUrl: "list.html"
    })

    .state('details', {
        url: '/details?courseId',
        templateUrl: "details.html",
        controller: "MainController"
    })
    .state('request', {
        url: '/request',
        templateUrl: "request.html",
        controller: "MainController"
    })

});
