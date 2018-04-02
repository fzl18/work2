
mui.ready(function () {
    jssDk();
});

function jssDk(){
    mui.ajax(path + 'jssdk.do?url=' + window.location.href + paramsAcc, {
        data: {},
        dataType: 'json', // 服务器返回json格式数据
        type: 'post', // HTTP请求类型
        success: function(data) {
          if (data.error) {
            if(data.error == 'UnbindUser'){
                unbindUser();
              }
            mui.alert(data.error, '提示');
          } else {
            var role = sessionStorage.getItem('role');
            if (!role) {
                var url = encodeURIComponent(location.href);
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+data.appId+
                '&redirect_uri='+path+'oauth.do?url='+window.location.href+'&response_type=code&scope=snsapi_userinfo&state=HDWX#wechat_redirect';
                return false;
            }
            if (role == 'PATIENT') {
                //页面显示元素
                getDom(role);
                queryPatientAccountInfo();
            } else {
                //页面显示元素
                getDom(role);
                queryBaseParamByUserId();
               
                if(role == 'DOCTOR' || role == 'ASSISTANT'){
                    getScientific();
                }
                // getNoAuthority();
            }

          }
        },
        error: function(xhr, type, errorThrown) {
          // 异常处理；
          console.log(type);
        },
      });
}

//切换医生组
function getScientific(){
    var doctorGroupArr = [];
    var curYdataAccountId = sessionStorage.getItem('acctId');
    mui.ajax(path + 'user/queryDoctorGroupListByAcctId.do?curYdataAccountId=' + curYdataAccountId + '&openid=' + sessionStorage.getItem('openid'), {
      data: {},
      dataType: 'json', // 服务器返回json格式数据
      type: 'post', // HTTP请求类型
      success: function(data){
        if (data.error) {
            if(data.error == 'UnbindUser'){
                unbindUser();
              }
            if(data.error == '未指定医生组' || data.error == '获取角色信息失败'){
                getNoAuthority();
                return false;
            }
        } else {
          var groupList = data.groupList;
          var setSelectedIndex = '';
          if (groupList != '' && groupList != null && groupList != undefined) {
            if (groupList.length > 1) {
                $("#showUserPicker").show();
              for (var i = 0; i < groupList.length; i++) {
                var siteId = groupList[i].siteId,
                  groupName = groupList[i].siteName,
                  roleId = groupList[i].roleId;
                
                if(siteId == sessionStorage.getItem('siteId')){
                    setSelectedIndex = i;
                }
                
                var roleName = '';
                if (groupList[i].role != '' && groupList[i].role != null && groupList[i].role != undefined) {
                  roleName = groupList[i].role.roleName;
                }
  
                var textName = groupName;
                if (roleName != '' && roleName != null && roleName != undefined) {
                  textName += '(' + roleName + ')';
                }
  
                var doctorGroupClass = {
                  'value': siteId,
                  'text': textName,
                  'roleId': roleId
                }
  
                doctorGroupArr.push(doctorGroupClass);
              }
              var userPicker = new mui.PopPicker();
              userPicker.setData(doctorGroupArr);

              //设置默认选中
              userPicker.pickers[0].setSelectedIndex(setSelectedIndex);

              var showUserPickerButton = document.getElementById('showUserPicker');
              showUserPickerButton.addEventListener('tap', function (event) {
                userPicker.show(function (items) {
                  var defaultPatams = 'siteId=' + items[0].value + '&roleId=' + items[0].roleId + '&userId=' + sessionStorage.getItem('userId');
                  mui.ajax(path + 'project/saveDefaultLogin.do?' + defaultPatams + paramsAcc, {
                    data: {},
                    dataType: 'json', // 服务器返回json格式数据
                    type: 'post', // HTTP请求类型
                    success: function(data) {
                      if (data.error) {
                        if(data.error == 'UnbindUser'){
                            unbindUser();
                        }
                        mui.alert(data.error, '提示');
                      } else {
                        mui.toast('切换医生组成功');
                        setTimeout(function() {
                          mui.openWindow({
                            url: 'index.html',
                            id: 'index.html'
                          });
                        }, 1000);
                      }
                    },
                    error: function(xhr, type, errorThrown) {
                      // 异常处理；
                      console.log(type);
                    },
                  });
                });
              }, false);
            }
          }
        }
      },
      error: function(xhr, type, errorThrown) {
        // 异常处理；
        console.log(type);
      },
    });
  }
  

