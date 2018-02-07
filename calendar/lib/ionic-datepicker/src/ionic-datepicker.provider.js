angular.module('ionic-datepicker.provider', [])

  .provider('ionicDatePicker', function () {

    var config = {
      setLabel: '确认',
      todayLabel: 'Today',
      closeLabel: '取消',
      mondayFirst: true,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      templateType: 'popup',
      showTodayButton: false,
      closeOnSelect: false,
      disableWeekdays: [],
      isSignupDays:[],
      signUpDisable:false,
    };

    this.configDatePicker = function (inputObj) {
      angular.extend(config, inputObj);
    };

    this.$get = ['$rootScope', '$ionicPopup', '$ionicModal', 'IonicDatepickerService', function ($rootScope, $ionicPopup, $ionicModal, IonicDatepickerService) {

      var provider = {};


      var $scope = $rootScope.$new();
      $scope.today = resetHMSM(new Date()).getTime();
      $scope.disabledDates = [];
      $scope.data = {};
      $scope.isPrevNext;

      //Reset the hours, minutes, seconds and milli seconds
      function resetHMSM(currentDate) {
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        return currentDate;
      }

      //Previous month
      $scope.prevMonth = function () {
            if ($scope.currentDate.getMonth() === 1) {
                $scope.currentDate.setFullYear($scope.currentDate.getFullYear());
            }
            $scope.currentDate.setMonth($scope.currentDate.getMonth() - 1);
            $scope.data.currentMonth = $scope.mainObj.monthsList[$scope.currentDate.getMonth()];
            $scope.data.currentYear = $scope.currentDate.getFullYear();
            refreshDateList($scope.currentDate);
      };

      //Next month
      $scope.nextMonth = function () {
              if ($scope.currentDate.getMonth() === 11) {
                  $scope.currentDate.setFullYear($scope.currentDate.getFullYear());
              }
              $scope.currentDate.setDate(1);
              $scope.currentDate.setMonth($scope.currentDate.getMonth() + 1);
              $scope.data.currentMonth = $scope.mainObj.monthsList[$scope.currentDate.getMonth()];
              $scope.data.currentYear = $scope.currentDate.getFullYear();
              refreshDateList($scope.currentDate);
      };

      //Date selected
      $scope.dateSelected = function (selectedDate) {
        if (!selectedDate || Object.keys(selectedDate).length === 0) return;
        $scope.selctedDateEpoch = selectedDate.epoch;

        if ($scope.mainObj.closeOnSelect) {
          $scope.mainObj.callback($scope.selctedDateEpoch);
          if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
            $scope.popup.close();
          } else {
            closeModal();
          }
        }
      };

      //Set today as date for the modal
      $scope.setIonicDatePickerTodayDate = function () {
        var today = new Date();
        refreshDateList(new Date());
        $scope.selctedDateEpoch = resetHMSM(today).getTime();
        if ($scope.mainObj.closeOnSelect) {
          $scope.mainObj.callback($scope.selctedDateEpoch);
          closeModal();
        }
      };

      //Set date for the modal
      $scope.setIonicDatePickerDate = function () {
        $scope.mainObj.callback($scope.selctedDateEpoch);
        closeModal();
      };

      //Setting the disabled dates list.
      function setDisabledDates(mainObj) {
        if (!mainObj.disabledDates || mainObj.disabledDates.length === 0) {
          $scope.disabledDates = [];
        } else {
          $scope.disabledDates = [];
          angular.forEach(mainObj.disabledDates, function (val, key) {
            val = resetHMSM(new Date(val));
            $scope.disabledDates.push(val.getTime());
          });
        }
      }

      //Refresh the list of the dates of a month
      function refreshDateList(currentDate) {
        currentDate = resetHMSM(currentDate);
        $scope.currentDate = angular.copy(currentDate);

        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        $scope.monthsList = [];
        if ($scope.mainObj.monthsList && $scope.mainObj.monthsList.length === 12) {
          $scope.monthsList = $scope.mainObj.monthsList;
        } else {
          $scope.monthsList = IonicDatepickerService.monthsList;
        }

        $scope.yearsList = IonicDatepickerService.getYearsList($scope.mainObj.from, $scope.mainObj.to);

        $scope.dayList = [];

        var tempDate, disabled;
        $scope.firstDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDay)).getTime();
        $scope.lastDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDay)).getTime();

        for (var i = firstDay; i <= lastDay; i++) {
          tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      disabled = (tempDate.getTime() < $scope.fromDate) || (tempDate.getTime() > $scope.toDate) || $scope.mainObj.disableWeekdays.indexOf(tempDate.getDay()) >= 0 || $scope.mainObj.signUpDisable;

          $scope.dayList.push({
            date: tempDate.getDate(),
            month: tempDate.getMonth(),
            year: tempDate.getFullYear(),
            day: tempDate.getDay(),
            epoch: tempDate.getTime(),
            disabled: disabled
          });
        }

        //To set Monday as the first day of the week.
        var firstDayMonday = $scope.dayList[0].day - $scope.mainObj.mondayFirst;
        firstDayMonday = (firstDayMonday < 0) ? 6 : firstDayMonday;

        for (var j = 0; j < firstDayMonday; j++) {
          $scope.dayList.unshift({});
        }

        $scope.rows = [0, 7, 14, 21, 28, 35];
        $scope.cols = [0, 1, 2, 3, 4, 5, 6];

        $scope.data.currentMonth = $scope.mainObj.monthsList[currentDate.getMonth()];
        $scope.data.currentYear = currentDate.getFullYear();
        $scope.data.currentMonthSelected = angular.copy($scope.data.currentMonth);
        $scope.currentYearSelected = angular.copy($scope.data.currentYear);
        $scope.numColumns = 7;

        console.log('看看月份包含',$scope.data.currentMonth);
        console.log('第一个看看',$scope.mainObj.monthsList[currentDate.getMonth()]);
        console.log('第二个看看',currentDate.getMonth());
        console.log('第三个看看',$scope.mainObj.monthsList[currentDate.getMonth()]);
      }

      //Month changed
      $scope.monthChanged = function (month) {
        var monthNumber = $scope.monthsList.indexOf(month);
        if($scope.isPrevNext == false){
            $scope.currentDate.setMonth(month);
        }else{
            $scope.currentDate.setMonth(monthNumber);
        }

        refreshDateList($scope.currentDate);
      };

      //Year changed
      $scope.yearChanged = function (year) {
        $scope.currentDate.setFullYear(year);
        refreshDateList($scope.currentDate);
      };

      //Setting up the initial object
      function setInitialObj(ipObj) {
        $scope.mainObj = angular.copy(ipObj);
        $scope.selctedDateEpoch = resetHMSM($scope.mainObj.inputDate).getTime();
        $scope.signUpEpoch=[];
        for(var i=0; i<$scope.mainObj.isSignupDays.length;i++){
            $scope.signUpEpoch.push(resetHMSM($scope.mainObj.isSignupDays[i]).getTime());
        }
        console.log('signUpEpoch嘻嘻嘻嘻',$scope.signUpEpoch);

        if ($scope.mainObj.weeksList && $scope.mainObj.weeksList.length === 7) {
          $scope.weeksList = $scope.mainObj.weeksList;
        } else {
          $scope.weeksList = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        }
        if ($scope.mainObj.mondayFirst) {
          $scope.weeksList.push($scope.mainObj.weeksList.shift());
        }
        $scope.disableWeekdays = $scope.mainObj.disableWeekdays;

        refreshDateList($scope.mainObj.inputDate);
        setDisabledDates($scope.mainObj);
      }

      $ionicModal.fromTemplateUrl('ionic-datepicker-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      function openModal() {
        $scope.modal.show();
      }

      function closeModal() {
        $scope.modal.hide();
      }

      $scope.closeIonicDatePickerModal = function () {
        closeModal();
      };

      //Open datepicker popup
      provider.openDatePicker = function (ipObj, isShow) {
        var buttons = [];
        delete $scope.fromDate;
        delete $scope.toDate;

        $scope.mainObj = angular.extend({}, config, ipObj);
        if ($scope.mainObj.from) {
          $scope.fromDate = resetHMSM(new Date($scope.mainObj.from)).getTime();
        }
        if ($scope.mainObj.to) {
          $scope.toDate = resetHMSM(new Date($scope.mainObj.to)).getTime();
        }

        if (ipObj.disableWeekdays && config.disableWeekdays) {
          $scope.mainObj.disableWeekdays = ipObj.disableWeekdays.concat(config.disableWeekdays);
        }
        setInitialObj($scope.mainObj);

        if(isShow){
            $scope.isPrevNext = true;
            buttons.push({
                text: $scope.mainObj.closeLabel,
                type: 'button_close',
                onTap: function (e) {
                    console.log('ionic-datepicker popup closed.');
                }
            });

            if (!$scope.mainObj.closeOnSelect) {
                buttons.push({
                    text: $scope.mainObj.setLabel,
                    style: {color:'white'},
                    type: 'button_set',
                    cssClass:'whiteText',
                    onTap: function (e) {
                        $scope.mainObj.callback($scope.selctedDateEpoch);
                    }
                });
            }

            if ($scope.mainObj.showTodayButton) {
                buttons.push({
                    text: $scope.mainObj.todayLabel,
                    type: 'button_today',
                    onTap: function (e) {
                        var today = new Date();
                        refreshDateList(new Date());
                        $scope.selctedDateEpoch = resetHMSM(today).getTime();
                        if (!$scope.mainObj.closeOnSelect) {
                            e.preventDefault();
                        }
                    }
                });
            }

          }else{
            $scope.isPrevNext = false;
            console.log('嘿嘿嘿',$scope.mainObj.isSignupDays instanceof Array);
            if($scope.mainObj.isSignupDays instanceof Array){
                for(var i=0; i<$scope.mainObj.isSignupDays.length; i++){
                    console.log('进来了签到')
                    // $scope.mainObj.isSignupDays[i].addClass("selected_date");
                }
            }
            buttons.push({
                text: "关闭",
                type: 'button_close signUpBG',
                onTap: function (e) {
                    console.log('ionic-datepicker popup closed.');
                }
            });
        }

          if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
              $scope.popup = $ionicPopup.show({
                  templateUrl: 'ionic-datepicker-popup.html',
                  scope: $scope,
                  cssClass: 'ionic_datepicker_popup whiteText',
                  buttons: buttons
              });
          } else {
              openModal();
          }
          console.log('查看isPrevNext',$scope.isPrevNext);
      }



      return provider;

    }];

  });
