mui.ready(function () {
    getPatientInfo();

    //backController();

});

var patientCode;
var patientNameCode;
var groupCode;
var groupType;

//获取病例基本信息页面元素
function getPatientInfo() {
    mui.ajax(path + 'patient/getInvestigationPatientBaseInfo.do?' + params + paramsAcc, {
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
                var str = '';

                var baseInfoModuleDefine = data.baseInfoModuleDefine;
                var datas = baseInfoModuleDefine.datas;

                patientCode = data.patientCode;
                patientNameCode = data.patientName;
                patientCodeType = data.patientCodeType;

                groupCode = data.groupCode;
                groupType = data.groupType;



                //获取第一层数据
                for (var i = 0; i < datas.length; i++) {

                    var notInSameModuleCodesStr = "";
                    var _notSameModuleAry = datas[i].notInSameModuleCodes;
                    for (var m = 0; m < _notSameModuleAry.length; m++) {
                        var _code = _notSameModuleAry[m].replace("%s", "");
                        if (m == _notSameModuleAry.length - 1) {
                            notInSameModuleCodesStr += _code;
                        } else {
                            notInSameModuleCodesStr += _code + ",";
                        }
                    }

                    var children = datas[i].children;
                    var crfFieldsStr = "";


                    //获取children
                    for (var j = 0; j < children.length; j++) {
                        var child = children[j];
                        var moduleDefineCode = child.moduleDefineCode;
                        crfFieldsStr += moduleDefineCode + ",";
                        var moduleDefineName = child.moduleDefineName;


                        str += '<li class="mui-table-view-cell">';
                        str += '<div class="ui-flex">';


                        if (groupCode == child.moduleDefineCode) {
                            groupValue = child.moduleDefineConstraints[0].moduleDefineConstraintValue;
                            //随机生成
                            classStyle = 'textRight';

                            str += '<div class="ui-flex-item" id="info_' + child.moduleDefineCode + '">';
                            str += '<label>' + child.moduleDefineName + '</label>';
                            str += '</div>';
                            str += '<div class="mui-text-right">';
                            if (groupType == "RADOM") {
                                str += '<label type="radio" reference="" class="btn-choicecircle" ng-model="' + child.moduleDefineCode + '" ' +
                                    'my-choose-radio="' + child.moduleDefineConstraints[0].moduleDefineConstraintValue + '" ' +
                                    'my-filter="{\'filters\':[]}"';
                                str += 'is-datas = "0" my-disabled="{\'cond\':\'1!=1\',\'reference\':[]}"';
                                str += "/>";
                            } else {
                                str += angularFunctionInput(child, classStyle, -1, false);
                            }
                            str += '</div>';

                        } else if (patientCode == child.moduleDefineCode) {
                            str += '<div class="ui-flex-item" id="info_' + child.moduleDefineCode + '">';
                            str += '<label>' + child.moduleDefineName + '</label>';
                            str += '</div>';
                            str += '<div class="mui-text-right">';
                            if (patientCodeType == "Increment" || patientCodeType == "InvestigationIncrement") {

                                str += '<my-span class="crf-table-inner-input txt-gray" type="' + child.projectDefineDataFormat.projectDefineDataType + '" ng-readonly="true" is-datas="0" my-model ';
                                str += 'ng-model="' + child.moduleDefineCode + '"></my-span>';

                            } else {
                                str += angularFunctionInput(child, '', -1, false);
                            }

                            str += '</div>';
                        } else {
                            if ("" != child.unitDefine && null != child.unitDefine && undefined != child.unitDefine) {
                                str += '<div class="ui-flex-item" id="info_' + child.moduleDefineCode + '">';
                            } else {
                                str += '<div class="ui-flex-item" id="info_' + child.moduleDefineCode + '">';
                            }

                            str += '<label>' + child.moduleDefineName + '</label>';
                            str += '</div>';
                            str += '<div class="mui-text-right">';
                            //str += '<label>'+angularFunctionInput_onlyView(child,"indicator",-1,false)+'</label>';

                            if (child.projectDefineWebType == "DATETIMEPICKER") {
                                str += angularFunctionInput(child, "btn btnClass mui-btn-block textRight", -1);
                            } else {
                                str += angularFunctionInput(child, "btn mui-btn-block textRight", -1);
                            }

                            str += ' </div>';
                            if ("" != child.unitDefine && null != child.unitDefine && undefined != child.unitDefine) {
                                str += '<div>';
                                str += '<span>' + child.unitDefine.unitDefineValue + '</span>';
                                str += '</div>';
                            }
                        }

                        str += '</div>';
                        str += '</li>';

                    }

                }

                $("#crfItems").val(crfFieldsStr);
                $("#notInSameModuleCodes").val(notInSameModuleCodesStr);

                var $div = $(str);
                $("#patientList").append($div);
                parseScope($div);

                // 权限
                var scientificFlag = sessionStorage.getItem('scientificFlag');
                if(scientificFlag == ''){
                    $('.access_control').each(function(){
                    $(this).hide();
                    });
                }else{
                    accessControl();
                }

                alertDatePick();
                delUploadImage();
                addImgUpload();

                $("#setDataValue").click();
            }
        },
        error: function (xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        }
    });
}


