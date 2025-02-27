angular.module('portal').controller('applyController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'apply';
    $scope.newMember = {};
    $scope.agreed = false;

    // tell if we can edit projects / get funding batch
    $http.get('/api/project/cycle').then(function (response) {
        $scope.open = response.data.open;
        $scope.cycle = response.data.cycle;
        $scope.deadline = response.data.deadline;
        $scope.resumeLink = response.data.resumeLink;
    });

    $http.get('/api/user/current').then(function (response) {
        $scope.user = response.data;

        $scope.project = {
            name: undefined,
	    visibility: undefined,
            public: {
            	team: [$scope.user.email],
                projectPitch: undefined,
                projectDescription: undefined,
                teamDescription: undefined,
            },
            private: {
                primary: $scope.user.email,
                budgetAmount: undefined,
                budgetUsed: undefined,
                budgetBreakdown: undefined,
                otherFunding: undefined,
                timeline: undefined,
                point: undefined,
                batch: undefined,
                status: undefined, 
                contact: undefined,
                checks: undefined,
                location: undefined,
                remoteWorkPlan: undefined,
                internetSpeed: undefined
            },
            admin: {
                comments: undefined
            }
        }
    });

    $scope.addMember = function () {
        if ($scope.newMember.email.toLowerCase().endsWith('@mit.edu')) {
            if ($scope.project.public.team.indexOf($scope.newMember.email.toLowerCase()) === -1) {
                $scope.project.public.team.push($scope.newMember.email.toLowerCase());
            } else {
                sweetAlert("Already added", "Team member is already on the team.", "warning");
            }
            $scope.newMember.email = '';
        } else {
            sweetAlert("Invalid email", "Please enter a valid email that ends with @mit.edu.", "error");
        }
    }

    $scope.removeMember = function (member) {
        if (member === $scope.user.email) {
            sweetAlert("Oops", "You can't remove yourself from the team!", "error");
        } else {
            $scope.project.public.team.splice($scope.project.public.team.indexOf(member), 1);
        }
    }

    $scope.submit = function () {
        if (!this.agreed && !$scope.agreed) {
        sweetAlert('Please agree to the terms and conditions');
        } else {
            $http.post('/api/project', {
                'project': $scope.project
            }).then(function (response) {
                $location.path('/home');
                sweetAlert("Project created", "Project created and saved! Come back to edit anytime before the deadline.", "success");
            }, function (response) {
                console.log(response);
                sweetAlert("Error saving project", response.data, "error");
            });
        }
    }

});
