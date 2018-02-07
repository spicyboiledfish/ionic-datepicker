'use strict';
(function (app) {
    app
        .controller('SignUpCtrl', ['$scope', '$state', '$rootScope', '$ionicHistory', '$ionicPopover', '$ionicPopup', 'Config', 'ActivityDataStorage', 'DealHistoryService', '$timeout', 'ionicDatePicker', '$filter',
            function ($scope, $state, $rootScope, $ionicHistory, $ionicPopover, $ionicPopup, Config, ActivityDataStorage, DealHistoryService, $timeout, ionicDatePicker, $filter) {

                    /* 获取相隔天数 */
                    $scope.GetDateDiff = function(startDate,endDate)
                    {
                        var startTime = new Date(Date.parse(startDate)).getTime();
                        var endTime = new Date(Date.parse(endDate)).getTime();
                        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
                        return  dates;
                    }

                    /* 测试数据 */
                    $scope.validedTime = new Date("2018-02-07");   //当天开始天
                    $scope.validedEndTime =  new Date("2018-04-07");   //日历结束日
 
                    $scope.validedNormalTime = $scope.validedTime;

                    var datePickerObj = {
                        //选择日期后的回掉
                        callback: function (val) {
                            if (typeof (val) === 'undefined') {
                            } else {
                                $scope.validedTime = $filter('date')(new Date(val), 'yyyy-MM-dd');
                                datePickerObj.inputDate = new Date(val); //更新日期弹框上的日期
                                var differ = $scope.GetDateDiff($scope.validedNormalTime, $scope.validedTime);
                                $scope.holdDay = $scope.holdNormalDay + differ;
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
                        from: $scope.validedTime,   //这是当前日期的时间戳
                        to: $scope.validedEndTime, //new Date(Date.parse(new Date()) + 2 * 24 * 3600 * 1000),     //这是当前日期加上7天之后的时间戳
                        inputDate: new Date($scope.validedTime),
                        mondayFirst: true,
                        disableWeekdays: [], //设置不能选中
                        closeOnSelect: false,
                        dateFormat: 'yyyy-MM-dd',
                        templateType: 'popup'
                    };

                    //打开日期选择框
                    $scope.openDatePicker = function () {
                        ionicDatePicker.openDatePicker(datePickerObj,true);  //这里的第二个参数是true
                    };

                    $scope.navigate = function (state) {
                        nav.navigate(state);
                    };

            }])
}(controllers));
