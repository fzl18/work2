//var path ='http://wxtestfdzl.ydata.org/';
//var path = 'http://alan.nat300.top/'
//var path = 'http://192.168.10.202:12003/';
var path = 'http://116.62.169.145:12000/';

var paramsAcc = '&curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid');

var params =  '&siteId=' + sessionStorage.getItem("siteId") +
    '&roleId=' + sessionStorage.getItem("roleId") + '&userId=' + sessionStorage.getItem("userId");

//病人ID
var patientId = sessionStorage.getItem("patientId");
//访视ID
var visitId = sessionStorage.getItem("visitId");
//访视类型ID
var visitTypeId = sessionStorage.getItem("visitTypeId");
//修改基本信息 当前crf的moduleId
var patientCrfModuleId = sessionStorage.getItem("patientCrfModuleId");
//研究名称
var investigationName = sessionStorage.getItem("investigationName");
//中心名称
var siteName = sessionStorage.getItem("siteName");
//角色名称
var roleName = sessionStorage.getItem("roleName");

//手机号码正则表达式
var cellphone = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(11[0-9]{1})|(12[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
//邮箱正则表达式
var email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

//获取基本信息数据
var wechart_tableModuleDefineCode = new Array();

var crfItems_two_All = "";
var map = {};
var map_rowNum = {}; //非表格
var map_moduleDefine = {};
var oldValueMap = {};
var oldRemarkValueMap = {};
var map_moduleDefine_order = {};
var map_moduleDefine_Virtual_order = {};
var map_moduleDefineId_order = {};
var currentCrfStatus = '';

function getPatientInfoValue(index) {
	map = {};
	map_rowNum = {};
	oldValueMap = {};
	map_moduleDefine = {};

	var crfItemsStr = $("#crfItems").val();
	var notInSameModuleCodesStr = $("#notInSameModuleCodes").val();
	var notInSameCrfCodesStr = $("#notInSameCrfCodes").val();

	var visitIdValue = '';
	if(index == 1) {
		visitIdValue = -1;
	} else {
		visitIdValue = sessionStorage.getItem("visitId");
	}
	
	var notInSameModuleCodesStr = $("#notInSameModuleCodes").val();
    if(notInSameModuleCodesStr == null || notInSameModuleCodesStr == undefined){
        notInSameModuleCodesStr = notInSameModuleCodes_backup;
    }
    var notInSameCrfCodesStr = $("#notInSameCrfCodes").val();
    if(notInSameCrfCodesStr == null || notInSameCrfCodesStr == undefined){
        notInSameCrfCodesStr = notInSameCrfCodes_backup;
    }

	var paramValue = 'siteId=' + sessionStorage.getItem("siteId") + '&roleId=' + sessionStorage.getItem("roleId") + 
	'&userId=' + sessionStorage.getItem("userId") + "&crfFields=" + crfItemsStr + "&visitId=" + visitIdValue + 
	"&patientId=" + sessionStorage.getItem("patientId") + "&notInSameCrfCodesStr=" + notInSameCrfCodesStr + 
	"&notInSameModuleCodesStr=" + notInSameModuleCodesStr + "&currentModuleDefineId=" + 
	'&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');

	mui.ajax(path + 'crf/searchCrfValue_interface.do?' + paramValue + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			if(data.error) {
				if(data.error == 'UnbindUser'){
					unbindUser();
				  }
				mui.toast(data.error);
			} else {
				var datas = data.datas;
				var crfFieldsStr = JSON.stringify(datas);
				if(backIndex != null && backIndex != '' && backIndex != undefined){
					if(backIndex == 21 || backIndex == 22){
						$("#crfItems_two_copy").val(crfFieldsStr);
						crfItems_two_All = crfFieldsStr;
					}else{
						$("#crfItems_two").val(crfFieldsStr);
						crfItems_two_All = crfFieldsStr;
					}
				}else{
					$("#crfItems_two").val(crfFieldsStr);
					crfItems_two_All = crfFieldsStr;
				}

				if(data.visitCrf != null && data.visitCrf != undefined) {
					currentCrfStatus = data.visitCrf.status;
				}
				
				
				 //跨访视或者跨CRF指标
                var _innerHtml_notSame = "";

                var datasNotSameCrf = data.datasNotSameCrf;
                var crfFieldsStr_notSameCrf = JSON.stringify(datasNotSameCrf);
                for (var i = 0; i < datasNotSameCrf.length; i++) {
                    var moduleDefine = datasNotSameCrf[i];
                    var moduleDefineCode = moduleDefine.moduleDefineCode;
                    var projectDefineDataFormat = moduleDefine.projectDefineDataFormat;
                    var dataType = "";
                    if (projectDefineDataFormat != null && projectDefineDataFormat != "" && projectDefineDataFormat != undefined) {
                        dataType = projectDefineDataFormat.projectDefineDataType;
                    }
                    var values = moduleDefine.values;
                    if (values != null && values != "" && values != undefined) {
                        if (moduleDefine.moduleDefineIsDatas == "0") {
                            var value = values[0].value;
                            _innerHtml_notSame += '<input type="'+dataType+'"  my-set-value ng-model="'+moduleDefineCode+'" value="'+value+'"/>';
                            // var value = angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode, value, dataType);
                        } else {
                            var _str = "";
                            var _ary = new Array();
                            for(var c = 0; c < values.length; c ++){
                                var valueObj = values[c];
                                var _value = valueObj.value;
                                var _bacthId = valueObj.batchId;
                                var rowNum = String(valueObj.rowNum).substr(_bacthId.length);
                                _innerHtml_notSame += '<input type="'+dataType+'" my-set-value my-model row-num="'+rowNum+'"  is-datas="1" ng-model="'+moduleDefineCode+'_'+rowNum+'" value="'+_value+'"/>';
                            }
                        }
                    }
                }

                var datasNotSameModule = data.datasNotSameModule;
                var crfFieldsStr_notSameModule = JSON.stringify(datasNotSameModule);
                for (var i = 0; i < datasNotSameModule.length; i++) {
                    var moduleDefine = datasNotSameModule[i];
                    var moduleDefineCode = moduleDefine.moduleDefineCode;
                    var projectDefineDataFormat = moduleDefine.projectDefineDataFormat;
                    var dataType = "";
                    if (projectDefineDataFormat != null && projectDefineDataFormat != "" && projectDefineDataFormat != undefined) {
                        dataType = projectDefineDataFormat.projectDefineDataType;
                    }
                    var values = moduleDefine.values;
                    if (values != null && values != "" && values != undefined) {
                        if (moduleDefine.moduleDefineIsDatas == "0") {
                            var value = values[0].value;
                            _innerHtml_notSame += '<input type="'+dataType+'"  my-set-value ng-model="'+moduleDefineCode+'" value="'+value+'"/>';
                        } else {
                            var _str = "";
                            var _ary = new Array();
                            for(var c = 0; c < values.length; c ++){
                                var valueObj = values[c];
                                var _value = valueObj.value;
                                var _bacthId = valueObj.batchId;
                                var rowNum = String(valueObj.rowNum).substr(_bacthId.length);
                                _innerHtml_notSame += '<input type="'+dataType+'" my-set-value my-model row-num="'+rowNum+'"  is-datas="1" ng-model="'+moduleDefineCode+'_'+rowNum+'" value="'+_value+'"/>';
                            }
                        }
                    }
                }

                if(_innerHtml_notSame != ""){
                    var $div2 = $(_innerHtml_notSame);
                    $("#notCurrentCrf").html($div2);

                    parseScope($div2);
                    // angular.element(document.body).injector().invoke(function($compile) {
                    //     var scope = angular.element($div2).scope();
                    //     $compile($div2)(scope);
                    // });
                }
				

				for(var i = 0; i < datas.length; i++) {
					var moduleDefine = datas[i];
					var moduleDefineCode = moduleDefine.moduleDefineCode;
					var projectDefineDataFormat = moduleDefine.projectDefineDataFormat;
					var dataType = "";
					if(projectDefineDataFormat != null && projectDefineDataFormat != "" && projectDefineDataFormat != undefined) {
						dataType = projectDefineDataFormat.projectDefineDataType;
					}
					var values = moduleDefine.values;
					if(values != null && values != "" && values != undefined) {
						if(moduleDefine.moduleDefineIsDatas == "0" && moduleDefine.moduleDefineIsVirtual != "1") {
							var valueObj = values[0];
							var value = valueObj.value;
							var _bacthId = valueObj.batchId;
							var rowNum = String(valueObj.rowNum).substr(_bacthId.length);
							map_rowNum[moduleDefineCode] = rowNum;
							var value = angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode, value, dataType);
						} else {
							if(moduleDefine.moduleDefineIsVirtual != "1") {
								var _ary = new Array();
								for(var c = 0; c < values.length; c++) {

									var valueObj = values[c];
									var _value = valueObj.value;
									var _bacthId = valueObj.batchId;
									var rowNum = String(valueObj.rowNum).substr(_bacthId.length);
									rowNum = Number(rowNum);
									_ary[c] = rowNum;
									angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode + "_" + rowNum, _value, dataType);
									oldValueMap[moduleDefineCode + "_" + rowNum] = _value;
								}
								map[moduleDefineCode] = _ary;
							}
						}
					}else{
						$("#patient_"+moduleDefine.moduleDefineCode).hide();
						//$("#info_"+moduleDefine.moduleDefineCode).parent().parent().hide();
					}
					if(moduleDefine.moduleDefineIsDatas == "1") {
						map_moduleDefine[moduleDefineCode] = moduleDefine;
					}

				}

				//表格
				var rowNums = "";
				$(".crf-table-thead").each(function() {
					var tableModuleCode = $(this).attr("tableModuleCode");
					var _rowNumAry = new Array();
					var _moduleCodeAry = new Array();

					var moduleDefineShowType = $(this).attr('onlyView');
					//	                    $(".crf-table-th-"+tableModuleCode).each(function () {
					//	                        var moduleCode = $(this).attr("code");
					//	                        _rowNumAry.push.apply(_rowNumAry,map[moduleCode]);
					//	                        // _moduleCodeAry.push(moduleCode);
					//	                    })

					for(var k = 0; k < wechart_tableModuleDefineCode.length; k++) {

						var moduleCode = wechart_tableModuleDefineCode[k];
						_rowNumAry.push.apply(_rowNumAry, map[moduleCode]);
					}

					//	                var tmpModuleDefineCodes = map_moduleDefine_order[tableModuleCode];
					//                  if(tmpModuleDefineCodes != null && tmpModuleDefineCodes != undefined && tmpModuleDefineCodes != "undefined" && tmpModuleDefineCodes != ""){
					//                      _moduleCodeAry = tmpModuleDefineCodes.split(",");
					//                  }

					_rowNumAry.sort(compact);

					if(_rowNumAry.length == 0) {
						var crfItemsStrValue = crfItemsStr.split(',');
						for(var i = 0; i < crfItemsStrValue.length; i ++){
		                    var _moduleDefineCode = crfItemsStrValue[i];
		                    if('' != _moduleDefineCode && null != _moduleDefineCode){
		                    	angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(_moduleDefineCode+"_0", '', 'NUMBER');
		                    }
		                }
						_rowNumAry.push(0);
					}

					var _new = _rowNumAry.unique3();
					var _innerHtml = "";
					//var addIsdatas = js.lang.String.encodeHtml(JSON.stringify(isdatasValue));
					var _obj = datasValueMap[tableModuleCode];
					var addIsDatasStr = js.lang.String.encodeHtml(JSON.stringify(_obj));
					saveTableSucccess = _obj[0];
					removeDeleteLength = _new.length;
					console.log('removeDeleteLength=' + removeDeleteLength);
					for(var m = _new.length - 1; m >= 0; m--) {
						_innerHtml += '<ul class="mui-table-view OA_task_1 marginBotton10 tableRemove">';
						_innerHtml += '<li class="mui-table-view-cell paddingLeft18 paddingRight0">';

						_innerHtml += '<div class="mui-slider-handle">';
						_innerHtml += '<div onclick="addIsdatas(' + addIsDatasStr + ',' + _new[m] + ');" class="tableClass-'+tableModuleCode+' paddingLeft0 marginTop10 lineHeight3  mui-navigate-right borderBottom1">';
						_innerHtml += '<span>' + table_name + '-' + (m + 1) + '</span>';
						_innerHtml += '<i class="mui-icon iconfont icon-shenglvehao" style="color:#4A90E2;"></i>';
						if(wechart_tableModuleDefineCode.length > 3) {
							_innerHtml += '<img src="../../assets/image/detail-blue.png" alt="" />';
						}

						_innerHtml += '</div>';

						_innerHtml += '<div class="mui-card-content">';
						for(var n = 0; n < wechart_tableModuleDefineCode.length; n++) {
							if(n <= 2) {

								var node = map_moduleDefine[wechart_tableModuleDefineCode[n]];

								if(undefined != node && "" != node && null != node) {
									var remarkValue = oldRemarkValueMap[_moduleCodeAry[n] + "_" + _new[m]];

									_innerHtml += '<div class="mui-row lineHeight3 fontSize17" '+ angularFunction(node) +'>';

									// if(n % 2 == 0) {
									// 	_innerHtml += '<img src="../../assets/image/circle-pink.png" alt="" />';
									// } else {
									// 	_innerHtml += '<img src="../../assets/image/circle-green.png" alt="" />';
									// }

									_innerHtml += '<label>' + node.moduleDefineName + ':';
									_innerHtml += '<span class="color858585">' + createTableNodeInput(node, _new[m], remarkValue); + '</span>';
									_innerHtml += '</label>';
									_innerHtml += '</div>';

								}
							}

						}
						_innerHtml += '</div>';
						_innerHtml += '</div>';

						_innerHtml += '<div class="mui-slider-right mui-disabled" id="deleteTable" moduleDefines="' + addIsDatasStr + '" rowNum="' + _new[m] + '" tableModuleCode="' + _obj[0].moduleDefineCode + '" onclick="deleteTableData(this)">';
						_innerHtml += '<a class="mui-btn mui-btn-red">删除</a>';
						_innerHtml += '</div>';
						_innerHtml += '</li>';
						_innerHtml += '</ul>';
						_innerHtml += '</div>';
						
					}
					
					if("currency" != moduleDefineShowType && "" != moduleDefineShowType && null != moduleDefineShowType && undefined != moduleDefineShowType) {
                        _innerHtml += '';
					}else{
						var scientificFlag = sessionStorage.getItem('scientificFlag');
						if (scientificFlag != '') {
							_innerHtml += '<div accesscontrolkey="addPatient_btn" class="plus access_control" onclick="addIsdatas(' + addIsDatasStr + ',0);">';
							_innerHtml += '<img src="../../assets/image/plus.png" alt="" />';
						}
					}

					var $div = $(_innerHtml);

					$("#table_div").empty();
					$("#table_div").html($div);
					
					
					//权限
					accessControl();

					if(_innerHtml != "") {
						angular.element(document.body).injector().invoke(function($compile) {
							var scope = angular.element($div).scope();
							$compile($div)(scope);
						});
					}

				});
				
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

function createTableNodeInput(node, rowNum, remarkValue) {
	var _innerHtml = "";
	if(node != null && node != "" && node != undefined) {

		var projectDefineDataFormat = node.projectDefineDataFormat;
		var dataType = "";
		if(projectDefineDataFormat != null && projectDefineDataFormat != "" && projectDefineDataFormat != undefined) {
			dataType = projectDefineDataFormat.projectDefineDataType;
		}

		//常亮3.8begin
		if(node.moduleDefineIsRequired == 0) {
			_innerHtml += '<my-span class="crf-table-inner-input" my-length-limit="255" type="' + dataType + '" is-datas="1" my-model row-num="' + rowNum + '" ';
		} else {
			_innerHtml += '<my-span moduleDefineName="' + node.moduleDefineName + '" class="crf-table-inner-input isRequired isRequiredTab" my-length-limit="255" type="' + dataType + '" is-datas="1" my-model row-num="' + rowNum + '" ';
		}
		//常亮3.8end

		var reference_score = new Array();
		var reference_virtual = new Array();
		//my-score
		if(node.score != null && node.score != "" && node.score != undefined) {
			var cond = "";
			var val = "";
			var myScore = new Array();
			var myScore_1 = "{'score':[";
			for(var i = 0; i < node.score.length; i++) {
				cond = node.score[i].cond;
				val = node.score[i].value;
				for(var j = 0; j < node.score[i].reference.length; j++) {
					reference_score.push(replaceJson(JSON.stringify(node.score[i].reference[j])));
					myScore.push("{'cond':'" + cond.replaceAll("'", "\\'") + "','reference':[" + reference_score + "],'value':'" + val + "'}");
				}
				reference_score = new Array();
			}
			var myScore_2 = "]}";
			var myScoreValue = myScore_1 + myScore + myScore_2;
			_innerHtml += 'my-score="' + myScoreValue + '"';
		}

		//virtual-directive && virtual-directive-score
		if(node.moduleDefineIsVirtual == "1") {
			var directive = "";
			if(node.directive != null && node.directive != "" && node.directive != undefined) {
				for(var j = 0; j < node.directive.reference.length; j++) {
					reference_virtual.push(replaceJson(JSON.stringify(node.directive.reference[j])));
				}
				if(node.directive.calculateScore != null && node.directive.calculateScore != "" && node.directive.calculateScore != undefined) {
					directive = node.directive.calculateScore;
					var calculateScore = "{'calculateScore':'" + directive + "','reference':[" + reference_virtual + "]}";
					_innerHtml += 'virtual-directive-score="' + calculateScore + '"';
				} else {
					directive = node.directive.calculate;
					var calculate = "{'calculate':'" + directive + "','reference':[" + reference_virtual + "]}";
					_innerHtml += 'virtual-directive="' + calculate + '"';
				}
			}
		}

		//my-length-limit and my-data-format
		_innerHtml += functionLimitAndFormat(node);

		_innerHtml += 'ng-model="' + node.moduleDefineCode + '_' + rowNum + '"></my-span>';
		if(typeof isHaveInquiry != 'undefined' && isHaveInquiry == "yes") {
			_innerHtml += '<a class="crf-btn-inquiry searchInquiryClass" title="您有待处理的质询" moduleDefineCode="' + node.moduleDefineCode + '" rowNum="' + rowNum + '" style="display: none;"></a>';
		}
		if(node.moduleDefineCommentFlag != null && node.moduleDefineCommentFlag != "" && node.moduleDefineCommentFlag != undefined &&
			node.moduleDefineCommentFlag == 1) {
			if(remarkValue != null && remarkValue != undefined && remarkValue != "undefined" && remarkValue != "") {
				_innerHtml += '<div class="arrow-right" title="' + remarkValue + '"></div>';
			}
		}

	}
	return _innerHtml;
}

/*JS sort排序*/
function compact(v1, v2) {
	if(v1 < v2) {
		return -1;
	} else if(v1 > v2) {
		return 1;
	} else {
		return 0;
	}
}

Array.prototype.unique3 = function() {
	var res = [];
	var json = {};
	for(var i = 0; i < this.length; i++) {
		if(!json[this[i]]) {
			res.push(this[i]);
			json[this[i]] = 1;
		}
	}
	return res;
}

//获取访视分类

function getVisitType() {

	mui.ajax(path + 'patient/searchVisitType.do?patientId=' + patientId + '&' + params + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			if(data.error) {
				if(data.error == 'UnbindUser'){
					unbindUser();
				  }
				mui.toast(data.error);
			} else {

				var arry = new Array();

				var categoryLength = data.categoryList.length;
				var value = '';
				var text = '';
				if(data.categoryList !='' && data.categoryList != undefined && data.categoryList != null){
					for(var i = 0; i < data.categoryList.length; i++) {
						var categoryAry = data.categoryList[i];
						for(var j = 0; j < categoryAry.visitTypeList.length; j++) {
							value = categoryAry.visitTypeList[j].visitTypeId;
							text = categoryAry.visitTypeList[j].visitTypeName;
							notCanAddTips = categoryAry.visitTypeList[j].notCanAddTips;
							canAddFlag = categoryAry.visitTypeList[j].canAddFlag;
							var _map = [];
							_map["visitTypeId"] = value;
							_map["text"] = text;
							_map["notCanAddTips"] = notCanAddTips;
							_map["canAddFlag"] = canAddFlag;
							arry.push(_map);
						}
					}
					visitPick(arry);
				}else{
					$('#system-auto').css('color','#bababa');
					$('#system-auto').html('无法创建');
				}
				
				
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//pick 弹出
function visitPick(arry) {
  var visitPick = new mui.PopPicker();

  visitPick.setData(arry);

  var visitTypeName = document.getElementById('system-auto');
  visitTypeName.addEventListener('tap', function(event) {
    visitPick.show(function(items) {
      // if (items[0].canAddFlag != 0) {
      //   mui.alert(items[0].notCanAddTips);
      //   return false;
      // }
      visitTypeName.innerHTML = items[0].text;
      $('#system-auto').css('color','#000');
      var dom = $('#visitTypeIdValue');
      dom.val(items[0].visitTypeId);
    });
  }, false);
}

//时间选择弹出处理
function alertDatePick() {
	
	var btns = $('.btnClass');
	var timeValue;
	btns.each(function(i, btn) {
		btn.addEventListener('tap', function() {
			$('input').blur();
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			timeValue = $(this);
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				timeValue.html(rs.value);
				picker.dispose();
			});
		}, false);
	});
}

function delImgFileOnServer(filekey) {
	$.ajax({
		url:path + "obj/deleteImage.do?thumbnail=1",
		type:"post",
		data: {
			fileKey: filekey + paramsAcc,
		},
		dataType:"json",
		cache:"false",
		contentType:"application/x-www-form-urlencoded;charset=UTF-8",
		success:function(data){
			if(data.error){
				if(data.error == 'UnbindUser'){
					unbindUser();
				  }
				mui.alert(data.error, '提示');
				return;
			}else{
//                        $.success.alert("设置成功");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alertAjaxError(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}

//删除图片
function delUploadImage(){
	mui('body').on('tap', '.del_icon', function (e) {
	//$("body").on("tap",".del_icon",function(e){
		e.stopPropagation();
		var disDel = $(this).attr("disabled");
		if(disDel == "disabled" || disDel == "true" ){
			return;
		}
		var moduleDefineCode = $(this).parent().parent().attr("ng-model");
		var value = angular.element(document.getElementById('setDataValue')).scope().getDataValue_crf(moduleDefineCode);
		var imgArray = JSON.parse(value);
		var filekey = $(this).parent().find(".img_url").attr("fileKey");
		if(filekey){
			delImgFileOnServer(filekey);
		}
		var imgArray = $.grep(imgArray, function(e){
			return e.fileKey != filekey;
		});
		var saveImgScope = imgArray.length > 0 ? JSON.stringify(imgArray) : "";
		angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode, saveImgScope, "TEXT");
	})
}

//上传图片
function addImgUpload(){
    $('.fileupload').each(function () {
        var moduleDefineCode = $(this).attr("ng-model");
        var allowAddTimes = $(this).attr("allowAddTimes");
        $(this).fileupload({
            dataType: 'json',
			add: function (e,data){
				var uploadErrors = [];
                // var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                // if(data.originalFiles[0]['type'] && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                //     uploadErrors.push('Not an accepted file type');
                // }
                if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > 20 * 1024 * 1024) {
                    uploadErrors.push('图片不得超过20M');
                }
                if(uploadErrors.length > 0) {
					mui.alert(uploadErrors.join("\n"), '提示');
                } else {
                    var _this = this;
					$(_this).attr('disabled', "disabled");
					data.submit();
                }
			},
            done: function (e, data) {
				var _this = this;
				$(_this).attr('disabled', false);
				if(data.result.error){
					mui.alert(data.result.error, '提示');
					return;
				}
                if(data.result && data.result.datas){
                    var value = angular.element(document.getElementById('setDataValue')).scope().getDataValue_crf(moduleDefineCode);
                    var imgArray = [];
                    if(value){
                        imgArray = JSON.parse(value);
                    }
                    $.each(data.result.datas, function (index, file) {
                        imgArray.push({
                            fileKey: file.fileKey,
                            fileName: file.fileName,
                            imageUrl: file.imageUrl,
                            imageUrl_thumbnail: file.imageUrl_thumbnail,
                        })
                    })
                    angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode, JSON.stringify(imgArray), "TEXT");
				}
            }
        });
    });
}

function getKeyId() {
    var url = location.search; //获取url中"?"符后的字串
    var keyId = "";
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            keyId = unescape(strs[i].split("=")[1]);
        }
    }
    return keyId;
}

function getKeyName() {
    var url = location.search; //获取url中"?"符后的字串
    var keyName = "";
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            keyName = unescape(strs[i].split("=")[0]);
        }
    }
    return keyName;
}

function noData() {
	var str = '';
	str += '<div class="textCenter" style="background-color:#ddeaf0;margin-top: 80px;">';
	str += '<img src="../../assets/image/no-data-tip.png" alt="" />';
	str += '<p style="margin-left: -20px;">暂无数据</p>';
	str += '</div>';
	return str;
}

function titleController(name) {

	var $body = $('body');
	document.title = name;
	// hack在微信等webview中无法修改document.title的情况    
	var $iframe = $('<iframe style="display:none;"></iframe>');
	$iframe.on('load', function() {
		setTimeout(function() {
			$iframe.off('load').remove();
		}, 0);
	}).appendTo($body);

}

// //picker数据列表填充
// function setPickerData(picker, siteList) {
//     picker.setData(siteList);
// }
//
// //input选择事件
// function addEventValue(type, idResult, picker) {
//     idResult.addEventListener('tap', function(event) {
//         var nextNeedId;
//
//         picker.show(function(items) {
//             idResult.value = items[0].text;
//             $(idResult).attr('value', items[0].value);
//
//             switch(type){
//                 case 'role':
//                     nextNeedId = items[0].nextNeedId;
//                     getRoleList(nextNeedId); //角色
//                     break;
//                 case 'title':
//                     nextNeedId = items[0].nextNeedId;
//                     getSiteList(nextNeedId); //研究中心
//                     break;
//             }
//         });
//     }, false);
// }

//删除重复pick
function deletePick() {
	$(".mui-poppicker").each(function() {
		$(this).remove();
	});
}

function pushHistory() {
	var state = {
		title: "title",
		url: "#"
	};
	window.history.pushState(state, "title", "#");
}

//提示内容显示隐藏控制
function empty(inputObj) {
	var originalValue = inputObj.placeholder;
	if(originalValue != '') {
		sessionStorage.setItem('originalValue', originalValue);
		inputObj.placeholder = "";
	}
}

function leave(inputObj) {
	var existingValue = inputObj.placeholder;
	if(existingValue == '') {
		inputObj.placeholder = sessionStorage.getItem('originalValue');
	}
}

//判断手机系统
function isSystem(openId) {
	var ua = navigator.userAgent.toLowerCase();
	if(/iphone|ipad|ipod/.test(ua)) {
		// alert("iphone");
	} else if(/android/.test(ua)) {
		// alert("android");
		if(openId != 'more') {
			pushHistory();
		}
	}
}

//关闭页面
function weixinClosePage() {
    sessionStorage.clear();
	if(typeof WeixinJSBridge == "undefined") {
		if(document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', weixin_ClosePage, false);
		} else if(document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', weixin_ClosePage);
			document.attachEvent('onWeixinJSBridgeReady', weixin_ClosePage);
		}
	} else {
		weixin_ClosePage();
	}
}

function weixin_ClosePage() {
	WeixinJSBridge.call('closeWindow');
	// patient.WeixinJSBridge.invoke('closeWindow',{},function(res){
	// });
}

function accessControl() {
	var contrlo_key_param = "";
	var index = 0;
	$(".access_control").each(function() {
		var _key = $(this).attr("accessControlKey");
		if(contrlo_key_param.indexOf(_key) == -1) {
			contrlo_key_param += "arrays[" + index + "]=" + _key + "&";
			index++;
		}
	})
	if(contrlo_key_param != "" && sessionStorage.getItem("roleId") != -1) {
		var param = contrlo_key_param + "roleId=" + sessionStorage.getItem("roleId");
		mui.ajax(path + 'roleIntf/getRoleAuthorityFromIntfIds.do?' + param + paramsAcc, {
			data: {},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.error) {
					if(data.error == 'UnbindUser'){
						unbindUser();
					  }
					mui.alert(data.error);
				} else {
					var _list = data.datas;

					var _ValueMap = {};
					for(var i = 0; i < _list.length; i++) {
						var obj = _list[i];
						_ValueMap[obj.keyName] = obj.keyValue;
					}

					$(".access_control").each(function() {
						var _key = $(this).attr("accessControlKey");
						var _flag = _ValueMap[_key];
						if(_flag) {
							$(this).show();
						} else {
							$(this).hide();
						}
					})

				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
			}
		});
	}
}

function queryVisitDynamic() {
	mui.ajax(path+'visit/queryVisitDynamic.do?curYdataAccountId='+sessionStorage.getItem('acctId')+paramsAcc, {
		data: {},
		dataType: 'json', // 服务器返回json格式数据
		type: 'post', // HTTP请求类型
		success: function(data) {
			if (data.error) {
				if(data.error == 'UnbindUser'){
					unbindUser();
				  }
				mui.toast(data.error);
			} else {
				var dynamicList = data.datas;
				var isHighlightCount = 0;
				if (dynamicList != '' && dynamicList != undefined && dynamicList != null) {
					for (var i = 0; i < dynamicList.length; i++) {
					  isHighlightCount += isHighlightCount*1 + dynamicList[i].isHighlight*1;
					}
					if(dynamicList.length > 1 && isHighlightCount != 0){
						$(".dynamic").append('<span style="position: absolute; border-radius: 6px; border: 5px solid rgb(255, 0, 0);"></span>');
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

function unbindUser(){
	mui.openWindow({
		url: '/BindAccount',
		id: '/BindAccount'
	});
}