//获取非病人参数
function queryBaseParamByUserId() {
    mui.ajax(path+'project/queryBaseParamByUserId.do?acctId='+sessionStorage.getItem('acctId')+paramsAcc, {
        data: {},
        dataType: 'json', // 服务器返回json格式数据
        type: 'post', // HTTP请求类型
        timeout: 10000, // 超时时间设置为10秒；
        success: function(data) {
            if (data.error) {
                if(data.error == 'UnbindUser'){
                    unbindUser();
                }
                if(data.error == '未指定医生组' || data.error == '获取角色信息失败'){
                    getNoAuthority();
                    return false;
                }
            } else {
                var investigationId = data.investigationId;
                var siteId = data.siteId;
                if (siteId == '' || siteId == null || siteId == undefined) {
                    mui.openWindow({
                        url: '../crf/pdmsApp/patient/switchDoctor.html',
                        id: '../crf/pdmsApp/patient/switchDoctor.html'
                    });
                }
                var userId = data.userId;
                var roleId = data.roleId;
                var siteName = data.siteName;
                var roleName = data.roleName;
                var investigationName = data.investigationName;

                sessionStorage.setItem('investigationId', investigationId);
                sessionStorage.setItem('siteId', siteId);
                sessionStorage.setItem('roleId', roleId);
                sessionStorage.setItem('userId', userId);
                sessionStorage.setItem('investigationName', investigationName);
                sessionStorage.setItem('siteName', siteName);
                sessionStorage.setItem('roleName', roleName);
                
                queryVisitToDoList(formatDate(new Date()));
                queryVisitToDoForCalender();
            }
        },
        error: function(xhr, type, errorThrown) {
            // 异常处理；
            console.log(type);
        },
    });
}

//获取非病人角色下的日期
var toDoDateList = '';
function queryVisitToDoForCalender() {
    var calenderParams = 'acctId=' + sessionStorage.getItem('acctId') + '&month=' + formatDate(new Date()) + 
                        '&siteId=' + sessionStorage.getItem('siteId');
    mui.ajax(path + 'visit/queryVisitToDoForCalender.do?' + calenderParams + paramsAcc, {
        data: {},
        dataType: 'json',//服务器返回json格式数据
        type: 'post',//HTTP请求类型
        success: function (data) {
            if (data.error) {
                if(data.error == 'UnbindUser'){
                    unbindUser();
                  }
                if(data.error == '未指定医生组' || data.error == '获取角色信息失败'){
                    getNoAuthority();
                    return false;
                }
            } else {
                var node = data.toDoDateList;
                if (node != '' && node != null && node != undefined) {
                    toDoDateList = node;
                } else {
                    toDoDateList = '';
                }

                caleandarController();
            }
        },
        error: function (xhr, type, errorThrown) {
            console.log(type);
        }
    });
}

//病人点击马上提交
mui('.mui-row').on('tap', '#patientVisit', function () {
    if(commitDate == ''){
        commitDate = $('.cur').attr('data-date');
    }
    //var _commitDate = formatDate(new Date(commitDate.replace(/\-/g, "/")));
    //var thData = ;

    var _commitDate = new Date(formatDate(new Date(commitDate.replace(/\-/g, "/")))),
        thData = new Date(formatDate(new Date(formatDate(new Date()).replace(/\-/g, "/"))));
    
    if(_commitDate > thData){
        mui.alert('未到访视可提交时间');
        return false;
    }

    //visitId 不存在 自动创建一条访视
    if (visitIdPatient == '' || visitIdPatient == undefined || visitIdPatient == null) {
        if(createTime == ''){
            createTime = new Date();
        }
        var _param = 'patientId=' + patientIdPatient + '&visitTypeId=' + visitTypeIdPatient + '&visitTime=' + new Date(createTime).toString('yyyy-MM-dd') +
            '&siteId=' + siteIdPatient + '&roleId=' + roleIdPatient + '&userId=' + userIdPatient;

        mui.ajax(path + 'patient/addVisit.do?' + _param + paramsAcc, {
            data: {},
            dataType: 'json',//服务器返回json格式数据
            type: 'post',//HTTP请求类型
            success: function (data) {
                if (data.error) {
                    if(data.error == 'UnbindUser'){
                        unbindUser();
                      }
                    mui.alert(data.error, '提示');
                } else {
                    sessionStorage.setItem('scientificResearchLibraryId', '');
                    sessionStorage.setItem('visitId', data.visitId);
                    sessionStorage.setItem('roleFlag', 'Calendar');
                    setTimeout(function () {
                        mui.openWindow({
                            url: '../crf/pdmsApp/patient/patientGroupDetail.html',
                            id: '../crf/pdmsApp/patient/patientGroupDetail.html'
                        })
                    }, 500);
                }
            },
            error: function (xhr, type, errorThrown) {
                console.log(type);
            }
        });
    } else {
        sessionStorage.setItem('scientificResearchLibraryId', '');
        sessionStorage.setItem('visitId', visitIdPatient);
        sessionStorage.setItem('roleFlag', 'Calendar');
        mui.openWindow({
            url: '../crf/pdmsApp/patient/patientGroupDetail.html',
            id: '../crf/pdmsApp/patient/patientGroupDetail.html'
        });
    }
});

