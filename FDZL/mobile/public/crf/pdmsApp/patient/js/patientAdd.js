
mui.ready(function() {
    // 获取病例基本信息
  getPatientInfo();

  //backController();
});

var patientName = '';
function getPatientInfo() {
  var params = 'siteId='+sessionStorage.getItem('siteId')+'&roleId='+sessionStorage.getItem('roleId')+
               '&userId=' +sessionStorage.getItem('userId');
  mui.ajax(path+'patient/getInvestigationPatientBaseInfo.do?' + params + paramsAcc, {
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
          var str = '';

          var baseInfoModuleDefine = data.baseInfoModuleDefine;
          var datas = baseInfoModuleDefine.datas;


          groupCode = data.groupCode;
          groupType = data.groupType;

          patientCode = data.patientCode;
          patientCodeType = data.patientCodeType;

          patientName = data.patientName;

                // 获取第一层数据
          for (var i = 0; i < datas.length; i++) {
              var children = datas[i].children;
              var crfFieldsStr = JSON.stringify(children);
              $('#crfItems').val(crfFieldsStr);

                    // 获取children
              for (var j = 0; j < children.length; j++) {
                  var child = children[j];

                  str += '<li class="mui-table-view-cell">';
                  str += '<div class="ui-flex">';


                  var classStyle = '';

                  if (groupCode == child.moduleDefineCode) {
                      groupValue = child.moduleDefineConstraints[0].moduleDefineConstraintValue;
                            // 随机生成
                      classStyle = 'textRight';

                      str += '<div class="ui-flex-item">';
                      str += '<label>'+child.moduleDefineName+'</label>';
                      str += '</div>';
                      str += '<div class="mui-text-right">';
                      if (groupType == 'RADOM') {
                          str += '<input type="radio" reference="" class="btn-choicecircle" ng-model="'+child.moduleDefineCode+'" ' +
                                    'my-choose-radio="'+child.moduleDefineConstraints[0].moduleDefineConstraintValue+'" ' +
                                    'my-filter="{\'filters\':[]}"';
                          str += 'is-datas = "0" my-disabled="{\'cond\':\'1!=1\',\'reference\':[]}"';
                          str += '/>';
                        } else {
                          str += angularFunctionInput(child, classStyle, -1, false);
                        }
                      str += '</div>';
                    } else if (patientCode == child.moduleDefineCode) {
                        if (patientCodeType == 'Increment' || patientCodeType == 'InvestigationIncrement') {
                            str += '<div class="ui-flex-item">';
                            str += '<label>'+child.moduleDefineName+'</label>';
                            str += '</div>';
                            str += '<div class="mui-text-right">';
                            str += '<label id="system-auto" style="padding-right:15px;">系统自动生成</label>';
                            str += '</div>';
                          }
                      } else {
                        if (child.projectDefine.projectDefineWebType == 'INPUT' ||
                                child.projectDefine.projectDefineWebType == 'RADIO' ||
                                child.projectDefine.projectDefineWebType == 'SELECT') {
                            classStyle = 'textRight';
                          } else if (child.projectDefine.projectDefineWebType == 'CHECKBOX') {
                            classStyle = 'textRight';
                          } else if (child.projectDefine.projectDefineWebType == 'DATETIMEPICKER') {
                              classStyle = 'btn mui-btn-block btnClass textRight';
                            }

                        if (child.unitDefine != '' && child.unitDefine != null && undefined != child.unitDefine) {
                            str += '<div class="ui-flex-item">';
                            str += '<label>'+child.moduleDefineName+'</label>';
                            str += '</div>';
                            str += '<div class="mui-text-right">';
                            str += angularFunctionInput(child, classStyle, -1, false);
                            str += '</div>';


                            str += '<span>'+child.unitDefine.unitDefineValue+'</span>';
                          } else {
                            str += '<div class="ui-flex-item">';
                            str += '<label>'+child.moduleDefineName+'</label>';
                            str += '</div>';
                            str += '<div class="mui-text-right">';
                            str += angularFunctionInput(child, classStyle, -1, false);
                            str += '</div>';
                          }
                      }
                }
            }
          str += '</div>';
          str += '</li>';
          $('#patientList').empty();
          var $div = $(str);
          $('#patientList').append($div);
          angular.element(document.body).injector().invoke(function($compile) {
              var scope = angular.element($div).scope();
              $compile($div)(scope);
            });

          alertDatePick();
          delUploadImage();
          addImgUpload();
        }
    },
    error: function(xhr, type, errorThrown) {
            // 异常处理；
      console.log(type);
    },
  });
}


