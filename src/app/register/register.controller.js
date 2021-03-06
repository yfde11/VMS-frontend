(function() {
    'use strict';

    angular
        .module('vmsFrontend')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($log, $state, fieldName, defaultAvatarPath, vmsClient, vmsErrorMessage, authPrinciple, $scope, cities, localStorageService) {
        var vm = this;
        vm.cities = cities;

        $log.log('RegisterController');

        vm.showAvatar = defaultAvatarPath;

        vm.datePicker = {
            mode: 'year',
            dateOptions: {
                datepickerMode:"'year'",
                minMode:"'year'",
                minDate:"minDate",
                showWeeks:"false"
            },
            status: {
                opened: false
            },
            format: 'yyyy'
        }

        vm.register = function() {
            $log.debug('=== register ===');
            
            $log.debug(vm.volunteer);

            if (vm.showAvatar != defaultAvatarPath) {
                vm.volunteer.avatar = vm.showAvatar;
            } 
            
            vmsClient.register(vm.volunteer, function(response) {
                $log.debug('success');
                $log.debug(response);

                localStorageService.set('username', vm.volunteer.username);
                authPrinciple.authenticate(response.data.auth_access_token);

                $state.go('registerSuccess', {last_name: vm.volunteer.last_name, email: vm.volunteer.email});
            }, function(response) {
                $log.debug('error');
                $log.debug(response);

                if (response.status == 422) {
                    $log.error(response.data);

                    var errors = response.data.errors;
                    vm.errorMsg = vmsErrorMessage.getErrorMsg(errors);
                }
            });
        };

        vm.selectAvatar = function(event, fileReader, file, fileList, fileObjects, object) {
            var base64Image = "data:" + object.filetype + ';base64,' + object.base64
            vm.showAvatar = base64Image;
        };

        vm.openDatePicker = function($event) {
            $log.debug("click openDatePicker");
            $event.preventDefault();
            $event.stopPropagation();
            vm.datePicker.status.opened = true;
        }
    }
})();