'use strict';
(function (app) {
    app
        .controller('SignUpCtrl', ['$scope', '$state', '$rootScope', '$ionicHistory', '$ionicPopover', '$ionicPopup', 'Config', 'ActivityDataStorage', 'DealHistoryService', 'GetCashService', 'OpenAccountService', 'SignUpService','$timeout', 'ionicDatePicker', '$filter','MonthTaskService', 'LaunchService',
            function ($scope, $state, $rootScope, $ionicHistory, $ionicPopover, $ionicPopup, Config, ActivityDataStorage, DealHistoryService, GetCashService, OpenAccountService, SignUpService, $timeout, ionicDatePicker, $filter,MonthTaskService, LaunchService) {

                var datePickerObj = {
                    //选择日期后的回调
                    callback: function (val) {
                        if (typeof (val) === 'undefined') {
                        } else {
                            $scope.validedTime = $filter('date')(new Date(val), 'yyyy-MM-dd');
                            datePickerObj.inputDate = new Date(val); //更新日期弹框上的日期
                        }
                    },
                    disabledDates: [
                        new Date(2016, 2, 16),
                        new Date(2015, 3, 16),
                        new Date(2015, 4, 16),
                        new Date(2015, 5, 16),
                        new Date('Wednesday, August 12, 2015'),
                        new Date("2016-08-16"),
                        new Date(1439676000000)
                    ],
                    from: new Date(),     //这一块取的是本地时间；如有要求需要接口返回服务器时间
                    to: new Date(),       //同上
                    inputDate: new Date(),   //同上
                    isSignupDays: [new Date("2018-02-04"),new Date("2018-02-05"),new Date("2018-02-06"),new Date("2018-02-07")],   //签到的天数数组  
                    signUpDisable: true,
                    mondayFirst: true,
                    disableWeekdays: [], //设置不能选中
                    closeOnSelect: false,
                    dateFormat: 'yyyy-MM-dd',
                    templateType: 'popup'
                };

                //打开日期选择框
                $scope.openDatePicker = function () {
                    ionicDatePicker.openDatePicker(datePickerObj, false);
                    //这里添加的第二个参数
                };

                $scope.navigate = function (state) {
                    nav.navigate(state);
                };

            }])
}(controllers));