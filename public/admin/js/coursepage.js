var homeApp = angular.module('homeApp', []);
homeApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
homeApp.directive('ngEnterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnterKey);
                });

                event.preventDefault();
            }
        });
    };
});
homeApp.controller('CoursepageController', [
    '$scope',
    '$http',
    '$window',
    function(
        $scope,
        $http,
        $window) {

        $scope.getUrlParameter = function (param) {
            var sPageURL = $window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                parameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                parameterName = sURLVariables[i].split('=');

                if (parameterName[0] === param) {
                    return parameterName[1] === undefined ? true : decodeURIComponent(parameterName[1]);
                }
            }
        };

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
        $scope.studentUploadList = [];
        $scope.leaderUploadList = [];
        $scope.courseId = parseInt($scope.getUrlParameter("course"));
        $scope.course = {};
        $scope.students = [];
        $scope.leaders = [];

        $scope.logout = function () {
            $http({
                method: "GET",
                url: "/api/logout"
            }).then(function (resp) {
                $window.location.href = "/login";
            }, function (err) {
                console.error(JSON.stringify(err));
                $window.alert("Error Logging out");
            });
        };
        $scope.home = function () {
            $window.location.href = "/admin";
        };

        const processCSV = function (data) {
            let parse = function (row){
                var insideQuote = false,
                    entries = [],
                    entry = [];
                row.split('').forEach(function (character) {
                    if(character === '"') {
                        insideQuote = !insideQuote;
                    } else {
                        if(character == "," && !insideQuote) {
                            entries.push(entry.join(''));
                            entry = [];
                        } else {
                            entry.push(character);
                        }
                    }
                });
                entries.push(entry.join(''));
                return entries;
            };

            return data.split('\n').filter(function(data) {return data;}).map(parse);
        };
        const getUsernameHeaderIndex = function (headers) {
            for (const i in headers) {
                if (["uin", "uins", "username", "usernames"].indexOf(headers[i].toLowerCase()) !== -1) return i;
            }
            return -1;
        };
        const getCSVColumnByIndex = function (csvDataList, index) {
            let ret = [];
            for (const i in csvDataList) {
                ret.push(csvDataList[i][index]);
            }
            return ret;
        };

        $scope.clearFilesInput = function () {
            $scope.studentFile = {};
            angular.element("input[type='file']").val(null);
        };


        /*
         * Student Related calls
         */
        $scope.uploadStudentsFile = function () {
            var fileName = $scope.studentFile.name;
            if (!fileName.endsWith(".csv")) {
                $window.alert("Passed File Not a CSV");
                $('#studentCSVFile').val('');
                return;
            }
            var file = new $window.FileReader();
            file.onload = function(theFile) {
                try {
                    // console.log(theFile.target.result);
                    const csv = processCSV(theFile.target.result);
                    let uNameIndex = getUsernameHeaderIndex(csv[0]);
                    if (uNameIndex === -1) {
                        throw new Error("Column UIN/Username not found");
                    }
                    let usernames = getCSVColumnByIndex(csv.splice(1), uNameIndex);
                    addStudentsToListUtil(usernames);
                } catch (e) {
                    $window.alert("Error in parsing CSV: " + e.toLocaleString());
                } finally {
                    $scope.clearFilesInput();
                    $scope.$apply();
                }
            };
            file.readAsText($scope.studentFile);
        };
        const addStudentsToListUtil = function (vals) {
            for (i in vals) {
                const val = vals[i];
                if ($scope.studentUploadList.indexOf(val) == -1) {
                    $scope.studentUploadList.push(val);
                }
            }
        };
        $scope.addStudentToList = function () {
            console.log($scope.student.username);
            addStudentsToListUtil([$scope.student.username]);
            $scope.student.username = "";
        };
        $scope.resetStudentInput = function () {
            $scope.studentUploadList = [];
            $scope.clearFilesInput();
        };
        const getStudentCreationBackendData = function () {
            let data = {"users":[]};
            for (const i in $scope.studentUploadList) {
                data["users"].push({"username":$scope.studentUploadList[i]});
            }
            return data;
        };
        const appendCreatedStudentsToList = function (students) {
            let presentUsernames = $scope.students.map(function (data) {return data.username;});
            for (const i in students) {
                if (presentUsernames.indexOf(students[i].username) === -1) {
                    $scope.students.push(students[i]);
                    presentUsernames.push(students[i].users);
                }
            }
        };
        $scope.addStudentsToCourse = function () {
            $http({
                method: "POST",
                url: "/api/admin/course/" + $scope.courseId + "/student_bulk",
                data: getStudentCreationBackendData()
            }).then(function (resp) {
                appendCreatedStudentsToList(resp["data"]["courses"]);
                $scope.resetStudentInput();
                $scope.$apply();
            }, function (err) {
                $window.alert("Error Uploading students to course " + err.toLocaleString());
            });
        };


        /*
         * Leader Related calls
         */
        $scope.uploadLeadersFile = function () {
            var fileName = $scope.leaderFile.name;
            if (!fileName.endsWith(".csv")) {
                $window.alert("Passed File Not a CSV");
                $('#leaderCSVFile').val('');
                return;
            }
            var file = new $window.FileReader();
            file.onload = function(theFile) {
                try {
                    // console.log(theFile.target.result);
                    const csv = processCSV(theFile.target.result);
                    let uNameIndex = getUsernameHeaderIndex(csv[0]);
                    if (uNameIndex === -1) {
                        throw new Error("Column UIN/Username not found");
                    }
                    let usernames = getCSVColumnByIndex(csv.splice(1), uNameIndex);
                    addLeadersToListUtil(usernames);
                } catch (e) {
                    $window.alert("Error in parsing CSV: " + e.toLocaleString());
                } finally {
                    $scope.clearFilesInput();
                    $scope.$apply();
                }
            };
            file.readAsText($scope.leaderFile);
        };
        const addLeadersToListUtil = function (vals) {
            for (i in vals) {
                const val = vals[i];
                if ($scope.leaderUploadList.indexOf(val) == -1) {
                    $scope.leaderUploadList.push(val);
                }
            }
        };
        $scope.addLeaderToList = function () {
            console.log($scope.leader.username);
            addLeadersToListUtil([$scope.leader.username]);
            $scope.leader.username = "";
        };
        $scope.resetLeaderInput = function () {
            $scope.leaderUploadList = [];
            $scope.clearFilesInput();
        };
        const getLeaderCreationBackendData = function () {
            let data = {"users":[]};
            for (const i in $scope.leaderUploadList) {
                data["users"].push({"username":$scope.leaderUploadList[i]});
            }
            return data;
        };
        const appendCreatedLeadersToList = function (leaders) {
            let presentUsernames = $scope.leaders.map(function (data) {return data.username;});
            for (const i in leaders) {
                if (presentUsernames.indexOf(leaders[i].username) === -1) {
                    $scope.leaders.push(leaders[i]);
                    presentUsernames.push(leaders[i].users);
                }
            }
        };
        $scope.addLeadersToCourse = function () {
            $http({
                method: "POST",
                url: "/api/admin/course/" + $scope.courseId + "/leader_bulk",
                data: getLeaderCreationBackendData()
            }).then(function (resp) {
                appendCreatedLeadersToList(resp["data"]["courses"]);
                $scope.resetLeaderInput();
                $scope.$apply();
            }, function (err) {
                $window.alert("Error Uploading leaders to course " + err.toLocaleString());
            });
        };

        $http({
            method: "GET",
            url: "/api/user"
        }).then(function (resp) {
            $scope.user = resp["data"]["user"];
        }, function (err) {
            $window.location.href = "/login"
        });

        $http({
            method: "GET",
            url: "/api/admin/course/" + $scope.courseId
        }).then(function (resp) {
            $scope.course = resp["data"]["course"];
        }, function (err) {
            $window.alert("Course not found " + $scope.courseId);
            $scope.home();
        });

        $http({
            method: "GET",
            url: "/api/admin/course/" + $scope.courseId + "/students"
        }).then(function (resp) {
            $scope.students = resp["data"]["courses"];
        }, function (err) {
            $window.alert("Course students not found " + $scope.courseId);
            $scope.home();
        });

        $http({
            method: "GET",
            url: "/api/admin/course/" + $scope.courseId + "/leaders"
        }).then(function (resp) {
            $scope.leaders = resp["data"]["courses"];
        }, function (err) {
            $window.alert("Course leaders not found " + $scope.courseId);
            $scope.home();
        });
    }]);