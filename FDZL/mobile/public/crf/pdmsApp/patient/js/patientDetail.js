mui.ready(function () {
	var aId = sessionStorage.getItem('acctId');
	if(aId == '' || aId == undefined || aId == null || aId == 'null'){
		mui.openWindow({
		url: '/BindAccount',
		id: '/BindAccount'
		});
	}else{
		var roleName = sessionStorage.getItem('role');
		if (roleName == 'PATIENT') {
			sessionStorage.setItem('scientificResearchLibraryId','');
			getDomNav(roleName)
			queryPatientAccountInfo();
		} else {
			var roleFlag = sessionStorage.getItem('roleFlag');
			if(roleFlag == 'Chat'){
				queryBaseParamByUserId();
			}else{
				getPatientInfo();
				getVisits();
			}
		}
	}
});


function queryBaseParamByUserId() {
	var params = 'acctId=' + sessionStorage.getItem('acctId') +'&curYdataAccountId=' + sessionStorage.getItem('acctId') + '&openid=' + sessionStorage.getItem('openid');
	mui.ajax(path + 'project/queryBaseParamByUserId.do?' + params, {
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
		  var investigationId = data.investigationId;
		  var siteId = data.siteId;
		  if(siteId == '' || siteId == null || siteId == undefined){
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
		  sessionStorage.setItem('scientificResearchLibraryId','');

		  getPatientInfo();
		  getVisits();
		}
	  },
	  error: function(xhr, type, errorThrown) {
		// 异常处理；
		console.log(type);
	  },
	});
  }

//底部导航
function getDomNav(role) {
    var str = '';
    if (role == 'PATIENT') {
		$("#navId").show();
        str += '<a class="mui-tab-item calendar">';
        str += '<span class="mui-tab-label">日历</span>';
        str += '</a>';
        str += '<a class="mui-tab-item mui-active">';
        str += '<span class="mui-tab-label">我的档案</span>';
        str += '</a>';
    } 
    $("#navId").html(str);
}

mui('.mui-bar').on('tap', '.calendar', function () {
    mui.openWindow({
        url: '../../../../calendar/index.html',
        id: '../../../../calendar/index.html'
    });
});

