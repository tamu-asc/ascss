var homeApp = angular.module('homeApp', []);

homeApp.controller('HomeController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $http.defaults.headers.post = {
        'Content-Type': "application/json"
    };
    $http.defaults.headers.put = {
        'Content-Type': "application/json"
    };
    $http.defaults.headers.patch = {
        'Content-Type': "application/json"
    };
    $http.defaults.headers.common = {
        'Content-Type': "application/json"
    };
    $scope.user = {};
    $scope.showInactive = false;
    $scope.activeCourses = [];
    $scope.inactiveCourses = [];
    $scope.displayCourses = [];
    $scope.logout = function () {
        $http({
            method: "GET",
            url: "/api/logout"
        }).then(function (resp) {
            $window.location.href = "/login"
        }, function (err) {
            console.error(JSON.stringify(err));
            $window.alert("Error Logging out");
        });
    };
    $scope.persistCourse = function (course) {
        $http({
            method: "PUT",
            url: "/api/admin/course/" + course.id,
            data: course
        }).then(function (resp) {
            console.log(JSON.stringify(resp));
        }, function (err) {
            console.error(JSON.stringify(err));
        });
    };
    $scope.createNewCourse = function (course) {
        course.year = parseInt(course.year);
        course.credits = parseInt(course.credits);
        $http({
            method: "POST",
            url: "/api/admin/course",
            data: course
        }).then(function (resp) {
            $scope.activeCourses.push(resp["data"]["course"]);
            $scope.refreshDisplayCourses();
        }, function (err) {
            $window.alert("Error saving course");
        });
    };
    $scope.saveActiveState = function (course) {
        if (course.active === true) {
            for (var i in $scope.inactiveCourses) {
                if ($scope.inactiveCourses[i].id === course.id) {
                    $scope.inactiveCourses.splice(i, 1);
                    break;
                }
            }
            $scope.activeCourses.push(course);
        } else {
            for (var i in $scope.activeCourses) {
                if ($scope.activeCourses[i].id === course.id) {
                    $scope.activeCourses.splice(i, 1);
                    break;
                }
            }
            $scope.inactiveCourses.push(course);
        }
        $scope.persistCourse(course);
        $scope.refreshDisplayCourses();
    };
    $scope.toggleShowActive = function () {
        $scope.showInactive = !$scope.showInactive;
        $scope.refreshDisplayCourses();
    };
    $scope.refreshDisplayCourses = function () {
        var displayCourses = [];
        displayCourses = displayCourses.concat($scope.activeCourses);
        if($scope.showInactive) {
            displayCourses = displayCourses.concat($scope.inactiveCourses);
        }
        $scope.displayCourses = displayCourses;
    };
    $scope.gotoCourse = function (course) {
        alert("Clicked course " + course.title);
        $window.location.href = "/admin/coursepage?course=" + course.id;
    };

    $http({
        method: "GET",
        url: "/api/user"
    }).then(function (resp) {
        $scope.user = resp["data"]["user"];
    }, function (err) {
        $window.location.href = "/login"
    });

    // Get Active Courses
    $http({
        method: "GET",
        url: "/api/admin/courses?inactive=2"
    }).then(function (resp) {
        $scope.activeCourses = resp["data"]["courses"];
        $scope.refreshDisplayCourses();
        console.log(JSON.stringify($scope.displayCourses));
    }, function (err) {
        $window.location.href = "/login"
    });

    // Get Inactive Courses
    $http({
        method: "GET",
        url: "/api/admin/courses?inactive=1"
    }).then(function (resp) {
        $scope.inactiveCourses = resp["data"]["courses"];
        $scope.refreshDisplayCourses();
        console.log(JSON.stringify($scope.displayCourses));
    }, function (err) {
        $window.location.href = "/login"
    });

}]);