var myApp = angular.module('myApp', []);

myApp.controller('HomeController', ['$scope', function($scope) {
    $scope.user = {};
    $scope.logout = function () {
        alert("logout");
    }
}]);