function getDom(role) {
    if (role == 'PATIENT') {
        $("#patientId").show();
        $("#doctorId").hide();
    } else {
        $("#doctorId").show();
        $("#patientId").hide();
    }

    getDomNav(role);
}

//底部导航
function getDomNav(role) {
    var str = '';
    if (role == 'PATIENT') {
        str += '<a class="mui-tab-item mui-active">';
        str += '<span class="mui-tab-label">日历</span>';
        str += '</a>';
        str += '<a class="mui-tab-item patient">';
        str += '<span class="mui-tab-label">我的档案</span>';
        str += '</a>';
    } else {
        str += '<a class="mui-tab-item mui-active">';
        str += '<span class="mui-tab-label">日历</span>';
        str += '</a>';
        str += '<a class="mui-tab-item dynamic">';
        str += '<span class="mui-tab-label">动态</span>';
        str += '</a>';
        str += '<a class="mui-tab-item patient">';
        str += '<span class="mui-tab-label">病例记录</span>';
        str += '</a>';
    }

    $("#navId").html(str);
    if(role != 'PATIENT'){
        queryVisitDynamic();
    }
}


var visitIdPatient = '',
    visitTypeIdPatient = '',
    roleIdPatient = '',
    siteIdPatient = '',
    userIdPatient = '',
    investigationIdPatient = '',
    patientIdPatient = '';

