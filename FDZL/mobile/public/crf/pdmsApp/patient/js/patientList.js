
mui.ready(function () {
  var aId = sessionStorage.getItem('acctId');
  if (aId == '' || aId == undefined || aId == null || aId == 'null') {
    mui.openWindow({
      url: '/BindAccount',
      id: '/BindAccount'
    });
  } else {
    jssDk();
  }
});

function jssDk() {
  mui.ajax(path + 'jssdk.do?url=' + window.location.href + '&curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid'), {
    data: {},
    dataType: 'json', // 服务器返回json格式数据
    type: 'post', // HTTP请求类型
    success: function (data) {
      if (data.error) {
        if (data.error == 'UnbindUser') {
          unbindUser();
        }
        mui.alert(data.error, '提示');
      } else {
        var role = sessionStorage.getItem('role');
        if (!role) {
          var url = encodeURIComponent(location.href);
          location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + data.appId +
            '&redirect_uri=' + path + 'oauth.do?url=' + window.location.href + '&response_type=code&scope=snsapi_userinfo&state=HDWX#wechat_redirect';
          return false;
        }

        var urlParams = location.search; //获取url中"?"符后的字串 区别科研库和随访
        var _urlParams = "";
        if (urlParams.indexOf("?") != -1) {
          var strs = urlParams.substr(1).split("&");
          _urlParams = unescape(strs[0].split("=")[1]);
          if (_urlParams != '') {
            sessionStorage.setItem('scientificFlag', '1');
          } else {
            sessionStorage.setItem('scientificFlag', '');
          }
        }

        var scientificFlag = sessionStorage.getItem('scientificFlag');
        if (scientificFlag == '1' || scientificFlag == '-1' || _urlParams == 'NOTSCIENTIFIC') {
          sessionStorage.setItem('scientificResearchLibraryId', '');
          titleController('病例记录');
          $("#pullrefresh").css('margin-top', '35px');
          $("#scientificId").hide();
          queryBaseParamByUserId();
          getRoleNav();
        } else {
          if (sessionStorage.getItem('role') == 'DOCTOR') {
            titleController('科研库');
            $("#pullrefresh").css('margin-top', '85px');
            $("#scientificId").show();
            getScientific();
            $('#navId,#showUserPicker,.plusIcon').hide();
          } else {
            titleController('提示');
            getNoAuthority();
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

function getNoAuthority() {
  var str = '';
  str += '<div class="textCenter" style="background-color:#ddeaf0;margin-top: 210px;">';
  str += '<img src="../../assets/image/noAuthority.png" alt="" style="width: 70px;height: 70px;margin-bottom: 20px;"/>';
  var scientificFlag = sessionStorage.getItem('scientificFlag');
  if (scientificFlag == '') {
    //科研库
    str += '<p style="color:#4a4a4a;font-size: 16px;">抱歉！您没有该栏目访问权限</p>';
  } else {
    //随访
    str += '<p style="color:#4a4a4a;font-size: 16px;">抱歉！您还未被赋予权限，目前还不能访问该栏目</p>';
  }
 
  str += '</div>';
  $('#noAuthority').html(str);
}

function getScientific() {
  var doctorGroupArr = [];
  var curYdataAccountId = sessionStorage.getItem('acctId');
  mui.ajax(path + 'department/queryScientificResearchLibraryByAccountId.do?ydataAccountId=' + curYdataAccountId + '&curYdataAccountId=' + curYdataAccountId + '&openid=' + sessionStorage.getItem('openid'), {
    data: {},
    dataType: 'json', // 服务器返回json格式数据
    type: 'post', // HTTP请求类型
    success: function (data) {
      if (data.error) {
        if (data.error == 'UnbindUser') {
          unbindUser();
        }
        mui.alert(data.error, '提示');
      } else {
        var groupList = data.list;
        if (groupList != '' && groupList != null && groupList != undefined) {
          $("#srl").html(groupList[0].scientificResearchLibraryName);
          sessionStorage.setItem('scientificResearchLibraryId', groupList[0].scientificResearchLibraryId);
          for (var i = 0; i < groupList.length; i++) {
            var siteId = groupList[i].scientificResearchLibraryId,
              groupName = groupList[i].scientificResearchLibraryName;

            var doctorGroupClass = {
              'value': siteId,
              'text': groupName
            }

            doctorGroupArr.push(doctorGroupClass);
          }
          var userPicker = new mui.PopPicker();
          userPicker.setData(doctorGroupArr);
          var showUserPickerButton = document.getElementById('srl');
          showUserPickerButton.addEventListener('tap', function (event) {
            userPicker.show(function (items) {
              mui.toast('切换科研库成功');
              offset = 0;
              $("#srl").html(items[0].text);
              sessionStorage.setItem('scientificResearchLibraryId', items[0].value);
              setTimeout(function () {
                getPatientList();
              }, 1000);
            });
          }, false);
          queryBaseParamByUserId();
        } else {
          titleController('提示');
          getNoAuthority();
        }
      }
    },
    error: function(xhr, type, errorThrown) {
      // 异常处理；
      console.log(type);
    },
  });
}

function getRoleNav() {
  var role = sessionStorage.getItem('role');
  var str = '';
  if (role == 'PATIENT') {
    str += '<a class="mui-tab-item menu-item calendar" target="home ">';
    str += '<span class="mui-tab-label">日历</span>';
    str += '</a>';
    str += '<a class="mui-tab-item menu-item mui-active patient" target="search">';
    str += '<span class="mui-tab-label">病例记录</span>';
    str += '</a>';
  } else {
    str += '<a class="mui-tab-item menu-item calendar" target="home ">';
    str += '<span class="mui-tab-label">日历</span>';
    str += '</a>';
    str += '<a class="mui-tab-item menu-item dynamic" target="patientManager">';
    str += '<span class="mui-tab-label ">';
    str += '动态</span>';
    str += '</a>';
    str += '<a class="mui-tab-item menu-item mui-active patient" target="search">';
    str += '<span class="mui-tab-label">病例记录</span>';
    str += '</a>';
  }

  $("#navId").html(str);
  if (role != 'PATIENT') {
    queryVisitDynamic();
  }
}


function queryBaseParamByUserId() {
  var params = 'acctId=' + sessionStorage.getItem('acctId') + '&curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid');
  mui.ajax(path + 'project/queryBaseParamByUserId.do?' + params, {
    data: {},
    dataType: 'json', // 服务器返回json格式数据
    type: 'post', // HTTP请求类型
    success: function (data) {
      if (data.error) {
        if (data.error == 'UnbindUser') {
          unbindUser();
        }
        if(data.error == '未指定医生组' || data.error == '获取角色信息失败'){
          getNoAuthority();
          return false;
        }
        mui.toast(data.error);
      } else {
        var investigationId = data.investigationId;
        var siteId = data.siteId;
        if (siteId == '' || siteId == null || siteId == undefined) {
          mui.openWindow({
            url: 'switchDoctor.html',
            id: 'switchDoctor.html'
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

        var urlParams = location.search; //获取url中"?"符后的字串 区别科研库和随访
        var _urlParams = "";
        if (urlParams.indexOf("?") != -1) {
          var strs = urlParams.substr(1).split("&");
          _urlParams = unescape(strs[0].split("=")[1]);
          if (_urlParams != '') {
            sessionStorage.setItem('scientificFlag', '1');
          } else {
            sessionStorage.setItem('scientificFlag', '');
          }
        }
        
        var scientificFlag = sessionStorage.getItem('scientificFlag');
        if (scientificFlag == '1' || scientificFlag == '-1' || _urlParams == 'NOTSCIENTIFIC') {
          getDoctorGroup();
        } 

        getPatientList();

        getSdv();
      }
    },
    error: function(xhr, type, errorThrown) {
      // 异常处理；
      console.log(type);
    },
  });
}

function getDoctorGroup() {
  var doctorGroupArr = [];
  var curYdataAccountId = sessionStorage.getItem('acctId');
  mui.ajax(path + 'user/queryDoctorGroupListByAcctId.do?curYdataAccountId=' + curYdataAccountId + '&openid=' + sessionStorage.getItem('openid'), {
    data: {},
    dataType: 'json', // 服务器返回json格式数据
    type: 'post', // HTTP请求类型
    success: function (data) {
      if (data.error) {
        if (data.error == 'UnbindUser') {
          unbindUser();
        }
        mui.alert(data.error, '提示');
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
                var defaultPatams = 'siteId=' + items[0].value + '&roleId=' + items[0].roleId + '&userId=' + sessionStorage.getItem('userId') +
                  '&curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid');
                mui.ajax(path + 'project/saveDefaultLogin.do?' + defaultPatams, {
                  data: {},
                  dataType: 'json', // 服务器返回json格式数据
                  type: 'post', // HTTP请求类型
                  success: function (data) {
                    if (data.error) {
                      if (data.error == 'UnbindUser') {
                        unbindUser();
                      }
                      mui.alert(data.error, '提示');
                    } else {
                      mui.toast('切换医生组成功');
                      setTimeout(function () {
                        mui.openWindow({
                          url: 'patientList.html',
                          id: 'patientList.html'
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
          } else {
            $('#showUserPicker').hide();
          }
        } else {
          $('#showUserPicker').hide();
        }

      }
    },
    error: function(xhr, type, errorThrown) {
      // 异常处理；
      console.log(type);
    },
  });

}

$('#key').bind('keypress', function (event) {
  if (event.keyCode == "13") {
    offset = 0;
    getPatientList();
  }
});

function getPatientList() {
  var statusMap = [];
  statusMap['全部'] = '-1';
  statusMap['未录入'] = 'NEW';
  statusMap['录入中'] = 'RECOREDING';
  statusMap['已完成'] = 'COMPLETED';
  statusMap['提交中'] = 'COMMITING';
  statusMap['已提交'] = 'COMMITED';
  statusMap['清理中'] = 'CLEARING';
  statusMap['已清理'] = 'CLEARED';
  statusMap['已入组'] = 'ENTERED';
  statusMap['随访中'] = 'FOLLOWUP';
  statusMap['已取消'] = 'CANCELLED';


  var sdvStatusMap = [];
  sdvStatusMap['全部'] = '-1';
  sdvStatusMap['未SDV'] = 'UNSDV';
  sdvStatusMap['SDV中'] = 'SDVING';
  sdvStatusMap['已SDV'] = 'SDVEND';

  var keyValue = $('#key').val();
  var crfStatus = $.trim($('#statusContent').html());

  var statusValue = '-1';
  var sdvStatusValue = '-1';

  var status = '';
  var sdvStatus = '';
  if (crfStatus != '全部' && crfStatus != 'CRF状态') {
    status = crfStatus.substring(0, 3);
    if (status != '') {
      for (var statusKey in statusMap) {
        statusValue = statusMap[status];
      }
    }

    sdvStatus = crfStatus.substring(3, 7);
    if (sdvStatus != '') {
      for (var sdvStatusKey in sdvStatusMap) {
        sdvStatusValue = sdvStatusMap[sdvStatus];
      }
    }
  } else {
    statusValue = '-1';
    sdvStatusValue = '-1';
  }
  var searchPatientsParams = 'patientName=' + keyValue + '&status=' + statusValue + '&siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
    '&userId=' + sessionStorage.getItem('userId') + '&offset=' + (offset * 1 + 1 * 1) + '&limit=10&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');
  mui.ajax(path + 'patient/searchPatients.do?' + searchPatientsParams + paramsAcc, {
    data: {},
    dataType: 'json', // 服务器返回json格式数据
    type: 'post', // HTTP请求类型
    timeout: 10000, // 超时时间设置为10秒；
    success: function (data) {
      if (data.error) {
        if (data.error == 'UnbindUser') {
          unbindUser();
        }
        mui.alert(data.error, '提示');
      } else {
        var str = '';
        if (data.datas.datas.length * 1 > 0) {
          for (var i = 0; i < data.datas.datas.length; i++) {
            str += '<li class="mui-table-view-cell patientDetail" patientId="' + data.datas.datas[i].patientId + '">';
            str += '<a class="mui-navigate-right mui-slider-handle">';
            str += '<div class="mui-row">';
            str += '<div class="mui-col-sm-3 mui-col-xs-3">';
            if (data.datas.datas[i].patientName != '') {
              str += data.datas.datas[i].patientName;
            } else {
              str += '未填写';
            }
            str += '</div>';
            str += '<div class="mui-col-sm-6 mui-col-xs-6">';
            if (data.datas.datas[i].hospitalizationNumber != undefined) {
              var hospitalizationNumber = data.datas.datas[i].hospitalizationNumber.datas[0];
              if (hospitalizationNumber != '' && hospitalizationNumber != undefined && hospitalizationNumber != null) {
                str += '|&nbsp;&nbsp;' + hospitalizationNumber.value;
              } else {
                str += '|&nbsp;&nbsp;';
              }
            } else {
              str += '|&nbsp;&nbsp;';
            }


            str += '</div>';

            var statusName = data.datas.datas[i].statusName;
            var sdvStatusName = data.datas.datas[i].sdvStatusName;
            var sdvType = data.sdvType;
            str += '<div class="mui-col-sm-3 mui-col-xs-3" style="text-align: right;padding-right: 15px;">';
            str += statusName;
            str += '</div>';

            str += '</div>';
            str += '</a>';

            str += '<div class="mui-slider-right mui-disabled">';
            str += '<a class="mui-btn mui-btn-red access_control" accesscontrolkey="deletePatient_btn" status="' + data.datas.datas[i].status + '" patientUserId="' + data.datas.datas[i].userId + '" patientId="' + data.datas.datas[i].patientId + '">删除</a>';
            str += '<a class="mui-btn mui-btn-green access_control" accesscontrolkey="commitPatient_btn" patientId="' + data.datas.datas[i].patientId + '">提交</a>';
            str += '</div>';
            str += '</li>';
          }

          $('#patientList').html(str);
          $("#scrollPatientNoData").hide();
          $("#patientList").show();
          //mui('#pullrefresh').pullRefresh().scrollTo(0,0,100);
          $('.scrollPatient').css({ transform: 'translate3d(0px, 0px, 0px) translateZ(0px)' });

          offset = (offset * 1 + 1 * 1);

          var totalCount = data.totalCount;
          if (offset * 10 >= totalCount) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
          } else {
            mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
          }

          // 权限
          var scientificFlag = sessionStorage.getItem('scientificFlag');
          if (scientificFlag == '') {
            $('.access_control').each(function () {
              $(this).hide();
            });
          } else {
            accessControl();
          }


          // 跳转到详情页面
          mui('.mui-table-view').on('tap', '.patientDetail', function (e) {
            var patientId = $(this).attr('patientId');
            sessionStorage.setItem('patientId', patientId);
            var roleFlag = sessionStorage.getItem('roleFlag');
            if (roleFlag == 'Calendar') {
              sessionStorage.setItem('roleFlag', '');
            }


            mui.openWindow({
              url: 'patientDetail.html',
              id: 'patientDetail.html',
            });
          });

          // 提交病例
          mui('.mui-disabled').on('tap', '.mui-btn-green', function (e) {
            var val = $(this).attr('patientId');

            commitPatients(val);
          });

          // 删除病例
          mui('.mui-disabled').on('tap', '.mui-btn-red', function (e) {
            var val = $(this).attr('patientId');
            var patientUserId = $(this).attr('patientUserId');
            var status = $(this).attr('status');
            deletePatient(val, patientUserId, status);
          });
        } else {
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
          $("#patientList").hide();
          $('#scrollPatientNoData').show();
          $('.scrollPatient').html(noData());
        }
      }
    },
    error: function (xhr, type, errorThrown) {
      // 异常处理；
      console.log(type);
    },
  });
}

function getSdv() {
  var str = '';

  str += '<li class="mui-table-view-cell stateLi">';
  str += '全部';
  str += '<img class="tick" src="../../assets/image/tick.png" />';
  str += '</li>';

  str += '<li class="mui-table-view-cell stateLi">';
  str += '未录入';
  str += '<img class="tick" src="../../assets/image/tick.png" />';
  str += '</li>';

  str += '<li class="mui-table-view-cell stateLi">';
  str += '录入中';
  str += '<img class="tick" src="../../assets/image/tick.png" />';
  str += '</li>';

  str += '<li class="mui-table-view-cell stateLi">';
  str += '已完成';
  str += '<img class="tick" src="../../assets/image/tick.png" />';
  str += '</li>';

  str += '<li class="mui-table-view-cell stateLi">';
  str += '已提交';
  str += '<img class="tick" src="../../assets/image/tick.png" />';
  str += '</li>';

  str += '<li class="mui-table-view-cell stateLi">';
  str += '提交中';
  str += '<img class="tick" src="../../assets/image/tick.png" />';
  str += '</li>';

  $('#statusId').html(str);

  $('#topPopover').css('height', $('.stateLi').length * 50 - 40 + 'px');

  mui('.mui-popover').on('tap', '.stateLi', function (e) {
    offset = 0;
    $('.tick').hide();
    $(this).find('.tick').show();
    $('.stateLi').removeClass('colorBlue');
    $(this).addClass('colorBlue');
    $('#statusContent').html($(this)[0].innerText);
    $('.mui-popover').removeClass('mui-active');
    $('.mui-popover').hide();
    $('.mui-backdrop').hide();

    getPatientList();
  });
}


// 提交病例

function commitPatients(patientId) {
  var btnArray = ['否', '是'];
  mui.confirm('请确认该病例所有访视已结束，并完成所有数据录入工作。提交后无法修改数据！是否提交病例的所有访视?', '提示', btnArray, function (e) {
    if (e.index == 1) {
      offset = 0;
      var commitPatientsParams = 'patientIds=' + patientId + '&siteId=' + sessionStorage.getItem("siteId") +
        '&roleId=' + sessionStorage.getItem("roleId") + '&userId=' + sessionStorage.getItem("userId");
      mui.ajax(path + 'patient/commitPatients.do?' + commitPatientsParams + paramsAcc, {
        data: {},
        dataType: 'json', // 服务器返回json格式数据
        type: 'post', // HTTP请求类型
        timeout: 10000, // 超时时间设置为10秒；
        success: function (data) {
          if (data.error) {
            if (data.error == 'UnbindUser') {
              unbindUser();
            }
            mui.alert(data.error, '提示');
          } else {
            var status = data.status;
            var countSucc = data.countSucc;
            if (status == 1) {
              if (countSucc > 0) {
                mui.toast('病例提交成功');
                setTimeout(function () {
                  offset = 0;
                  getPatientList();
                }, 1500);
              } else {
                mui.alert('未提交的病例可能CRF状态非已完成或者CRF未SDV或者有未关闭的质询', '提示');
              }
            } else {
              mui.alert('病例提交失败', '提示');
            }
          }
        },
        error: function(xhr, type, errorThrown) {
          // 异常处理；
          console.log(type);
        },
      });
    } else {
      offset = 0;
      getPatientList();
    }
  });
}

// 删除病例
function deletePatient(patientId, patientUserId, status) {
  var btnArray = ['否', '是'];
  mui.confirm('确定删除当前病例？', '提示', btnArray, function (e) {
    if (e.index == 1) {
      offset = 0;
      var deletePatientsParams = 'patientStatus[' + patientUserId + ']=' + status + '&patientIds=' + patientId +
        '&siteId=' + sessionStorage.getItem("siteId") +
        '&roleId=' + sessionStorage.getItem("roleId") + '&userId=' + sessionStorage.getItem("userId");
      var paramsAcc = '&curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid');
      mui.ajax(path + 'patient/deletePatients.do?' + deletePatientsParams + paramsAcc, {
        data: {},
        dataType: 'json', // 服务器返回json格式数据
        type: 'post', // HTTP请求类型
        timeout: 10000, // 超时时间设置为10秒；
        success: function (data) {
          if (data.error) {
            if (data.error == 'UnbindUser') {
              unbindUser();
            }
            mui.alert(data.error, '提示');
          } else {
            var status = data.status;
            var countSucc = data.countSucc;
            if (status == 1) {
              if (countSucc > 0) {
                mui.toast('病例删除成功');
                setTimeout(function () {
                  offset = 0;
                  getPatientList();
                }, 1500);
              } else {
                mui.alert('病例删除失败,病例中包含已提交或已清理的访视', '提示');
              }
            } else {
              mui.alert('病例删除失败', '提示');
            }
          }
        },
        error: function(xhr, type, errorThrown) {
          // 异常处理；
          console.log(type);
        },
      });
    } else {
      offset = 0;
      getPatientList();
    }
  });
}