// 保存病例
mui('.mui-content').on('tap', '.savePatient', function(e) {
  $('input').blur();
  $('.savePatient').prop('disabled', true);
  var completed = $('#completed').val();
  var isCompleted = true;
  if (!$('#setCompleted').attr('checked') && completed == 'completed') {
    isCompleted = false;
  }
  if (isCompleted == true) {
    var requiredTips = '';
    $('.isRequired').each(function () {
      var ngModel_code = $(this).attr('ng-model');
      var value = angular.element(document.getElementById('savePatientData')).scope().getDataValue_crf(ngModel_code);
      if (typeof value == 'object') {
          value = undefined;
        }
      if (value == '[object Object]') { value = undefined; }
      if (value == null || value == undefined || value == 'undefined' || $.trim(value) == '' || value == '') {
          var moduleDefineName = $(this).attr('moduleDefineName');
          var tip = moduleDefineName+'不能为空';

          if (requiredTips.indexOf(tip) > -1) {

            } else {
              requiredTips += $(this).attr('moduleDefineName')+'不能为空' + '<br>';
            }
        }
    });
    if (requiredTips != null && requiredTips != undefined && $.trim(requiredTips) != '') {
      mui.alert(requiredTips, '提示');
      $('.savePatient').prop('disabled', false);
      return false;
    }
  }

  $('.mui-table-view-cell').each(function () {
    var name = $(this).children().eq(1).children().html();
    var nameVal = $(this).children().eq(2).children().val();
  });


  // var nameVal = angular.element(document.getElementById('savePatientData')).scope().getDataValue_crf(patientName);
  // if (nameVal != '' && nameVal != null && undefined != nameVal) {
  //   var REG_DEFINE_VALUE = /^[A-Za-z]+$/;

  //   if (nameVal.length != 4) {
  //     mui.alert('姓名拼音缩写只能输入四位字母');
  //     $('.savePatient').prop('disabled', false);
  //     return false;
  //   }

  //   if (!new RegExp(REG_DEFINE_VALUE).test(nameVal)) {
  //     mui.alert('姓名拼音缩写只能输入字母');
  //     $('.savePatient').prop('disabled', false);
  //     return false;
  //   }
  // }

  // var mobileCode = 'INDICATOR_1_9T';
  // var _mobileValue = angular.element(document.getElementById('saveData')).scope().getDataValue_crf(mobileCode);
  // if (_mobileValue != null && _mobileValue != '' && _mobileValue != undefined && !(cellphone.test(_mobileValue))) {
  //   mui.alert('手机号格式错误请重新输入');
  //   $('.savePatient').prop('disabled', false);
  //   return false;
  // }

  var crfItemsStr = $('#crfItems').val();
  console.log(crfItemsStr);
  var crfItems = JSON.parse(crfItemsStr);
  var data = '';
  for (var i = 0; i < crfItems.length; i++) {
    var moduleDefine = crfItems[i];
    var moduleDefineCode = moduleDefine.moduleDefineCode;
    var moduleDefineId = moduleDefine.moduleDefineId;
    var isVirtual = moduleDefine.moduleDefineIsVirtual;
    errorMsgProcess(moduleDefineCode);
    if (isVirtual == '0') {
            // var value = $scope.getDataValue(moduleDefineCode)
      var value = angular.element(document.getElementById('savePatientData')).scope().getDataValue_crf(moduleDefineCode);
      if (groupCode == moduleDefineCode) {
          if (groupType == 'RADOM') {
              var _ary = groupValue.split('^');
              value = _ary[Math.floor(Math.random() * _ary.length + 1) - 1];
            }
        }
      if (typeof value == 'object') { value = undefined; }
      if (value != null && value != undefined) {
          data += 'indicators['+moduleDefineCode+'].moduleDefineId='+moduleDefineId+'&';
          // if (patientName == moduleDefineCode) {
          //     data += 'indicators['+moduleDefineCode+'].value='+encodeURIComponent(value.toUpperCase())+'&';
          //   } else {
          //     data += 'indicators['+moduleDefineCode+'].value='+encodeURIComponent(value)+'&';
          //   }
          data += 'indicators['+moduleDefineCode+'].value='+encodeURIComponent(value)+'&';
          data += 'indicators['+moduleDefineCode+'].batchId=-1&';
          data += 'indicators['+moduleDefineCode+'].rowNum=1&';
          data += 'indicators['+moduleDefineCode+'].content=""&';
          data += 'indicators['+moduleDefineCode+'].operationType=insert&';
        }
    }
  }
  var paramValue = data + 'siteId='+sessionStorage.getItem('siteId')+'&roleId='+sessionStorage.getItem('roleId')+
                    '&userId=' +sessionStorage.getItem('userId') + paramsAcc;
  mui.ajax({
    url: path+'patient/addPatient.do?',
		context: this,
		type: "post",
		data: paramValue,
		dataType: "json",
		cache: "false",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    success: function(data) {
      if (data.error) {
        if(data.error == 'UnbindUser'){
          unbindUser();
        }
          mui.toast(data.error);
          $('.savePatient').prop('disabled', false);
        } else {
          mui.toast('保存成功');
          setTimeout(function() {
            mui.openWindow({
                url: 'patientList.html',
                id: 'patientList.html',
              });
          }, 1500);
        }
    },
    error: function(xhr, type, errorThrown) {
            // 异常处理；
      console.log(type);
      $('.savePatient').prop('disabled', false);
    },
  });
});


function putDateValue(value, moduleDefineCode, rowNum) {
  if (rowNum == -1) {
    angular.element(document.getElementById('saveData')).scope().setDataValue_crf(moduleDefineCode, value, 'TEXT');
  } else {
    angular.element(document.getElementById('saveData')).scope().setDataValue_crf(moduleDefineCode+'_'+rowNum, value, 'TEXT');
  }
}

function errorMsgProcess(moduleDefineCode) {
  var errorMsg = angular.element(document.getElementById('saveDataError')).scope().getDataValue_crfErrorMsg(moduleDefineCode);
  if (errorMsg != undefined) {
    mui.alert(errorMsg);
    throw new Error(errorMsg);
  }
}