function queryPatientAccountInfo() {
    mui.ajax(path + 'user/queryPatientAccountInfo.do?curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid'), {
        data: {},
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        success: function (data) {
            if (data.error) {
                if(data.error == 'UnbindUser'){
                    unbindUser();
                  }
                mui.alert(data.error);
            } else {
                patientIdPatient = data.patientId,
                    roleIdPatient = data.roleId,
                    siteIdPatient = data.siteId,
                    userIdPatient = data.userId,
                    investigationIdPatient = data.investigationId;

                sessionStorage.setItem('investigationId', investigationIdPatient);
                sessionStorage.setItem('siteId', siteIdPatient);
                sessionStorage.setItem('roleId', roleIdPatient);
                sessionStorage.setItem('userId', userIdPatient);
                sessionStorage.setItem('patientId', patientIdPatient);

                queryVisitToDoByPatientId(patientIdPatient,new Date().toString('yyyy-MM-dd'));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

var visitToDoList = '';
var createTime = '';
//获取病人日期并渲染
function queryVisitToDoByPatientId(patientId,month) {
    var paramsVisit = 'patientId=' + patientId + '&month=' + month;
    mui.ajax(path + 'visit/queryVisitToDoByPatientId.do?' + paramsVisit + paramsAcc, {
        data: {},
        dataType: 'json',
        type: 'post',
        success: function(data) {
            if (data.error) {
                if(data.error == 'UnbindUser'){
                    unbindUser();
                  }
                mui.alert(data.error, '提示');
            } else {
                if(data.visitToDoList != '' && data.visitToDoList != undefined && data.visitToDoList != null){
                    visitIdPatient = data.visitToDoList[0].visitId,
                    //visitIdPatient = '32',
                    visitTypeIdPatient = data.visitToDoList[0].visitTypeId;
    
                    sessionStorage.setItem('visitTypeId', visitTypeIdPatient);
    
                    var visitToDoListData = data.visitToDoList;
                    if (visitToDoListData != '' && visitToDoListData != null && visitToDoListData != undefined) {
                        visitToDoList = data.visitToDoList;
                    } else {
                        visitToDoList = '';
                    }
                }else {
                    $("#patientTitle").html(new Date().toString('yyyy-MM-dd') + ',祝您安康</br>本日没有医嘱待办事项');
                    $("#patientVisit").hide();
                }

                caleandarController();
                
            }
        },
        error: function(xhr, type, errorThrown) {
            console.log(type);
        },
    });
}

var calendarInsFlag = '1';
var commitDate = '';
function caleandarController() {

    if(calendarInsFlag == '1'){
        calendarInsFlag = '2';
        calendarIns = new calendar.calendar({
            count: 1,
            selectDate: new Date(),
            selectDateName: '',
            isShowHoliday: true,
            isShowWeek: false
        });
    }

    for (var v = 0; v < visitToDoList.length; v++) {
        var visitToDoDate = visitToDoList[v].visitToDoDate,
          visitCanCreateBegin = visitToDoList[v].visitCanCreateBegin,
          visitCanCreateEnd = visitToDoList[v].visitCanCreateEnd;
          
        //当前日期 判断页面显示元素 patient
        var curData = $('.cur').attr('data-date');

        var getThisData = new Date(formatDate(new Date(curData.replace(/\-/g, "/"))));
        var _getThisData = formatDate(new Date(formatDate(new Date(curData.replace(/\-/g, "/"))))) 
        var getVisitToDoDate = new Date(formatDate(new Date(visitToDoDate.replace(/\-/g, "/"))));
        var getVisitCanCreateBegin = new Date(formatDate(new Date(visitCanCreateBegin.replace(/\-/g, "/"))));
        var getVisitCanCreateEnd = new Date(formatDate(new Date(visitCanCreateEnd.replace(/\-/g, "/"))));

        if (getThisData == getVisitToDoDate) {
          $("#patientTitle").html(_getThisData + ',祝您安康</br>按照医嘱，本日您可以提交随访资料');
          $("#patientVisit").show();
          break;
        } else if (getThisData >= getVisitCanCreateBegin && getThisData <= getVisitCanCreateEnd) {
          $("#patientTitle").html(_getThisData + ',祝您安康</br>按照医嘱，本日您可以提交随访资料');
          $("#patientVisit").show();
          break;
        } else {
          $("#patientTitle").html(_getThisData + ',祝您安康</br>本日没有医嘱待办事项');
          $("#patientVisit").hide();
          break;
        }
    }

    $.bind(calendarIns, 'afterSelectDate', function (event) {
        var curItem = event.curItem,
            date = event.date,
            dateName = event.dateName;
        calendarIns.setSelectDate(date);
        commitDate = date;
        

        var role = sessionStorage.getItem('role');
        if (role == 'PATIENT') {
            var byPhoneDate = formatDate(new Date(formatDate(new Date(date.replace(/\-/g, "/")))));
            if (visitToDoList != '' && visitToDoList != null && visitToDoList != undefined) {
                var foundTodo = false;
                for (var v = 0; v < visitToDoList.length; v++) {
                    var visitToDoDate = visitToDoList[v].visitToDoDate,
                        visitCanCreateBegin = visitToDoList[v].visitCanCreateBegin,
                        visitCanCreateEnd = visitToDoList[v].visitCanCreateEnd;
                    var _date = new Date(formatDate(new Date(date.replace(/\-/g, "/")))),
                       _visitToDoDate = new Date(formatDate(new Date(visitToDoDate.replace(/\-/g, "/")))),
                       _visitCanCreateBegin = new Date(formatDate(new Date(visitCanCreateBegin.replace(/\-/g, "/")))),
                       _visitCanCreateEnd = new Date(formatDate(new Date(visitCanCreateEnd.replace(/\-/g, "/"))));
                    if (_date == _visitToDoDate ||
                        (_date >= _visitCanCreateBegin && _date <= _visitCanCreateEnd)) {
                            createTime = _visitToDoDate;
                            foundTodo = true;
                            break;
                    } else {
                        foundTodo = false;
                        //break;
                    }
                }
               
                if(foundTodo){
                    $("#patientTitle").html(byPhoneDate + ',祝您安康</br>按照医嘱，本日您可以提交随访资料');
                    $("#patientVisit").show();
                }else{
                    $("#patientTitle").html(byPhoneDate + ',祝您安康</br>本日没有医嘱待办事项');
                    $("#patientVisit").hide();
                }
                
            }else{
                $("#patientTitle").html(byPhoneDate + ',祝您安康</br>本日没有医嘱待办事项');
                $("#patientVisit").hide();
            }
        } else {
            queryVisitToDoList(date);
        }
    });

}

function prevMonth(){
    var _a = $(".calendarDate").html().replace('年','-');
    var _b = _a.replace('月','');
    var prevMonthVal = getPreMonth(new Date(_b).toString('yyyy-MM-dd'));
    if(sessionStorage.getItem('role') == 'PATIENT'){
        queryVisitToDoByPatientId(patientId,prevMonthVal);
    }else{
        queryVisitToDoList(prevMonthVal);
    }
    calendarIns.prevMonth();
}

function nextMonth(){
    var _a = $(".calendarDate").html().replace('年','-');
    var _b = _a.replace('月','');
    var nextMonthVal = getNextMonth(new Date(_b).toString('yyyy-MM-dd'));
    if(sessionStorage.getItem('role') == 'PATIENT'){
        queryVisitToDoByPatientId(patientId,nextMonthVal);
    }else{
        queryVisitToDoList(nextMonthVal);
    }
    calendarIns.nextMonth();
}

var pullrefreshData = '';
//获取当前日期下病人数据
function queryVisitToDoList(month) {
    pullrefreshData = month;
    var queryVisitToDoListParams  = 'acctId=' + sessionStorage.getItem('acctId') + '&month=' + month + 
    '&siteId=' + sessionStorage.getItem('siteId') + paramsAcc ;
    //+ '&offset=' + (offset*1 + 1*1) + '&limit=10'
    mui.ajax(path + 'visit/queryVisitToDoList.do?' + queryVisitToDoListParams, {
        data: {},
        dataType: 'json',
        type: 'post',
        success: function(data) {
            if (data.error) {
                if(data.error == 'UnbindUser'){
                    unbindUser();
                  }
                mui.alert(data.error, '提示');
            } else {
                var visitToDoList = data.visitToDoList;
                var str = '';
                if (visitToDoList != '' && visitToDoList != null && visitToDoList != undefined) {
                    for (var i = 0; i < visitToDoList.length; i++) {
                        var node = visitToDoList[i].patient;
                        str += '<li class="mui-table-view-cell patientDetail" patientId="' + node.patientId + '">';
                        str += '<a class="mui-navigate-right mui-slider-handle">';
                        str += '<div class="mui-row">';
                        str += '<div class="mui-col-sm-3 mui-col-xs-3" style="text-align: left;">';
                        if (node.patientName != '' && node.patientName != null && node.patientName != undefined) {
                            str += node.patientName;
                        }else{
                            str += '';
                        }
                        str += '</div>';
                        str += '<div class="mui-col-sm-2 mui-col-xs-2" style="text-align: left;">';
                        if (node.hospitalizationNumber != '' && node.hospitalizationNumber != null && node.hospitalizationNumber != undefined) {
                            str += '|&nbsp;' + node.hospitalizationNumber;
                        }else{
                            str += '';
                        }
                        str += '</div>';
                        str += '<div class="mui-col-sm-7 mui-col-xs-7" style="text-align: right;padding-right: 15px;">';
                        if (node.visitTypeName != '' && node.visitTypeName != null && node.visitTypeName != undefined) {
                            str += node.visitTypeName;
                        }else{
                            str += '';
                        }
                        str += '</div>';
                        str += '</div>';
                        str += '</a>';
                        str += '</li>';
                    }
                    $("#getDateId").html(str);
                    $("#pullrefresh").show();
                    $("#noDate").hide();

                    // $(".mui-scroll").css({'transform':'translate3d(0px, 0px, 0px) translateZ(0px)'});
               		
               		// offset = (offset*1 + 1*1);
									
                    // var totalCount = data.visitToDoList.totalCount;
                    // if(totalCount != undefined){
                    //     if(offset*10 > totalCount){
                    //         mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    //     }else{
                    //         mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
                    //     }
                    // }else{
                    //     mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); 
                    // }

                    // 跳转到详情页面
                    mui('.mui-table-view').on('tap', '.patientDetail', function (e) {
                        var patientId = $(this).attr('patientId');
                        sessionStorage.setItem('patientId', patientId);
                        sessionStorage.setItem('roleFlag', 'Calendar');
                        sessionStorage.setItem('scientificResearchLibraryId','');
                        mui.openWindow({
                            url: '../crf/pdmsApp/patient/patientDetail.html',
                            id: '../crf/pdmsApp/patient/patientDetail.html',
                        });
                    });
                } else {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    $("#pullrefresh").hide();
                    $("#noDate").show();
                }
            }
        },
        error: function(xhr, type, errorThrown) {
            console.log(type);
        },
    });
}

mui('.mui-bar').on('tap', '.dynamic', function () {
    mui.openWindow({
        url: '../crf/dynamic/dynamic.html',
        id: '../crf/dynamic/dynamic.html'
    });
});
mui('.mui-bar').on('tap', '.patient', function () {
    var role = sessionStorage.getItem('role');
    if (role == 'PATIENT') {
        sessionStorage.setItem('scientificFlag', '-1');
        mui.openWindow({
            url: '../crf/pdmsApp/patient/patientDetail.html',
            id: '../crf/pdmsApp/patient/patientDetail.html'
        });
    } else {
        sessionStorage.setItem('scientificFlag', '1');
        mui.openWindow({
            url: '../crf/pdmsApp/patient/patientList.html',
            id: '../crf/pdmsApp/patient/patientList.html'
        });
    }
    
});

function formatDate(dateObj) {
    var year = dateObj.getFullYear(),
        month = dateObj.getMonth() + 1,
        day = dateObj.getDate();

    return year+'-'+formatNum(month)+'-'+formatNum(day);
}

function formatNum(num) {
    if (num < 10) {
        num = '0'+num;
    }
    return num;
}

/** 
 * 获取上一个月 
 */ 
function getPreMonth(date) {  
    var arr = date.split('-');  
    var year = arr[0]; //获取当前日期的年份  
    var month = arr[1]; //获取当前日期的月份  
    var day = arr[2]; //获取当前日期的日  
    var days = new Date(year, month, 0);  
    days = days.getDate(); //获取当前日期中月的天数  
    var year2 = year;  
    var month2 = parseInt(month) - 1;  
    if (month2 == 0) {  
        year2 = parseInt(year2) - 1;  
        month2 = 12;  
    }  
    var day2 = day;  
    var days2 = new Date(year2, month2, 0);  
    days2 = days2.getDate();  
    if (day2 > days2) {  
        day2 = days2;  
    }  
    if (month2 < 10) {  
        month2 = '0' + month2;  
    }  
    var t2 = year2 + '-' + month2 + '-' + day2;  
    return t2;  
}  
    
/** 
 * 获取下一个月 
 */          
function getNextMonth(date) {  
    var arr = date.split('-');  
    var year = arr[0]; //获取当前日期的年份  
    var month = arr[1]; //获取当前日期的月份  
    var day = arr[2]; //获取当前日期的日  
    var days = new Date(year, month, 0);  
    days = days.getDate(); //获取当前日期中的月的天数  
    var year2 = year;  
    var month2 = parseInt(month) + 1;  
    if (month2 == 13) {  
        year2 = parseInt(year2) + 1;  
        month2 = 1;  
    }  
    var day2 = day;  
    var days2 = new Date(year2, month2, 0);  
    days2 = days2.getDate();  
    if (day2 > days2) {  
        day2 = days2;  
    }  
    if (month2 < 10) {  
        month2 = '0' + month2;  
    }  
    
    var t2 = year2 + '-' + month2 + '-' + day2;  
    return t2;  
}

function getNoAuthority() {
    var str = '';
    str += '<div class="textCenter" style="background-color:#ddeaf0;margin-top: 210px;text-align: center;">';
    str += '<img src="../crf/assets/image/noAuthority.png" alt="" style="width: 70px;height: 70px;margin-bottom: 20px;"/>';
    str += '<p style="color:#4a4a4a;font-size: 16px;">抱歉！您还未被赋予权限，目前还不能访问该栏目</p>';
    str += '</div>';
    $('body').html(str);
  }