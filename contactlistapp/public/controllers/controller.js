var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl', function($scope, $http) {

	$scope.currencyVal = $scope.contact; 

	var refresh = function() {
		$http.get('/contactlist').success(function(response){
			//console.log("I got the data i requested");
			$scope.contactlist = response;
			$scope.contact = "";
		});
	};
	refresh();

	$scope.addContact = function() {
		//console.log($scope.contact);
		$http.post('/contactlist', $scope.contact).success(function(response) {
			console.log(response);
			refresh();
		});
	};

	$scope.remove = function(id){
		//console.log(id);
		$http.delete('/contactlist/' +id).success(function(response){
			console.log(response);
			refresh();
		});
	};

	$scope.edit = function(id){
		//console.log(id);
		$http.get('/contactlist/' +id).success(function(response){
			$scope.contact = response;
		});
	};

	$scope.update = function(){
		//console.log($scope.contact._id);
		$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
			//console.log(response);
			refresh();
		});
	};
});

myApp.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
           
			ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});

myApp.filter('tel', function () {
    return function (tel) {
        console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});