function queryPatientAccountInfo() {
	mui.ajax(path + 'user/queryPatientAccountInfo.do?curYdataAccountId=' + sessionStorage.getItem('acctId') + paramsAcc, {
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
				var investigationId = data.investigationId;
				var siteId = data.siteId;
				var userId = data.userId;
				var roleId = data.roleId;
				var patientId = data.patientId;

				sessionStorage.setItem('investigationId', investigationId);
				sessionStorage.setItem('siteId', siteId);
				sessionStorage.setItem('roleId', roleId);
				sessionStorage.setItem('userId', userId);
				sessionStorage.setItem('patientId', patientId);

				getPatientInfo();
				
				// 权限
				var scientificFlag = sessionStorage.getItem('scientificFlag');
				if(scientificFlag == ''){
				  $('.access_control').each(function(){
					$(this).hide();
				  });
				}else{
					accessControl();
				}

				getVisits();
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}

var patientCode;
var patientNameCode;
var groupCode;
var groupType;

//获取病例基本信息页面元素
function getPatientInfo() {
	var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId') + '&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');
	mui.ajax(path + 'patient/getInvestigationPatientBaseInfo.do?' + _params + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
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
				sessionStorage.setItem("patientCrfModuleId", datas[0].moduleId);
				patientCode = data.patientName;
				patientNameCode = data.hospitalizationNumber;

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

						if (patientCode == child.moduleDefineCode || patientNameCode == child.moduleDefineCode) {

							/*str += '<div class="mui-row">';
                        	str += '<p class="mui-pull-left">'+child.moduleDefineName+'</p>';
                        	str += '<p class="mui-pull-right">'+angularFunctionInput_onlyView(child,"indicator",-1,false)+'</p>';
                    	   	str += '</div>';*/
							if (child.moduleDefineName == "病人姓名" || child.moduleDefineName == "姓名" ||
								child.moduleDefineName == "姓名拼音缩写") {
								str += '<div class="mui-row info-title" id="patientCodeId">';
								str += '<p class="mui-pull-left" style="margin-top: 10px;">';
								if (child.moduleDefineName == "病人姓名" || child.moduleDefineName == "姓名" ||
								child.moduleDefineName == "姓名拼音缩写"){
									str += '<span></sapn>';
								}else{
									str += '<span>' + child.moduleDefineName + ':</sapn>';
								}
								
								str += angularFunctionInput_onlyView(child, "indicator", -1, false);
								str += '</p>';
								str += '</div>';
							} else {
								/*str += '<div>'+child.moduleDefineName+'</div>';*/
								str += '<div class="mui-row info-title" id="patient_' + child.moduleDefineCode + '">';
								str += '<p class="mui-pull-left" style="margin-top: 10px;">';
								if (child.moduleDefineName == "病人姓名" || child.moduleDefineName == "姓名" ||
								child.moduleDefineName == "姓名拼音缩写"){
									str += '<span></sapn>';
								}else{
									str += '<span>' + child.moduleDefineName + ':</sapn>';
								}
								str += angularFunctionInput_onlyView(child, "indicator", -1, false);
								str += '</p>';
								str += '</div>';
							}

						}

					}

				}

				$("#crfItems").val(crfFieldsStr);
				$("#notInSameModuleCodes").val(notInSameModuleCodesStr);

				var $div = $(str);
				$("#baseInfo_all").append($div);
				parseScope($div);

				$("#setDataValue").click();
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

//获取访视列表
var isCRA = false;
var isCRC = false;

function getVisits() {
	var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId') + '&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');
	var paramValue = _params + "&patientId=" + sessionStorage.getItem('patientId');
	mui.ajax(path + 'patient/listVisits.do?' + paramValue + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function (data) {
			if (data.error) {
				if(data.error == 'UnbindUser'){
					unbindUser();
				  }
				mui.alert(data.error, '提示');
			} else {
				var str = '';

				var categoryList = data.categoryList;
				var haveEditRole = data.haveEditRole;
				var patientPointsStatus = data.patientPointsStatus;

				if (categoryList.length * 1 > 0) {
					for (var i = 0; i < categoryList.length; i++) {

						var category = categoryList[i];
						var visitList = category.visitList;

						if (category.visitTypeCategoryShow == 1) {

							str += '<ul class="mui-table-view marginBotton10">';
							str += '<li class="mui-table-view-cell  mui-table-view-title">';
							str += '<ul class="paddingLeft0 ">';
							str += '<li class="mui-table-view-cell mui-collapse">';
							str += '<a class="mui-navigate-right" href="#">';
							str += '<img class="fileFolder" src="../../assets/image/file-folder.png" style="position: relative !important;top: 3px !important;left: -3px !important;"/>';
							str += '<span class="firstLevel">' + category.visitTypeCategoryName + '</span>';
							str += '</a>';
							str += '<ul class="mui-table-view OA_task_1 secLevelUL">';

							for (var j = 0; j < visitList.length; j++) {
								var visit = visitList[j];

								var statusName = visit.visitStatus;
								var sdvStatusName = visit.visitSdvStatus;

								if (isCRC && visit.visitStatus != "未录入" && visit.visitStatus != "录入中" && visit.visitStatus != "已完成" && visit.visitStatus != "已提交") {
									str += '<li class="mui-table-view-cell  onlyViewCrf" accesscontrolkey="onlyViewCrf_btn" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle mui-navigate-right">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3 onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								} else if (isCRA) {
									str += '<li class="mui-table-view-cell  onlyViewCrf" accesscontrolkey="onlyViewCrf_btn" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle mui-navigate-right">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3 onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								}
								if (visit.visitStatus == "未录入" || visit.visitStatus == "录入中") {
									str += '<li class="mui-table-view-cell  dataEntry" accesscontrolkey="viewCrf_btn" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle mui-navigate-right">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3 dataEntry" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								}
								if (visit.visitStatus == "已完成") {
									str += '<li class="mui-table-view-cell  dataEntry" accesscontrolkey="commitVisit_btn" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle mui-navigate-right">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3 dataEntry" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								}

								if (visit.visitStatus == "清理中") {
									str += '<li class="mui-table-view-cell turnDownVisit commitVisit" accesscontrolkey="turnDownVisit_btn" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle mui-navigate-right">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3  turnDownVisit commitVisit" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								}

								if (visit.visitStatus == "已提交") {
									str += '<li class="mui-table-view-cell turnDownVisit onlyViewCrf" accesscontrolkey="onlyViewCrf_btn" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle mui-navigate-right">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3  turnDownVisit onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								}



								str += '<img src="../../assets/image/break-angle.png" />';
								if (j % 2 == 0) {
									str += '<img src="../../assets/image/triangle-up-pink.png" alt="" />';
								} else {
									str += '<img src="../../assets/image/triangle-up-green.png" alt="" />';
								}

								str += '<span>' + visit.visitTypeName + '</span>';

								str += '</div>';
								str += '<div class="mui-row">';
								//str += '<p class="mui-pull-left">访视时间:' + visit.visitTime + '</p>';
								var bldjVisitTypeId = data.bldjVisitTypeId,
									sixVisitTypeId = data.sixVisitTypeId,
									threeVisitTypeId = data.threeVisitTypeId;

								var tipVisitName = '';
								if (visit.visitTypeId == sixVisitTypeId) {
									tipVisitName = '6个月随访提交截止时间：入院时间+200天；如打回之后再次提交，提交截止时间：打回日期+15天';
								} else if (visit.visitTypeId == threeVisitTypeId) {
									tipVisitName = '3个月随访提交截止时间：入院时间+165天；如打回之后再次提交，提交截止时间：打回日期+15天';
								} else if (visit.visitTypeId == bldjVisitTypeId) {
									tipVisitName = '病例登记提交截止时间：入院时间+30天；如打回之后再次提交，提交截止时间：打回日期+15天';
								}
								str += '<p class="mui-pull-left">';
								str += '<span tipVisitName="' + tipVisitName + '" style="color: #67d3f0;font-size: 24px;margin-left: 10px;" class="tipVisitName mui-icon iconfont icon-icon"></span>';
								str += '</p>';

								if (statusName != "已完成") {
									if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
										str += '<p class="mui-pull-right">' + statusName + '</p>';
									} else if (statusName == "已提交" || statusName == "已清理") {
										str += '<p class="mui-pull-right color67d3f0">' + statusName + '</p>';
									} else if (statusName == "未录入") {
										str += '<p class="mui-pull-right colorfca9c8">' + statusName + '</p>';
									}

								} else {
									str += '<p class="mui-pull-right finishColor">' + statusName + '</p>';
								}
								str += '</div>';
								str += '</div>';

								if (statusName != "已提交") {
									str += '<div class="mui-slider-right mui-disabled">';
									str += '<a class="mui-btn mui-btn-red  access_control" accesscontrolkey="deleteVisit_btn" onclick="deleteVisit(' + visit.visitId + ');">删除</a>';
									str += '<a class="mui-btn mui-btn-green access_control" accesscontrolkey="commitVisit_btn" onclick="commitVisit(' + visit.visitId + ')">提交</a>';
									str += '</div>';
								}
								str += '</li>';
							}
							str += '</ul>';
							str += '</li>';
							str += '</ul>';
							str += '</li>';
							str += '</ul>';

						} else {
							for (var k = 0; k < visitList.length; k++) {
								var visit = visitList[k];
								if (isCRC && visit.visitStatus != "未录入" && visit.visitStatus != "录入中" && visit.visitStatus != "已完成" && visit.visitStatus != "已提交") {
									str += '<ul class="mui-table-view OA_task_1 marginBotton10" accesscontrolkey="onlyViewCrf_btn">';
									str += '<li class="mui-table-view-cell  paddingTop0 onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3  mui-navigate-right onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								} else if (isCRA) {
									str += '<ul class="mui-table-view OA_task_1 marginBotton10" accesscontrolkey="onlyViewCrf_btn">';
									str += '<li class="mui-table-view-cell  paddingTop0 onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									str += '<div class="mui-slider-handle">';
									str += '<div class="paddingLeft0 marginTop10 lineHeight3  mui-navigate-right onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
								} else {
									if (visit.visitStatus == "未录入" || visit.visitStatus == "录入中") {
										str += '<ul class="mui-table-view OA_task_1 marginBotton10" accesscontrolkey="viewCrf_btn">';
										str += '<li class="mui-table-view-cell  paddingTop0 dataEntry" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
										str += '<div class="mui-slider-handle">';
										str += '<div class="paddingLeft0 marginTop10 lineHeight3  mui-navigate-right dataEntry"  visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									}
									if (visit.visitStatus == "已完成") {
										str += '<ul class="mui-table-view OA_task_1 marginBotton10" accesscontrolkey="commitVisit_btn">';
										str += '<li class="mui-table-view-cell  paddingTop0 dataEntry" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
										str += '<div class="mui-slider-handle">';
										str += '<div class="paddingLeft0 marginTop10 lineHeight3  mui-navigate-right dataEntry"  visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									}

									if (visit.visitStatus == "清理中") {
										str += '<ul class="mui-table-view OA_task_1 marginBotton10" accesscontrolkey="turnDownVisit_btn">';
										str += '<li class="mui-table-view-cell  paddingTop0 turnDownVisit" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
										str += '<div class="mui-slider-handle">';
										str += '<div class="paddingLeft0 marginTop10 lineHeight3  mui-navigate-right turnDownVisit"  visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									}

									if (visit.visitStatus == "已提交") {
										str += '<ul class="mui-table-view OA_task_1 marginBotton10" accesscontrolkey="onlyViewCrf_btn">';
										str += '<li class="mui-table-view-cell  paddingTop0 onlyViewCrf" visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
										str += '<div class="mui-slider-handle">';
										str += '<div class="paddingLeft0 marginTop10 lineHeight3  mui-navigate-right onlyViewCrf"  visitId="' + visit.visitId + '" visitTypeId="' + visit.visitTypeId + '">';
									}
								}


								if (i % 2 == 0) {
									str += '<img src="../../assets/image/triangle-up-pink.png" alt="" />';
								} else {
									str += '<img src="../../assets/image/triangle-up-green.png" alt="" />';
								}
								str += '<span>' + visit.visitTypeName + '</span>';

								str += '</div>';
								str += '<div class="mui-row paddingLeft25">';
								str += '<p class="mui-pull-left">访视时间:' + visit.visitTime + '</p>';
								var bldjVisitTypeId = data.bldjVisitTypeId,
									sixVisitTypeId = data.sixVisitTypeId,
									threeVisitTypeId = data.threeVisitTypeId;

								var statusName = visit.visitStatus;
								var sdvStatusName = visit.visitSdvStatus;
								if (statusName != "已完成") {
									if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
										str += '<p class="mui-pull-right colorF8B551">' + statusName + '</p>';
									} else if (statusName == "已提交" || statusName == "已清理") {
										str += '<p class="mui-pull-right color67d3f0">' + statusName + '</p>';
									} else if (statusName == "未录入") {
										str += '<p class="mui-pull-right colorfca9c8">' + statusName + '</p>';
									}

								} else {
									str += '<p class="mui-pull-right finishColor">' + statusName + '</p>';
								}
								//str += '<p class="mui-pull-right colorfca9c8">' + statusName + '</p>';

								str += '</div>';

								str += '</div>';


								if (statusName != "已提交") {
									str += '<div class="mui-slider-right mui-disabled">';
									str += '<a class="mui-btn mui-btn-red  access_control" accesscontrolkey="deleteVisit_btn" onclick="deleteVisit(' + visit.visitId + ');">删除</a>';
									str += '<a class="mui-btn mui-btn-green access_control" accesscontrolkey="commitVisit_btn" onclick="commitVisit(' + visit.visitId + ')">提交</a>';
									str += '</div>';
								}
								str += '</li>';
								str += '</ul>';
							}
						}
					}
				} else {
					str += '<div class="textCenter">';
					str += '<img src="../../assets/image/no-data-tip.png" alt="" />';
					str += '<p>暂无数据</p>';
					str += '</div>';
				}

				$("#visitData").html(str);

				$('#visitData').children().each(function(i){
					if($('#visitData').children().length == (i*1+1*1)){
						$(this).css('margin-bottom','80px');
					}
				});

				mui('.mui-pull-left').on('tap', '.tipVisitName', function (e) {
					var tipVisitName = $(this).attr('tipVisitName');
					mui.alert(tipVisitName, '提示');
				});

				//数据录入
				mui('.mui-table-view-cell').on('tap', '.dataEntry', function (e) {
					var visitId = $(this).attr('visitId'),
						visitTypeId = $(this).attr('visitTypeId');
					sessionStorage.setItem("visitId", visitId);
					sessionStorage.setItem("visitTypeId", visitTypeId);
					sessionStorage.setItem('modifyVisitFlag', '1');
					sessionStorage.setItem('roleFlag', 'MyPanel');
					mui.openWindow({
						url: 'patientGroupDetail.html',
						id: 'patientGroupDetail.html'
					});
				});

				mui('.mui-table-view-cell').on('tap', '.onlyViewCrf', function (e) {
					var visitId = $(this).attr('visitId'),
						visitTypeId = $(this).attr('visitTypeId');
					sessionStorage.setItem("visitId", visitId);
					sessionStorage.setItem("visitTypeId", visitTypeId);
					sessionStorage.setItem('modifyVisitFlag', '2');
					sessionStorage.setItem('roleFlag', 'MyPanel');
					mui.openWindow({
						url: 'patientOnlyViewCrf.html',
						id: 'patientOnlyViewCrf.html'
					});
				});

				mui('.mui-table-view').on('tap', '.commitVisit', function (e) {
					commitVisit();
				});

				mui('.mui-table-view').on('tap', '.turnDownVisit', function (e) {
					turnDownVisit();
				});

				// 权限
				var scientificFlag = sessionStorage.getItem('scientificFlag');
				if(scientificFlag == ''){
				$('.access_control').each(function(){
					$(this).hide();
				});
				}else{
					accessControl();
				}
				
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

function deleteVisit(id) {
	var visitId = id;
	var btnArray = ['否', '是'];
	mui.confirm('确定删除当前访视？', '提示', btnArray, function (e) {
		if (e.index == 1) {
			var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
				'&userId=' + sessionStorage.getItem('userId');
			mui.ajax(path + 'patient/deleteVisit.do?patientId=' + patientId + '&visitId=' + visitId + "&" + _params + paramsAcc, {
				data: {},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function (data) {
					if (data.error) {
						if(data.error == 'UnbindUser'){
							unbindUser();
						  }
						mui.alert(data.error, '提示');
					} else {

						var status = data.status;
						if (status == "1") {
							mui.toast("访视删除成功");
							setTimeout(function () {
								getVisits();
							}, 1500);
						} else if (status == "-1") {
							mui.alert("有已提交访视", '提示')
						} else if (status == "-2") {
							mui.alert("操作失败", '提示')
						}
					}

				},
				error: function (xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
				}
			});
		} else {
			getVisits();
		}
	});
}

function commitVisit(visitId) {

	var btnArray = ['否', '是'];
	mui.confirm('确认提交当前访视？', '提示', btnArray, function (e) {
		if (e.index == 1) {
			mui.confirm('请确认已完成访视的所有数据录入工作，访视提交后无法修改数据，是否确定提交访视？', '提示', btnArray, function (e) {
				if (e.index == 1) {
					var commitVisitParams = 'patientId=' + sessionStorage.getItem('patientId') + '&visitId=' + visitId +
						'&siteId=' + sessionStorage.getItem("siteId") +
						'&roleId=' + sessionStorage.getItem("roleId") +
						'&userId=' + sessionStorage.getItem("userId")
					mui.ajax(path + 'patient/commitVisit.do?' + commitVisitParams + paramsAcc, {
						data: {},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: function (data) {
							if (data.error) {
								if(data.error == 'UnbindUser'){
									unbindUser();
								  }
								mui.alert(data.error, '提示');
							} else {
								var status = data.status;
								if (status == "1") {
									mui.toast("提交成功")
									setTimeout(function () {
										getVisits();
									}, 1500);
								} else if (status == "-1") {
									mui.alert("有未录入或录入中数据", '提示');
								} else if (status == "-2") {
									mui.alert("没有待提交的记录", '提示');
								} else if (status == "-3") {
									mui.alert("有未关闭的质询", '提示');
								} else if (status == "-4") {
									mui.alert("有未SDV访视", '提示');
								}
							}

						},
						error: function (xhr, type, errorThrown) {
							//异常处理；
							console.log(type);
						}
					});
				} else {

				}
			});
		} else {

		}
	});

}

function turnDownVisit(visitId) {

	var btnArray = ['否', '是'];
	mui.confirm('确认执行操作？', '提示', btnArray, function (e) {
		if (e.index == 1) {
			mui.confirm('打回访视后该访视下所有CRF将置为已完成状态，研究者将重新提交后您才能再次查看！是否打回该访视？', '提示', btnArray, function (e) {
				if (e.index == 1) {
					var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
						'&userId=' + sessionStorage.getItem('userId') + 'patientId=' + sessionStorage.getItem('patientId') +
						'&visitId=' + sessionStorage.getItem('visitId');
					mui.ajax(path + 'patient/turnDownVisit.do?' + _params + paramsAcc, {
						data: {},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: function (data) {
							if (data.error) {
								if(data.error == 'UnbindUser'){
									unbindUser();
								  }
								mui.alert(data.error, '提示');
							} else {
								mui.toast("提交成功")
								setTimeout(function () {
									getVisits();
								}, 1500);
							}

						},
						error: function (xhr, type, errorThrown) {
							//异常处理；
							console.log(type);
						}
					});
				} else {

				}
			});
		} else {

		}
	});
}

$(".awalsRadio").on('click', function () {
	var val = $(this).val();
	if (val == 1) {
		$("#awalsNo").show();
		$(".modal-body").css('padding-bottom', '0px');
	} else if (val == 0) {
		$("#awalsNo").hide();
		$(".modal-body").css('padding-bottom', '35px');
	}

});
