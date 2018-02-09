# ionic-datepicker
ionic自带的日历插件ionic-datepicker。项目中用到了两种插件，一个是改造成选择日历日期；一个改造成签到显示日期。

![选择日期的日历](/calendar/images/selectTime.png)
![签到显示的日历](/calendar/images/signUp.png)

[博客地址](http://blog.csdn.net/spicyboiledfish/article/details/78801095)
http://blog.csdn.net/spicyboiledfish/article/details/78801095

=================================================================
2月9日更新：
去适配iPhone 5s-8.3系统下的样式会有偏差的问题：
解决方案：
 在ionic-datepicker.styles.css文件中添加对小屏手机的媒体查询：
@media screen and (max-width: 330px) {
  .ionic_datepicker_popup.whiteText .popup{
    width:17rem !important;
  }
}
再次重新打包成bundle.js即可。