//修改病例基本信息
function modifyPatientData() {

    $("#modalHtml").empty();
    var completed = $("#completed").val();
    var isCompleted = true;
    /*if (!$("#setCompleted").attr("checked")&&completed=="completed") {
        isCompleted = false;
    }*/
    if (isCompleted == true) {
        var requiredTips = "";
        $(".isRequired").each(function () {
            var ngModel_code = $(this).attr("ng-model");
            var value = angular.element(document.getElementById('saveData')).scope().getDataValue_crf(ngModel_code);
            if (typeof value == "object") {
                value = undefined;
            }
            if (value == "[object Object]") { value = undefined; }
            if (value == null || value == undefined || value == "undefined" || $.trim(value) == "" || (typeof value != 'number' && value == "")) {
                var moduleDefineName = $(this).attr("moduleDefineName");
                var tip = moduleDefineName + "不能为空";
                if (requiredTips.indexOf(tip) > -1) {

                } else {
                    requiredTips += $(this).attr("moduleDefineName") + "不能为空" + "<br>";
                }
            }
        })
        if (requiredTips != null && requiredTips != undefined && $.trim(requiredTips) != "") {
            mui.alert(requiredTips, '提示');
            return false;
        }
    }

    // var nameVal = angular.element(document.getElementById('saveData')).scope().getDataValue_crf(patientNameCode);
    // if ("" != nameVal && null != nameVal && undefined != nameVal) {
    //     var REG_DEFINE_VALUE = /^[A-Za-z]+$/;
    //     if (nameVal.length != 4) {
    //         mui.alert("姓名拼音缩写只能输入四位字母");
    //         $(".savePatient").prop("disabled", false);
    //         return false;
    //     }

    //     if (!new RegExp(REG_DEFINE_VALUE).test(nameVal)) {
    //         mui.alert("姓名拼音缩写只能输入字母");
    //         return false;
    //     }
    // }

    // var mobileCode = "INDICATOR_1_9T";
    // var _mobileValue = angular.element(document.getElementById('saveData')).scope().getDataValue_crf(mobileCode);
    // if (_mobileValue != null && _mobileValue != "" && _mobileValue != undefined && !(cellphone.test(_mobileValue))) {
    //     mui.alert("手机号格式错误请重新输入");
    //     return false;
    // }

    var crfItemsStr = $("#crfItems_two").val();
    if (crfItemsStr == null || crfItemsStr == undefined) {
        crfItemsStr = crfItems_two_All;
    }
    var crfItems = JSON.parse(crfItemsStr);


    var data = "";
    for (var i = 0; i < crfItems.length; i++) {
        var moduleDefine = crfItems[i];
        var moduleDefineCode = moduleDefine.moduleDefineCode;
        var moduleDefineId = moduleDefine.moduleDefineId;
        var type = moduleDefine.operationType;
        var isVirtual = moduleDefine.moduleDefineIsVirtual;
        var isDatas = moduleDefine.moduleDefineIsDatas;

        var isCondauto = false;
        if (groupCode == moduleDefineCode) {
            if (groupType == "CONDAUTO") {
                isCondauto = true;
            }
        }
        if (isVirtual == "0" && isDatas != "1" && !isCondauto) {
            // var value = $scope.getDataValue(moduleDefineCode)
            var value = angular.element(document.getElementById('saveData')).scope().getDataValue_crf(moduleDefineCode);
            var remarkValue = $("#remark_" + moduleDefineCode).val();
            if (type == "insert") {
                if (typeof value == "object") { value = undefined; }
                if (value == "[object Object]") { value = undefined; }
                if (value != null && value != undefined && value != 'undefined') {
                    data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
                    // if (patientNameCode == moduleDefineCode) {
                    //     data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value.toUpperCase()) + '&';
                    // } else {
                    //     data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
                    // }
                    data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
                    data += 'indicators[' + moduleDefineCode + '].batchId=-1&';
                    data += 'indicators[' + moduleDefineCode + '].rowNum=&';
                    data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
                    if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
                        data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
                    } else {
                        data += 'indicators[' + moduleDefineCode + '].comment=&';
                    }
                } else {
                    if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
                        data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
                        data += 'indicators[' + moduleDefineCode + '].value=&';
                        data += 'indicators[' + moduleDefineCode + '].batchId=-1&';
                        data += 'indicators[' + moduleDefineCode + '].rowNum=&';
                        data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
                        data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
                    }
                }
            } else if (type == "update") {
                if (value == null) {
                    value = "";
                }
                if (typeof value == "object") { value = undefined; }
                if (value == "[object Object]") { value = undefined; }
                if (value != undefined && value != 'undefined') {
                    data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
                    // if (patientNameCode == moduleDefineCode) {
                    //     data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value.toUpperCase()) + '&';
                    // } else {
                    //     data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
                    // }
                    data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
                    data += 'indicators[' + moduleDefineCode + '].batchId=-1&';
                    var rowNum = map_rowNum[moduleDefineCode];
                    data += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
                    data += 'indicators[' + moduleDefineCode + '].operationType=update&';
                    if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
                        data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
                    } else {
                        data += 'indicators[' + moduleDefineCode + '].comment=&';
                    }
                } else {
                    if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
                        data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
                        data += 'indicators[' + moduleDefineCode + '].value=&';
                        data += 'indicators[' + moduleDefineCode + '].batchId=-1&';
                        var rowNum = map_rowNum[moduleDefineCode];
                        data += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
                        data += 'indicators[' + moduleDefineCode + '].operationType=update&';
                        data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
                    }
                }
            }
        }
    }
    var isCompleted = false;
    if ($("#setCompleted").attr("checked")) {
        isCompleted = true;
    }
    var paramValue = data + 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
        '&userId=' + sessionStorage.getItem('userId') + "&visitId=-1&patientId=" + patientId + 
        "&currentModuleDefineId=&isCompleted=" + isCompleted + paramsAcc;

    mui.ajax({
        url: path + 'crf/modifyPatientData_interface.do?',
		context: this,
		type: "post",
		data: paramValue,
		dataType: "json",
		cache: "false",
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        success: function (data) {
            if (data.error) {
                if(data.error == 'UnbindUser'){
                    unbindUser();
                  }
                mui.alert(data.error, '提示');
            } else {
                mui.toast("保存成功");
                setTimeout(function () {
                    mui.openWindow({
                        url: 'patientDetail.html',
                        id: 'patientDetail.html'
                    });
                }, 1500);
            }
        },
        error: function (xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        }
    });
}




function parseScope($div) {
    angular.element(document.body).injector().invoke(function ($compile) {
        var scope = angular.element($div).scope();
        $compile($div)(scope);
    });
}


// function backController() {
//     pushHistory();
// }

// window.addEventListener("popstate", function (e) {
//     doGetBackIndexValue();
// }, false);

// function doGetBackIndexValue() {
//     mui.openWindow({
//         url: 'patientDetail.html',
//         id: 'patientDetail.html'
//     });

// }

// function pushHistory() {
//     var state = {
//         title: "title",
//         url: "#"
//     };
//     window.history.pushState(state, "title", "#");
// }


function putDateValue(value, moduleDefineCode, rowNum) {
    if (rowNum == -1) {
        angular.element(document.getElementById('saveData')).scope().setDataValue_crf(moduleDefineCode, value, "TEXT");
    } else {
        angular.element(document.getElementById('saveData')).scope().setDataValue_crf(moduleDefineCode + "_" + rowNum, value, "TEXT");
    }
}



