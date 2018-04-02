mui.ready(function () {
	var role = sessionStorage.getItem('role');
	var roleFlag = sessionStorage.getItem('roleFlag');

	if (role == 'PATIENT') {
		$('#viewEdit').removeClass('mui-navigate-right');
	} else {
		$('#viewEdit').addClass('mui-navigate-right');
	}

	//病人从日历进去页面 特殊处理
	if (role == 'PATIENT' && roleFlag == 'Calendar') {
		queryPatientAccountInfo();
	} else {
		queryBaseParamByUserId();
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

		  if (sessionStorage.getItem('roleFlag') == 'Dynamic') {
			getCrfDataByRole();
			} else {
				getSearchVisit();

				getCrfData();

				titleController(titleName);
			}
		}
	  },
	  error: function(xhr, type, errorThrown) {
		// 异常处理；
		console.log(type);
	  },
	});
  }

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

				getSearchVisit();
				getCrfDataByRole();

			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}


function getCrfDataByRole() {
	var pa = 'visitId=' + sessionStorage.getItem('visitId') + '&patientId=' + sessionStorage.getItem('patientId') +
		'&visitTypeId=' + sessionStorage.getItem('visitTypeId') + '&siteId=' + sessionStorage.getItem("siteId") +
		'&roleId=' + sessionStorage.getItem("roleId") + '&userId=' + sessionStorage.getItem("userId") +
		'&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');

	mui.ajax(path + 'crf/queryModuleTreeIsNotFormByName.do?' + pa + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				var _statusValues = data.statusValue;
				for (var i = 0; i < _statusValues.length; i++) {
					var _obj = _statusValues[i];
					for (var k in _obj) {
						statusValueMap[k] = _obj[k].substring(0, 3);
					}
				}
				crfHtmlByRole(data.datas, data.statusValue);
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

var byRoleFlag = '1';
var moduleDefineIdByRole = '',
	moduleDefineShowTypeByRole = '',
	moduleDefineNameByRole = '';

function crfHtmlByRole(data) {
	deletePick();
	var crfData = data;

	for (var i = 0; i < crfData.length; i++) {
		for (var j = 0; j < crfData[i].children.length; j++) {
			var data1 = crfData[i].children[j];
			//moduleDefineIsForm : "1"  CRF  “0” 文件夹
			//moduleDefineType : "DIR"  组件或者文件夹  LEAF 指标
			if (0 == data1.moduleDefineIsForm) {
				if (null != data1.children && "" != data1.children && undefined != data1.children) {
					for (var k = 0; k < data1.children.length; k++) {
						var data2 = data1.children[k];
						//多层文件夹
						if ("0" == data2.moduleDefineIsForm) {
							if ('' != data2.children && null != data2.children && undefined != data2.children) {
								var data2Node_1 = data2.children[0];
								if ("0" == data2Node_1.moduleDefineIsForm) {
									if ('' != data2Node_1.children && null != data2Node_1.children && undefined != data2Node_1.children) {
										var data2Node_2 = data2Node_1.children[0];
										if ("0" == data2Node_2.moduleDefineIsForm) {
											if ('' != data2Node_2.children && null != data2Node_2.children && undefined != data2Node_2.children) {
												var data2Node_3 = data2Node_2.children[0];
												if ("0" == data2Node_3.moduleDefineIsForm) {
													if ('' != data2Node_3.children && null != data2Node_3.children && undefined != data2Node_3.children) {
														var data2Node_4 = data2Node_3.children[0];
														if ("0" == data2Node_4.moduleDefineIsForm) {

														} else {
															moreCrfStrByRole(data2Node_3);
														}
													}
												} else {
													moreCrfStrByRole(data2Node_2);
												}
											}
										} else {
											moreCrfStrByRole(data2Node_1);
										}
									}
								} else {
									moreCrfStrByRole(data2);
								}
							}
						} else {
							crfIndexVal = crfIndexVal + 1;
							crfArray.push(new crfClass(data2.moduleDefineId, crfIndexVal, data2.moduleDefineName));
							if (byRoleFlag == '1') {
								moduleDefineIdByRole = data1.children[0].moduleDefineId,
									moduleDefineShowTypeByRole = data1.children[0].moduleDefineShowType,
									moduleDefineNameByRole = data1.children[0].moduleDefineName;
								console.log('moduleDefineIdByRole=' + moduleDefineIdByRole + '&moduleDefineShowTypeByRole=' + moduleDefineShowTypeByRole +
									'&moduleDefineNameByRole=' + moduleDefineNameByRole);
								byRoleFlag = '2';
							}
						}
					}
				}
			} else {
				crfIndexVal = crfIndexVal + 1;
				crfArray.push(new crfClass(data1.moduleDefineId, crfIndexVal, data1.moduleDefineName));
				if (byRoleFlag == '1') {
					moduleDefineIdByRole = crfData[i].children[0].moduleDefineId,
						moduleDefineShowTypeByRole = crfData[i].children[0].moduleDefineShowType,
						moduleDefineNameByRole = crfData[i].children[0].moduleDefineName;
					console.log('moduleDefineIdByRole=' + moduleDefineIdByRole + '&moduleDefineShowTypeByRole=' + moduleDefineShowTypeByRole +
						'&moduleDefineNameByRole=' + moduleDefineNameByRole);
					byRoleFlag = '2';
				}
			}
		}
	}

	scrollStr = '<ul class="mui-table-view">';
	for (var i = 0; i < crfData.length; i++) {
		for (var j = 0; j < crfData[i].children.length; j++) {
			var data1 = crfData[i].children[j];

			//moduleDefineIsForm : "1"  CRF  “0” 文件夹
			//moduleDefineType : "DIR"  组件或者文件夹  LEAF 指标
			if (0 == data1.moduleDefineIsForm) {
				scrollStr += '<li class="mui-table-view-cell">';
				scrollStr += '<a class="javascript:void(0);">';
				scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
				scrollStr += data1.moduleDefineName;
				scrollStr += '</a>';
				scrollStr += '</li>';
				if (null != data1.children && "" != data1.children && undefined != data1.children) {
					for (var k = 0; k < data1.children.length; k++) {
						var data2 = data1.children[k];

						//多层文件夹
						if ("0" == data2.moduleDefineIsForm) {
							scrollStr += '<li class="mui-table-view-cell">';
							scrollStr += '<a class="javascript:void(0);">';
							scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
							scrollStr += '<span style="color:#2b2b2b">' + data2.moduleDefineName + '</span>';
							scrollStr += '</a>';
							scrollStr += '</li>';
							if ('' != data2.children && null != data2.children && undefined != data2.children) {
								var data2Node_1 = data2.children[0];
								if ("0" == data2Node_1.moduleDefineIsForm) {
									scrollStr += '<li class="mui-table-view-cell">';
									scrollStr += '<a style="padding-left: 30px;" class="javascript:void(0);">';
									scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
									scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
									scrollStr += '<span style="color:#2b2b2b">' + data2Node_1.moduleDefineName + '</span>';
									scrollStr += '</a>';
									scrollStr += '</li>';
									if ('' != data2Node_1.children && null != data2Node_1.children && undefined != data2Node_1.children) {
										var data2Node_2 = data2Node_1.children[0];
										if ("0" == data2Node_2.moduleDefineIsForm) {
											scrollStr += '<li class="mui-table-view-cell">';
											scrollStr += '<a style="padding-left: 60px;" class="javascript:void(0);">';
											scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
											scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
											scrollStr += '<span style="color:#2b2b2b">' + data2Node_2.moduleDefineName + '</span>';
											scrollStr += '</a>';
											scrollStr += '</li>';
											if ('' != data2Node_2.children && null != data2Node_2.children && undefined != data2Node_2.children) {
												var data2Node_3 = data2Node_2.children[0];
												if ("0" == data2Node_3.moduleDefineIsForm) {
													scrollStr += '<li class="mui-table-view-cell">';
													scrollStr += '<a style="padding-left: 80px;" class="javascript:void(0);">';
													scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
													scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
													scrollStr += '<span style="color:#2b2b2b">' + data2Node_2.moduleDefineName + '</span>';
													scrollStr += '</a>';
													scrollStr += '</li>';
													if ('' != data2Node_3.children && null != data2Node_3.children && undefined != data2Node_3.children) {
														var data2Node_4 = data2Node_3.children[0];
														if ("0" == data2Node_4.moduleDefineIsForm) {
															scrollStr += '<li class="mui-table-view-cell">';
															scrollStr += '<a style="padding-left: 80px;" class="javascript:void(0);">';
															scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
															scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
															scrollStr += '<span style="color:#2b2b2b">' + data2Node_4.moduleDefineName + '</span>';
															scrollStr += '</a>';
															scrollStr += '</li>';
														} else {
															scrollStr += moreCrfStrScroll(data2Node_3, '64', '0');
														}
													}
												} else {
													scrollStr += moreCrfStrScroll(data2Node_2, '48', '0');
												}
											}
										} else {
											scrollStr += moreCrfStrScroll(data2Node_1, '32', '0');
										}
									}
								} else {
									scrollStr += moreCrfStrScroll(data2, '16', '0');
								}
							}
						} else {
							sollCrfIndex = sollCrfIndex + 1;
							// if ("currency" != data2.moduleDefineShowType && "" != data2.moduleDefineShowType && null != data2.moduleDefineShowType && undefined != data2.moduleDefineShowType) {
							// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							// } else {
							// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							// }

							var crfModuleDefineShowType = data2.moduleDefineShowType;
							if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
								scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							} else {
								var crfMdst = crfModuleDefineShowType.split(',');
								var crfRoleByMdst = sessionStorage.getItem('role');
								for (var mdst = 0; mdst < crfMdst.length; mdst++) {
									if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else {
										scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									}
								}
							}

							scrollStr += '<div class="mui-row mui-navigate-right">';
							scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
							scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							scrollStr += '</div>';
							scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1">';
							scrollStr += '<i class="mui-icon iconfont icon-wenjian"></i>';
							scrollStr += '</div>';
							scrollStr += '<div class="mui-col-sm-6 mui-col-xs-6" style="color:#2b2b2b">';
							scrollStr += data2.moduleDefineName;
							scrollStr += '</div>';

							var moduleDefineId = data2.moduleDefineId,
								statusName = statusValueMap[moduleDefineId];

							if (statusName != "已完成") {
								if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorF8B551Back">' + statusName + '</div>';
								} else if (statusName == "已提交" || statusName == "已清理") {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 color67d3f0Back">' + statusName + '</div>';
								} else if (statusName == "未录入") {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorfca9c8Back">' + statusName + '</div>';
								} else {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status finishColorBack">' + statusName + '</div>';
								}
							} else {
								scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 finishColorBack">' + statusName + '</div>';
							}
							scrollStr += '</li>';
						}
					}
				}
			} else {
				sollCrfIndex = sollCrfIndex + 1;
				// if ("currency" != data1.moduleDefineShowType && "" != data1.moduleDefineShowType && null != data1.moduleDefineShowType && undefined != data1.moduleDefineShowType) {
				// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
				// } else {
				// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
				// }

				var crfModuleDefineShowType = data1.moduleDefineShowType;
				if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
					scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
				} else {
					var crfMdst = crfModuleDefineShowType.split(',');
					var crfRoleByMdst = sessionStorage.getItem('role');
					for (var mdst = 0; mdst < crfMdst.length; mdst++) {
						if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else {
							scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						}
					}
				}

				scrollStr += '<div class="mui-row mui-navigate-right">';
				scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1">';
				scrollStr += '<i class="mui-icon iconfont icon-wenjian"></i>';
				scrollStr += '</div>';
				scrollStr += '<div class="mui-col-sm-7 mui-col-xs-7" style="color:#2b2b2b;">';
				scrollStr += data1.moduleDefineName;
				scrollStr += '</div>';

				var moduleDefineId = data1.moduleDefineId,
					statusName = statusValueMap[moduleDefineId];

				if (statusName != "已完成") {
					if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorF8B551Back">' + statusName + '</div>';
					} else if (statusName == "已提交" || statusName == "已清理") {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 color67d3f0Back">' + statusName + '</div>';
					} else if (statusName == "未录入") {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorfca9c8Back">' + statusName + '</div>';
					} else {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status finishColorBack">' + statusName + '</div>';
					}

				} else {
					scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 finishColorBack">' + statusName + '</div>';
				}
				//str += '</a>';
				scrollStr += '</li>';
			}
		}
	}

	if ("" == moduleDefineShowTypeByRole || null == moduleDefineShowTypeByRole || undefined == moduleDefineShowTypeByRole) {
		queryModuleTreeOnlyView(moduleDefineIdByRole, 1, moduleDefineNameByRole, 0);
	} else {
		queryModuleTree(moduleDefineIdByRole, 1, moduleDefineNameByRole, 0);
	}

	console.log(crfArray);
}

function moreCrfStrByRole(nodeValue) {
	for (var i = 0; i < nodeValue.children.length; i++) {
		var node = nodeValue.children[i];
		if ("0" != node.moduleDefineIsForm) {
			crfIndexVal = crfIndexVal + 1;
			sollCrfIndex = sollCrfIndex + 1;
			crfArray.push(new crfClass(node.moduleDefineId, crfIndexVal, node.moduleDefineName));
		}
	}
	if (byRoleFlag == '1') {
		moduleDefineIdByRole = nodeValue.children[0].moduleDefineId,
			moduleDefineShowTypeByRole = nodeValue.children[0].moduleDefineShowType,
			moduleDefineNameByRole = nodeValue.children[0].moduleDefineName;
		console.log('moduleDefineIdByRole=' + moduleDefineIdByRole + '&moduleDefineShowTypeByRole=' + moduleDefineShowTypeByRole +
			'&moduleDefineNameByRole=' + moduleDefineNameByRole);
		byRoleFlag = '2';
	}
}




var backIndex = 1;
//查询访视信息
function getSearchVisit() {
	var p = 'visitId=' + visitId + '&patientId=' + patientId + '&' + params;
	mui.ajax(path + 'patient/searchVisit.do?' + p + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				var visit = data.visit;
				var visitIdModify = visit.visitId;
				$("#viewEdit").attr("visitIdModify", visitIdModify);

				if (null != visit.visitTypeName && "" != visit.visitTypeName && undefined != visit.visitTypeName) {
					$("#visitTypeName").html(visit.visitTypeName);
				}
				if (null != visit.visitTimeStr && "" != visit.visitTimeStr && undefined != visit.visitTimeStr) {
					$("#visitTimeStr").html("访视时间:" + visit.visitTimeStr);
				} else {
					$("#visitTimeStr").html("访视时间:");
				}
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//跳转到修改访视页面
var _roleName = sessionStorage.getItem('role');
if (_roleName != 'PATIENT') {
	mui('.mui-content').on('tap', '#viewEdit', function () {
		var visitIdModify = $(this).attr('visitIdModify');
		sessionStorage.setItem("visitIdModify", visitIdModify);
		mui.openWindow({
			url: "patientVisitModify.html",
			id: "patientVisitModify.html"
		})
	});
}


var statusValueMap = [];
//获取CRF

function getCrfData() {
	deletePick();

	var pa = 'visitId=' + sessionStorage.getItem('visitId') + '&patientId=' + sessionStorage.getItem('patientId') +
		'&visitTypeId=' + sessionStorage.getItem('visitTypeId') + '&siteId=' + sessionStorage.getItem("siteId") +
		'&roleId=' + sessionStorage.getItem("roleId") + '&userId=' + sessionStorage.getItem("userId") +
		'&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');

	mui.ajax(path + 'crf/queryModuleTreeIsNotFormByName.do?' + pa + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				var _statusValues = data.statusValue;
				for (var i = 0; i < _statusValues.length; i++) {
					var _obj = _statusValues[i];
					for (var k in _obj) {
						statusValueMap[k] = _obj[k].substring(0, 3);
					}
				}
				crfHtml(data.datas, data.statusValue);
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//拼crf的html
var flagMore = 1;
var scrollStr = '';

function crfClass(crfId, crfIndex, crfName) {
	this.crfId = crfId;
	this.crfIndex = crfIndex;
	this.crfName = crfName;
}
var crfArray = [],
	crfIndexVal = -1,
	sollCrfIndex = 0;

function crfHtml(data) {
	deletePick();
	var crfData = data;

	var str = '<ul class="mui-table-view">';
	for (var i = 0; i < crfData.length; i++) {
		for (var j = 0; j < crfData[i].children.length; j++) {
			var data1 = crfData[i].children[j];

			//moduleDefineIsForm : "1"  CRF  “0” 文件夹
			//moduleDefineType : "DIR"  组件或者文件夹  LEAF 指标
			if (0 == data1.moduleDefineIsForm) {
				str += '<li class="mui-table-view-cell">';
				str += '<a class="javascript:void(0);">';
				str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
				str += '<span style="color:#2b2b2b">' + data1.moduleDefineName + '</span>';
				str += '</a>';
				str += '</li>';
				if (null != data1.children && "" != data1.children && undefined != data1.children) {
					for (var k = 0; k < data1.children.length; k++) {
						var data2 = data1.children[k];

						//多层文件夹
						if ("0" == data2.moduleDefineIsForm) {
							str += '<li class="mui-table-view-cell">';
							str += '<a class="javascript:void(0);">';
							str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
							str += '<span style="color:#2b2b2b">' + data2.moduleDefineName + '</span>';
							str += '</a>';
							str += '</li>';
							if ('' != data2.children && null != data2.children && undefined != data2.children) {
								var data2Node_1 = data2.children[0];
								if ("0" == data2Node_1.moduleDefineIsForm) {
									str += '<li class="mui-table-view-cell">';
									str += '<a style="padding-left: 40px;" class="javascript:void(0);">';
									str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
									str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
									str += '<span style="color:#2b2b2b">' + data2Node_1.moduleDefineName + '</span>';
									str += '</a>';
									str += '</li>';
									if ('' != data2Node_1.children && null != data2Node_1.children && undefined != data2Node_1.children) {
										var data2Node_2 = data2Node_1.children[0];
										if ("0" == data2Node_2.moduleDefineIsForm) {
											str += '<li class="mui-table-view-cell">';
											str += '<a style="padding-left: 60px;" class="javascript:void(0);">';
											str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
											str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
											str += '<span style="color:#2b2b2b">' + data2Node_2.moduleDefineName + '</span>';
											str += '</a>';
											str += '</li>';
											if ('' != data2Node_2.children && null != data2Node_2.children && undefined != data2Node_2.children) {
												var data2Node_3 = data2Node_2.children[0];
												if ("0" == data2Node_3.moduleDefineIsForm) {
													str += '<li class="mui-table-view-cell">';
													str += '<a style="padding-left: 80px;" class="javascript:void(0);">';
													str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
													str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
													str += '<span style="color:#2b2b2b">' + data2Node_2.moduleDefineName + '</span>';
													str += '</a>';
													str += '</li>';
													if ('' != data2Node_3.children && null != data2Node_3.children && undefined != data2Node_3.children) {
														var data2Node_4 = data2Node_3.children[0];
														if ("0" == data2Node_4.moduleDefineIsForm) {
															str += '<li class="mui-table-view-cell">';
															str += '<a style="padding-left: 80px;" class="javascript:void(0);">';
															str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
															str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
															str += '<span style="color:#2b2b2b">' + data2Node_4.moduleDefineName + '</span>';
															str += '</a>';
															str += '</li>';
														} else {
															str += moreCrfStr(data2Node_3, '100', '1');
														}
													}
												} else {
													str += moreCrfStr(data2Node_2, '80', '1');
												}
											}
										} else {
											str += moreCrfStr(data2Node_1, '60', '1');
										}
									}
								} else {
									str += moreCrfStr(data2, '40', '1');
								}
							}
						} else {
							crfIndexVal = crfIndexVal + 1;
							crfArray.push(new crfClass(data2.moduleDefineId, crfIndexVal, data2.moduleDefineName));
							// if ("currency" != data2.moduleDefineShowType && "" != data2.moduleDefineShowType && null != data2.moduleDefineShowType && undefined != data2.moduleDefineShowType) {
							// 	str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTreeOnlyView(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
							// } else {
							// 	str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTree(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
							// }
							console.log('moduleDefineShowType=' + data2.moduleDefineShowType + '&moduleDefineName=' + data2.moduleDefineName);

							var crfModuleDefineShowType = data2.moduleDefineShowType;
							if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
								str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTreeOnlyView(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
							} else {
								var crfMdst = crfModuleDefineShowType.split(',');
								var crfRoleByMdst = sessionStorage.getItem('role');
								for (var mdst = 0; mdst < crfMdst.length; mdst++) {
									if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
										str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTree(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
										break;
									} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
										str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTree(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
										break;
									} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
										str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTree(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
										break;
									} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
										str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTree(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
										break;
									} else {
										str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTreeOnlyView(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';
										break;
									}
								}
							}

							str += '<div class="mui-row mui-navigate-right">';
							str += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
							str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							str += '</div>';
							str += '<div class="mui-col-sm-1 mui-col-xs-1">';
							str += '<i class="mui-icon iconfont icon-wenjian"></i>';
							str += '</div>';
							str += '<div class="mui-col-sm-7 mui-col-xs-7" style="color:#2b2b2b">';
							str += data2.moduleDefineName;
							str += '</div>';

							var moduleDefineId = data2.moduleDefineId,
								statusName = statusValueMap[moduleDefineId];

							if (statusName != "已完成") {
								if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
									str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 colorF8B551">' + statusName + '</div>';
								} else if (statusName == "已提交" || statusName == "已清理") {
									str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 color67d3f0">' + statusName + '</div>';
								} else if (statusName == "未录入") {
									str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 colorfca9c8">' + statusName + '</div>';
								} else {
									str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 finishColor">' + statusName + '</div>';
								}

							} else {
								str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 finishColor">' + statusName + '</div>';
							}
							// str += '</a>';
							str += '</li>';
						}
					}
				}
			} else {
				crfIndexVal = crfIndexVal + 1;
				crfArray.push(new crfClass(data1.moduleDefineId, crfIndexVal, data1.moduleDefineName));

				console.log('moduleDefineShowType=' + data1.moduleDefineShowType + '&moduleDefineName=' + data1.moduleDefineName);
				var crfModuleDefineShowType = data1.moduleDefineShowType;
				if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
					str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTreeOnlyView(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';
				} else {
					var crfMdst = crfModuleDefineShowType.split(',');
					var crfRoleByMdst = sessionStorage.getItem('role');
					for (var mdst = 0; mdst < crfMdst.length; mdst++) {
						if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
							str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTree(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';
							break;
						} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
							str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTree(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';
							break;
						} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTree(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';
							break;
						} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
							str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTree(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';
							break;
						} else {
							str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTreeOnlyView(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';
							break;
						}
					}
				}

				str += '<div class="mui-row mui-navigate-right">';
				str += '<div class="mui-col-sm-1 mui-col-xs-1">';
				str += '<i class="mui-icon iconfont icon-wenjian"></i>';
				str += '</div>';
				str += '<div class="mui-col-sm-8 mui-col-xs-8" style="color:#2b2b2b">';
				str += data1.moduleDefineName;
				str += '</div>';

				var moduleDefineId = data1.moduleDefineId,
					statusName = statusValueMap[moduleDefineId];

				if (statusName != "已完成") {
					if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
						str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 colorF8B551">' + statusName + '</div>';
					} else if (statusName == "已提交" || statusName == "已清理") {
						str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 color67d3f0">' + statusName + '</div>';
					} else if (statusName == "未录入") {
						str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 colorfca9c8">' + statusName + '</div>';
					} else {
						str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 finishColor">' + statusName + '</div>';
					}

				} else {
					str += '<div class="mui-col-sm-2 mui-col-xs-2 col25 finishColor">' + statusName + '</div>';
				}
				//str += '</a>';
				str += '</li>';
			}
		}
	}

	str += '</ul>';

	scrollStr = '<ul class="mui-table-view">';
	for (var i = 0; i < crfData.length; i++) {
		for (var j = 0; j < crfData[i].children.length; j++) {
			var data1 = crfData[i].children[j];

			//moduleDefineIsForm : "1"  CRF  “0” 文件夹
			//moduleDefineType : "DIR"  组件或者文件夹  LEAF 指标
			if (0 == data1.moduleDefineIsForm) {
				scrollStr += '<li class="mui-table-view-cell">';
				scrollStr += '<a class="javascript:void(0);">';
				scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
				scrollStr += data1.moduleDefineName;
				scrollStr += '</a>';
				scrollStr += '</li>';
				if (null != data1.children && "" != data1.children && undefined != data1.children) {
					for (var k = 0; k < data1.children.length; k++) {
						var data2 = data1.children[k];

						//多层文件夹
						if ("0" == data2.moduleDefineIsForm) {
							scrollStr += '<li class="mui-table-view-cell">';
							scrollStr += '<a class="javascript:void(0);">';
							scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
							scrollStr += '<span style="color:#2b2b2b">' + data2.moduleDefineName + '</span>';
							scrollStr += '</a>';
							scrollStr += '</li>';
							if ('' != data2.children && null != data2.children && undefined != data2.children) {
								var data2Node_1 = data2.children[0];
								if ("0" == data2Node_1.moduleDefineIsForm) {
									scrollStr += '<li class="mui-table-view-cell">';
									scrollStr += '<a style="padding-left: 30px;" class="javascript:void(0);">';
									scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
									scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
									scrollStr += '<span style="color:#2b2b2b">' + data2Node_1.moduleDefineName + '</span>';
									scrollStr += '</a>';
									scrollStr += '</li>';
									if ('' != data2Node_1.children && null != data2Node_1.children && undefined != data2Node_1.children) {
										var data2Node_2 = data2Node_1.children[0];
										if ("0" == data2Node_2.moduleDefineIsForm) {
											scrollStr += '<li class="mui-table-view-cell">';
											scrollStr += '<a style="padding-left: 60px;" class="javascript:void(0);">';
											scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
											scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
											scrollStr += '<span style="color:#2b2b2b">' + data2Node_2.moduleDefineName + '</span>';
											scrollStr += '</a>';
											scrollStr += '</li>';
											if ('' != data2Node_2.children && null != data2Node_2.children && undefined != data2Node_2.children) {
												var data2Node_3 = data2Node_2.children[0];
												if ("0" == data2Node_3.moduleDefineIsForm) {
													scrollStr += '<li class="mui-table-view-cell">';
													scrollStr += '<a style="padding-left: 80px;" class="javascript:void(0);">';
													scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
													scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
													scrollStr += '<span style="color:#2b2b2b">' + data2Node_2.moduleDefineName + '</span>';
													scrollStr += '</a>';
													scrollStr += '</li>';
													if ('' != data2Node_3.children && null != data2Node_3.children && undefined != data2Node_3.children) {
														var data2Node_4 = data2Node_3.children[0];
														if ("0" == data2Node_4.moduleDefineIsForm) {
															scrollStr += '<li class="mui-table-view-cell">';
															scrollStr += '<a style="padding-left: 80px;" class="javascript:void(0);">';
															scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
															scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
															scrollStr += '<span style="color:#2b2b2b">' + data2Node_4.moduleDefineName + '</span>';
															scrollStr += '</a>';
															scrollStr += '</li>';
														} else {
															scrollStr += moreCrfStrScroll(data2Node_3, '64', '0');
														}
													}
												} else {
													scrollStr += moreCrfStrScroll(data2Node_2, '48', '0');
												}
											}
										} else {
											scrollStr += moreCrfStrScroll(data2Node_1, '32', '0');
										}
									}
								} else {
									scrollStr += moreCrfStrScroll(data2, '16', '0');
								}
							}
						} else {
							sollCrfIndex = sollCrfIndex + 1;
							// if ("currency" != data2.moduleDefineShowType && "" != data2.moduleDefineShowType && null != data2.moduleDefineShowType && undefined != data2.moduleDefineShowType) {
							// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							// } else {
							// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							// }
							var crfModuleDefineShowType = data2.moduleDefineShowType;
							if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
								scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							} else {
								var crfMdst = crfModuleDefineShowType.split(',');
								var crfRoleByMdst = sessionStorage.getItem('role');
								for (var mdst = 0; mdst < crfMdst.length; mdst++) {
									if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
										scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									} else {
										scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
										break;
									}
								}
							}

							//str += '<a class="mui-navigate-right">';
							scrollStr += '<div class="mui-row mui-navigate-right">';
							scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
							scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							scrollStr += '</div>';
							scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1">';
							scrollStr += '<i class="mui-icon iconfont icon-wenjian"></i>';
							scrollStr += '</div>';
							scrollStr += '<div class="mui-col-sm-6 mui-col-xs-6" style="color:#2b2b2b">';
							scrollStr += data2.moduleDefineName;
							scrollStr += '</div>';

							var moduleDefineId = data2.moduleDefineId,
								statusName = statusValueMap[moduleDefineId];

							if (statusName != "已完成") {
								if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorF8B551Back">' + statusName + '</div>';
								} else if (statusName == "已提交" || statusName == "已清理") {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 color67d3f0Back">' + statusName + '</div>';
								} else if (statusName == "未录入") {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorfca9c8Back">' + statusName + '</div>';
								} else {
									scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status finishColorBack">' + statusName + '</div>';
								}

							} else {
								scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 finishColorBack">' + statusName + '</div>';
							}
							// str += '</a>';
							scrollStr += '</li>';
						}
					}
				}
			} else {
				sollCrfIndex = sollCrfIndex + 1;
				// if ("currency" != data1.moduleDefineShowType && "" != data1.moduleDefineShowType && null != data1.moduleDefineShowType && undefined != data1.moduleDefineShowType) {
				// 	scrollStr += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTreeOnlyView(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + (sollCrfIndex * 1 - 1 * 1) + ')">';
				// } else {
				// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
				// }

				var crfModuleDefineShowType = data1.moduleDefineShowType;
				if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
					scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data1) + '  moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
				} else {
					var crfMdst = crfModuleDefineShowType.split(',');
					var crfRoleByMdst = sessionStorage.getItem('role');
					for (var mdst = 0; mdst < crfMdst.length; mdst++) {
						if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						} else {
							scrollStr += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(data1) + '  moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							break;
						}
					}
				}

				scrollStr += '<div class="mui-row mui-navigate-right">';
				scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1">';
				scrollStr += '<i class="mui-icon iconfont icon-wenjian"></i>';
				scrollStr += '</div>';
				scrollStr += '<div class="mui-col-sm-7 mui-col-xs-7" style="color:#2b2b2b">';
				scrollStr += data1.moduleDefineName;
				scrollStr += '</div>';

				var moduleDefineId = data1.moduleDefineId,
					statusName = statusValueMap[moduleDefineId];

				if (statusName != "已完成") {
					if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorF8B551Back">' + statusName + '</div>';
					} else if (statusName == "已提交" || statusName == "已清理") {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 color67d3f0Back">' + statusName + '</div>';
					} else if (statusName == "未录入") {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 colorfca9c8Back">' + statusName + '</div>';
					} else {
						scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status finishColorBack">' + statusName + '</div>';
					}

				} else {
					scrollStr += '<div class="mui-col-sm-3 mui-col-xs-3 col25 finishColorBack">' + statusName + '</div>';
				}
				//str += '</a>';
				scrollStr += '</li>';
			}
		}
	}

	str += '</ul>';

	backIndex = 1;
	$("#crfGroupDiv").html(str);

	backController();

	console.log(crfArray)

}

function moreCrfStr(nodeValue, sty, index) {

	var str = '';

	for (var i = 0; i < nodeValue.children.length; i++) {
		var node = nodeValue.children[i];
		if ("0" != node.moduleDefineIsForm) {
			crfIndexVal = crfIndexVal + 1;
			sollCrfIndex = sollCrfIndex + 1
			crfArray.push(new crfClass(node.moduleDefineId, crfIndexVal, node.moduleDefineName));

			// if ("currency" != node.moduleDefineShowType && "" != node.moduleDefineShowType && null != node.moduleDefineShowType && undefined != node.moduleDefineShowType) {
			// 	str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTreeOnlyView(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
			// } else {
			// 	if (index == 1) {
			// 		str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
			// 	} else {
			// 		str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
			// 	}
			// }
			console.log('moduleDefineShowType=' + node.moduleDefineShowType + '&moduleDefineName=' + node.moduleDefineName);

			var crfModuleDefineShowType = node.moduleDefineShowType;
			if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
				str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTreeOnlyView(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
			} else {
				var crfMdst = crfModuleDefineShowType.split(',');
				var crfRoleByMdst = sessionStorage.getItem('role');
				for (var mdst = 0; mdst < crfMdst.length; mdst++) {
					if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else {
						str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTreeOnlyView(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						break;
					}
				}
			}

			//str += '<a class="mui-navigate-right">';
			str += '<div class="mui-row mui-navigate-right" style="padding-left:' + sty + 'px;">';
			str += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
			str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
			str += '</div>';
			str += '<div class="mui-col-sm-1 mui-col-xs-1">';
			str += '<i class="mui-icon iconfont icon-wenjian"></i>';
			str += '</div>';
			str += '<div class="mui-col-sm-6 mui-col-xs-6" style="color:#2b2b2b">';
			str += node.moduleDefineName;
			str += '</div>';

			var moduleDefineId = node.moduleDefineId,
				statusName = statusValueMap[moduleDefineId];

			if (statusName != "已完成") {
				if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row-status colorF8B551">' + statusName + '</div>';
				} else if (statusName == "已提交" || statusName == "已清理") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row--status color67d3f0">' + statusName + '</div>';
				} else if (statusName == "未录入") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row--status colorfca9c8">' + statusName + '</div>';
				} else {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row--status finishColor">' + statusName + '</div>';
				}

			} else {
				str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row--status finishColor">' + statusName + '</div>';
			}
			// str += '</a>';
			str += '</li>';
		} else {
			str += '<li class="mui-table-view-cell" style="padding-left:' + (sty * 1 - 5 * 1) + 'px;">';
			str += '<a class="javascript:void(0);">';
			str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
			str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
			str += '<span style="color:#2b2b2b">' + node.moduleDefineName + '</span>';
			str += '</a>';
			str += '</li>';
		}
	}

	return str;

}

function moreCrfStrScroll(nodeValue, sty, index) {
	var str = '';
	for (var i = 0; i < nodeValue.children.length; i++) {
		var node = nodeValue.children[i];
		if ("0" != node.moduleDefineIsForm) {
			crfIndexVal = crfIndexVal + 1;
			sollCrfIndex = sollCrfIndex + 1
			// if ("currency" != node.moduleDefineShowType && "" != node.moduleDefineShowType && null != node.moduleDefineShowType && undefined != node.moduleDefineShowType) {
			// 	str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTreeOnlyView(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
			// } else {
			// 	if (index == 1) {
			// 		str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
			// 	} else {
			// 		str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
			// 	}
			// }

			var crfModuleDefineShowType = node.moduleDefineShowType;
			if ('' == crfModuleDefineShowType || null == crfModuleDefineShowType || undefined == crfModuleDefineShowType) {
				str += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(node) + '  moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
			} else {
				var crfMdst = crfModuleDefineShowType.split(',');
				var crfRoleByMdst = sessionStorage.getItem('role');
				for (var mdst = 0; mdst < crfMdst.length; mdst++) {
					if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
						if (index == 1) {
							str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ')">';
						} else {
							str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '" ' + angularFunction(node) + ' >';
						}
						break;
					} else {
						str += '<li class="mui-table-view-cell sollLiOnlyView" ' + angularFunction(node) + ' moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + ' ">';
						break;
					}
				}
			}

			str += '<div class="mui-row mui-navigate-right side-row" style="padding-left:' + sty + 'px;">';
			str += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
			str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
			str += '</div>';
			str += '<div class="mui-col-sm-1 mui-col-xs-1">';
			str += '<i class="mui-icon iconfont icon-wenjian"></i>';
			str += '</div>';
			str += '<div class="mui-col-sm-7 mui-col-xs-7" style="color:#2b2b2b">&nbsp;';
			str += node.moduleDefineName;
			str += '</div>';

			var moduleDefineId = node.moduleDefineId,
				statusName = statusValueMap[moduleDefineId];

			if (statusName != "已完成") {
				if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status colorF8B551Back">' + statusName + '</div>';
				} else if (statusName == "已提交" || statusName == "已清理") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status color67d3f0Back">' + statusName + '</div>';
				} else if (statusName == "未录入") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status colorfca9c8Back">' + statusName + '</div>';
				} else {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status finishColorBack">' + statusName + '</div>';
				}

			} else {
				str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 side-status finishColorBack">' + statusName + '</div>';
			}
			// str += '</a>';
			str += '</li>';
		} else {
			str += '<li class="mui-table-view-cell" style="padding-left:' + (sty * 1 - 5 * 1) + 'px;">';
			str += '<a class="javascript:void(0);">';
			str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
			str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
			str += '<span style="color:#2b2b2b">' + node.moduleDefineName + '</span>';
			str += '</a>';
			str += '</li>';
		}
	}

	return str;
}

//获取CRF树下的指标和组件

var isdatasValue = '';
var datasValueMap = [];
var saveDataModuleDefineId = '';
var publicIsCompleted  = ''
var notInSameCrfCodes = "";
var notInSameModuleCodes = "";
var notInSameModuleCodes_backup = '';
var notInSameCrfCodes_backup = '';
var _crfFlag = '';

function queryModuleTree(moduleDefineId, index, name, crfFlag) {

	deletePick();
	titleController(name);

	saveDataModuleDefineId = moduleDefineId;

	var queryParams = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId') + '&moduleDefineId=' + moduleDefineId + '&visitId=' + sessionStorage.getItem('visitId') +
		'&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId') + paramsAcc;

	mui.ajax(path + 'crf/queryModuleTreeIsCrfByModuleDefineId.do?' + queryParams, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				$('.tableDatasIsReq').each(function () {
					$(this).remove();
				});

				isdatasValue = data.datas;
				publicIsCompleted  = data.isCompleted;
				notInSameCrfCodes = "";
				notInSameModuleCodes = "";
				var _notSameModuleAry = data.datas[0].notInSameModuleCodes;
				for (var m = 0; m < _notSameModuleAry.length; m++) {
					var _code = _notSameModuleAry[m].replace("%s", "");
					if (m == _notSameModuleAry.length - 1) {
						notInSameModuleCodes += _code;
					} else {
						notInSameModuleCodes += _code + ",";
					}

				}
				var _notSameCrfAry = data.datas[0].notInSameCRFCodes;
				for (var m = 0; m < _notSameCrfAry.length; m++) {
					var _code = _notSameCrfAry[m].replace("%s", "");
					if (m == _notSameCrfAry.length - 1) {
						notInSameCrfCodes += _code;
					} else {
						notInSameCrfCodes += _code + ",";
					}

				}
				_crfFlag = crfFlag;
				queryModuleTreeHtml(data.datas, index, "", crfFlag);

			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

function queryModuleTreeOnlyView(moduleDefineId, index, name, crfFlag) {
	deletePick();
	titleController(name);

	saveDataModuleDefineId = moduleDefineId;

	var queryParams = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId') + '&moduleDefineId=' + moduleDefineId + '&visitId=' + sessionStorage.getItem('visitId') +
		'&researchLibraryId=' + sessionStorage.getItem('scientificResearchLibraryId');

	mui.ajax(path + 'crf/queryModuleTreeIsCrfByModuleDefineId.do?' + queryParams + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				isdatasValue = data.datas;
				//publicIsCompleted = data.isCompleted;
				notInSameCrfCodes = "";
				notInSameModuleCodes = "";
				var _notSameModuleAry = data.datas[0].notInSameModuleCodes;
				for (var m = 0; m < _notSameModuleAry.length; m++) {
					var _code = _notSameModuleAry[m].replace("%s", "");
					if (m == _notSameModuleAry.length - 1) {
						notInSameModuleCodes += _code;
					} else {
						notInSameModuleCodes += _code + ",";
					}

				}
				var _notSameCrfAry = data.datas[0].notInSameCRFCodes;
				for (var m = 0; m < _notSameCrfAry.length; m++) {
					var _code = _notSameCrfAry[m].replace("%s", "");
					if (m == _notSameCrfAry.length - 1) {
						notInSameCrfCodes += _code;
					} else {
						notInSameCrfCodes += _code + ",";
					}

				}

				queryModuleTreeHtmlOnlyView(data.datas, index, "", crfFlag);
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//拼接CRF树下的指标和组件
var saveTableSucccess = '';
var titleMap = [];

function queryModuleTreeHtmlOnlyView(node, indexValue, obj, crfFlag) {
	if (obj != null) {
		var disableVal = $(obj).parent().attr("disabled");
		if (disableVal == "disabled") {
			return false;
		}
	}

	deletePick();

	var str = '';

	// str += '<div id="offCanvasWrapper" class="mui-off-canvas-wrap mui-draggable">';
	// str += '<aside id="offCanvasSide" class="mui-off-canvas-left">';
	// str += '<div id="offCanvasSideScroll" class="mui-scroll-wrapper">';
	// str += '<div class="mui-scroll" id="muiScroll">';
	// str += '</div>';
	// str += '</div>';
	// str += '</aside>';

	//str += '<div class="mui-inner-wrap">';
	// str += '<header style="margin-top: 10px;" class="mui-bar mui-bar-nav mulu-class">';
	var muiBar = '<a class="mui-icon iconfont icon-mulu mulu-color-class">目录</a>';
	muiBar += '<a class="mui-action-back mui-btn mui-btn-link mui-pull-right mulu-color-class">' + (crfFlag*1 + 1*1) + '/' + crfArray.length + '</a>';

	// str += '</header>';
	// str += '<div id="offCanvasContentScroll" class="mui-content mui-scroll-wrapper">';
	// str += '<div class="mui-scroll">';

	var crfFieldsStr = "";

	if (node.length > 0) {
		str += '<div class="mui-content mui-input-group muiGroupFirst" ' + angularFunction(node[0]) + '>';

		for (var i = 0; i < node.length; i++) {
			//组件
			if (node[i].moduleDefineType == "DIR") {
				var nodeDate = node[i].children;
				for (var j = 0; j < nodeDate.length; j++) {
					crfFieldsStr += nodeDate[j].moduleDefineCode + ",";
					var dataVal = nodeDate[j];
					if (nodeDate[j].moduleDefineType == "LEAF") {
						str += '<div class="mui-input-row dir-calss" ' + angularFunction(dataVal) + '>';
						if (nodeDate[j].projectDefine.projectDefineWebType != "CHECKBOX") {
							str += '<label class="dir-label">' + nodeDate[j].moduleDefineName + '</label>';
						} else {
							str += '<div style="padding: 11px 15px;">' + nodeDate[j].moduleDefineName + '</div>';
						}
						if (nodeDate[j].projectDefine.projectDefineWebType == "DATETIMEPICKER") {
							str += angularFunctionInput(nodeDate[j], "btnClass mui-input-clear dir-label-clear", -1, false);
						} else {
							str += angularFunctionInput(nodeDate[j], "mui-input-clear dir-label-clear", -1, false);
						}
						if ("" != nodeDate[j].unitDefine && null != nodeDate[j].unitDefine && undefined != nodeDate[j].unitDefine) {
							str += '<div class="dir-span">' + nodeDate[j].unitDefine.unitDefineValue + '</div>';
						}
						str += '</div>';
					} else if (nodeDate[j].moduleDefineType == "DIR") {
						var nodeDir = js.lang.String.encodeHtml(JSON.stringify(nodeDate[j]));
						var nodeLeaf = js.lang.String.encodeHtml(JSON.stringify(nodeDate[j].children));
						//表格
						if (nodeDate[j].moduleDefineIsDatas == '1') {
							str += '<div class="mui-content mui-input-group" ' + angularFunction(dataVal) + '>';
							//saveTableSucccess = nodeDate[j];
							str += '<ul class="mui-table-view">';
							str += '<li class="mui-table-view-cell">';
							str += '<a class="mui-navigate-right" onclick="queryIsDatasHtml(' + nodeDir + ')">';
							str += '<i class="mui-icon iconfont icon-iconfont-wenjian"></i>';
							str += nodeDate[j].moduleDefineName;
							str += '</a>';
							str += '</li>';
							str += '</ul>';
							str += '</div>';
						}
						//非表格
						else if (nodeDate[j].moduleDefineIsDatas == '0') {
							str += '<div class="mui-content mui-input-group" ' + angularFunction(dataVal) + '>';
							str += '<ul class="mui-table-view">';
							str += '<li class="mui-table-view-cell dir-title">';
							str += nodeDate[j].moduleDefineName;
							str += '</li>';
							str += '</ul>';

							for (var a = 0; a < nodeDate[j].children.length; a++) {
								var node_a = nodeDate[j].children[a];
								crfFieldsStr += node_a.moduleDefineCode + ",";

								str += '<div class="mui-input-row dir-calss" ' + angularFunction(node_a) + '>';

								if (node_a.projectDefine.projectDefineWebType != "CHECKBOX") {
									str += '<label class="dir-label">' + node_a.moduleDefineName + '</label>';
								} else {
									str += '<div style="padding: 11px 15px;">' + node_a.moduleDefineName + '</div>';
								}

								if (node_a.projectDefine != undefined) {
									if (node_a.projectDefine.projectDefineWebType == "DATETIMEPICKER") {

										str += angularFunctionInput(node_a, "btnClass mui-input-clear dir-label-clear", -1, false);
									} else {
										str += angularFunctionInput(node_a, "mui-input-clear dir-label-clear", -1, false);
									}
								}

								if (null != node_a.unitDefine && "" != node_a.unitDefine && undefined != node_a.unitDefine) {
									str += '<div class="dir-span">' + node_a.unitDefine.unitDefineValue + '</div>';
								}
								str += '</div>';
							}
							str += '</div>';
						}
					}
				}
			} else if (node[i].moduleDefineType == "LEAF") {
				crfFieldsStr += node[i].moduleDefineCode + ",";

				str += '<div class="mui-input-row dir-calss" ' + angularFunction(node[i]) + '>';

				/*if(node[i].moduleDefineType == "LEAF") {
					str += '<a class="huanhang ui-flex" href="javascript:void(0);">';
				} else if(node[i].moduleDefineType == "DIR") {
					var nodeDir = js.lang.String.encodeHtml(JSON.stringify(node[i].children));
					str += '<a onclick="queryModuleTreeHtml(' + nodeDir + ',0,this)">';
				}*/


				if (node[i].projectDefine.projectDefineWebType != "CHECKBOX") {
					str += '<label class="dir-label">' + node[i].moduleDefineName + '</label>';
				} else {
					str += '<div style="padding: 11px 15px;">' + node[i].moduleDefineName + '</div>';
				}

				if (node[i].projectDefine.projectDefineWebType == "DATETIMEPICKER") {
					str += angularFunctionInput(node[i], "btnClass mui-input-clear dir-label-clear", -1, false);
				} else {
					str += angularFunctionInput(node[i], "mui-input-clear dir-label-clear", -1, false);
				}

				if (null != node[i].unitDefine && "" != node[i].unitDefine && undefined != node[i].unitDefine) {
					str += '<div class="dir-span">' + node[i].unitDefine.unitDefineValue + '</div>';
				}
				str += '</div>';
			}
		}
		str += '</div>';

	} else {
		str += '<div class="textCenter">';
		str += '<img src="../../assets/image/no-data-tip.png" alt="" />';
		str += '<p>暂无数据</p>';
		str += '</div>';
		return false;
	}

	$('.mui-off-canvas-wrap').css('overflow', 'initial');

	$("#crfItems").val(crfFieldsStr);
	$("#notInSameModuleCodes").val(notInSameModuleCodes);
	notInSameModuleCodes_backup = notInSameModuleCodes;
	$("#notInSameCrfCodes").val(notInSameCrfCodes);
	notInSameCrfCodes_backup = notInSameCrfCodes;

	var $div = $(str);
	var $muiBar = $(muiBar);
	//var $saveDataCrfStr = $(saveDataCrfStr);
	if (indexValue == 1) {
		//$("#dirAndLeaf").empty();
		backIndex = 21;
		//$("#dirAndLeaf").html($div);
		$("#muiBar").html(muiBar);
		//$("#saveDataCrf").html(saveDataCrfStr);

		$("#offCanvasContentScroll .mui-scroll").html(
			$div
		);
		backController();
		// mui('.mui-off-canvas-wrap').offCanvas().show();
		// mui('.mui-off-canvas-wrap').offCanvas().close();
		mui('#offCanvasSideScroll').scroll();
		mui('#offCanvasContentScroll').scroll();

	} else {
		// $("#dirAndLeafCopy").empty();
		// backIndex = 22;
		// $("#dirAndLeaf").hide();
		// $("#dirAndLeafCopy").html($div);

		// backController();
	}

	var $_scrollStr = $(scrollStr);
	$('#muiScroll').html($_scrollStr);
	parseScope($_scrollStr);

	//侧滑导航点击  可保存
	mui('.mui-table-view').on('tap', '.sollLi', function () {
		queryModuleTree($(this).attr('moduledefineid'), $(this).attr('index'), $(this).attr('moduledefinename'), $(this).attr('sollcrfindex'));
		mui('.mui-off-canvas-wrap').offCanvas().close();
	});

	//侧滑导航点击 不可保存
	mui('.mui-table-view').on('tap', '.sollLiOnlyView', function () {
		queryModuleTreeOnlyView($(this).attr('moduledefineid'), $(this).attr('index'), $(this).attr('moduledefinename'), $(this).attr('sollcrfindex'));
		mui('.mui-off-canvas-wrap').offCanvas().close();
	});

	//保存CRF点击
	mui('.mui-row').on('tap', '#saveCrf', function () {
		var crfId = $(this).attr('crfId'),
			crfName = $(this).attr('crfName'),
			crfIndex = $(this).attr('crfIndex');

		saveDataCrf(crfId, '1', crfName, crfIndex);
	});

	//目录按钮点击
	mui('#muiBar').on('tap', '.icon-mulu', function () {
		mui('.mui-off-canvas-wrap').offCanvas().show();
	});

	//表格点击
	mui('.mui-table-view-cell').on('tap', '.mui-navigate-right', function () {
		$(this).click();
	});

	parseScope($div);

	alertDatePick();
	delUploadImage();
	addImgUpload();

	isCompletedController();

	$("#setDataValue").click();

	$('.dir-label').each(function () {
		var obj = $(this).next();
		if (obj.get(0).tagName == 'DIV') {
			$(this).css('width', '60%');
		}
	});

	//页面定位到顶部
	mui('#offCanvasContentScroll').scroll().scrollTo(0, 0, 100);

	$('.sollLiOnlyView').each(function () {
		var sollcrfindex = $(this).attr('sollcrfindex');
		if (sollcrfindex == crfFlag) {
			$(this).css('background-color', '#e7f3f9');
		}
	});

	$("#saveDataCrf").hide();

}

//表格型展示方式
var table_name = '';

function queryIsDatasHtmlOnlyView(node) {
	deletePick();

	wechart_tableModuleDefineCode = new Array();
	table_name = node.moduleDefineName;
	titleController(table_name);

	var crfFieldsStr = '';
	var tableModuleCode = node.moduleDefineCode;
	var _ary = new Array();
	_ary.push(node);
	datasValueMap[tableModuleCode] = _ary;
	var str = '';

	str += '<div id="table_div" tableModuleCode="' + tableModuleCode + '" onlyView="1"  class="crf-table-thead"></div>';

	//	str += '<ul class="mui-table-view">';

	for (var i = 0; i < node.children.length; i++) {
		var nodeParient = node.children[i];

		if (nodeParient.moduleDefineType == "LEAF") {
			wechart_tableModuleDefineCode.push(nodeParient.moduleDefineCode);
			crfFieldsStr += nodeParient.moduleDefineCode + ",";
		}
	}

	$("#crfItems").val(crfFieldsStr);

	backIndex = 3;

	$("#isDatasNode").empty();

	var $div = $(str);
	$("#isDatasNode").html($div);
	parseScope($div);

	$("#setDataValue").click();

	backController();
}

//跳转到添加组件页面

function addIsdatasOnlyView(node, rowNum) {
	deletePick();
	var crfFieldsStr = '';

	var saveTableData = '';

	var str = '';
	str += '<form class="mui-input-group">';
	str += '<ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">';

	for (var i = 0; i < node.length; i++) {
		var nodeIsdata = node[i];
		saveTableData = nodeIsdata;
		for (var j = 0; j < nodeIsdata.children.length; j++) {
			var nodeLeafAndDir = nodeIsdata.children[j];
			crfFieldsStr += nodeLeafAndDir.moduleDefineCode + ",";

			if (nodeLeafAndDir.moduleDefineType == "DIR" && nodeLeafAndDir.moduleDefineIsDatas == "1") {

				for (var k = 0; k < nodeLeafAndDir.children.length; k++) {
					var node_html = nodeLeafAndDir.children[k];
					crfFieldsStr += node_html.moduleDefineCode + ",";
					if (node_html.moduleDefineType == "DIR") {

						for (var a = 0; a < node_html.children.length; a++) {
							crfFieldsStr += node_html.children[a].moduleDefineCode + ",";
						}

						var nodeDirData = js.lang.String.encodeHtml(JSON.stringify(node_html));

						str += '<li class="mui-table-view-cell"  onclick="addIsdatasChildrenOnlyView(' + nodeDirData + ',' + rowNum + ')">';

						str += '<a class="mui-navigate-right">';
						str += '<img class="groupIcon" src="../../assets/image/group.png" alt="">';
						str += '<span>' + node_html.moduleDefineName + '</span>';
						str += '</a>';

						str += '</li>';
					} else {

						str += '<li class="mui-table-view-cell">';
						str += '<div class="ui-flex">';

						str += '<div class="ui-flex-item">';
						str += '<label>' + node_html.moduleDefineName + '</label>';
						str += '</div>';

						str += '<div class="mui-text-right">';
						if (node_html.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
							str += angularFunctionInput_onlyView(node_html, "btn mui-btn-block btnClass textRight", rowNum);
						} else {
							str += angularFunctionInput_onlyView(node_html, "btn mui-btn-block textRight", rowNum);
						}

						str += '</div>';
						str += '</div>';
						str += '</li>';
					}

				}
			} else if (nodeLeafAndDir.moduleDefineType == "LEAF") {
				crfFieldsStr += nodeLeafAndDir.moduleDefineCode + ",";
				str += '<li class="mui-table-view-cell">';
				str += '<div class="ui-flex">';

				str += '<div class="ui-flex-item">';
				str += '<label>' + nodeLeafAndDir.moduleDefineName + '</label>';
				str += '</div>';

				str += '<div class="mui-text-right">';
				if (nodeLeafAndDir.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
					str += angularFunctionInput_onlyView(nodeLeafAndDir, "btn mui-btn-block btnClass textRight", rowNum);
				} else {
					str += angularFunctionInput_onlyView(nodeLeafAndDir, "btn mui-btn-block textRight", rowNum);
				}

				str += '</div>';
				str += '</div>';
				str += '</li>';
			}

			/*else if(nodeLeafAndDir.moduleDefineType == "DIR" && nodeLeafAndDir.moduleDefineIsDatas == "0"){
				 for(var n = 0; n < nodeLeafAndDir.children.children.length; n++){
				 var _node_html = nodeLeafAndDir.children[n];
	
				 str += '<li class="mui-table-view-cell">';
				 str += '<div class="mui-table">';
				 str += '<div class="mui-table-cell mui-col-xs-1">';
				 str += '<span class="mui-icon mui-icon-info"></span>';
				 str += '</div>';
				 str += '<div class="mui-table-cell mui-col-xs-4">';
				 str += '<label>'+_node_html.moduleDefineName+'</label>';
				 str += '</div>';
				 str += '<div class="mui-table-cell mui-col-xs-7 mui-text-right">';
				 str += '<input type="text" class="btn mui-btn-block btnClass textRight">';
				 str += '</div>';
				 str += '</div>';
				 str += '</li>';
	
				 }
				 }*/

		}
	}
	str += '</form>';
	str += '</ul>';

	var nodeValue = js.lang.String.encodeHtml(JSON.stringify(saveTableData));

	/*if(rowNum == 0){
		str +='<button type="button" id="saveTableData" moduleDefines="'+nodeValue+'" rowNum="-1" tableModuleCode="'+node[0].moduleDefineCode+'" class="mui-btn mui-btn-block btnSave" onclick="saveTableData(this)">';
		str +='<img class="save-white" src="../../assets/image/save-white.png" alt="" />保存';
		str +='</button>';
	}else{
		str +='<button type="button" id="saveTableData" moduleDefines="'+nodeValue+'" rowNum="'+rowNum+'" tableModuleCode="'+node[0].moduleDefineCode+'" class="mui-btn mui-btn-block btnSave" onclick="updateTableData(this)">';
		str +='<img class="save-white" src="../../assets/image/save-white.png" alt="" />修改';
		str +='</button>';
	}*/

	//$("#isDatasNode").hide();

	backIndex = 4;

	$("#crfItems").val(crfFieldsStr);

	$("#isDatasAdd").empty();
	var $div = $(str);
	$("#isDatasAdd").html($div);
	parseScope($div);

	alertDatePick();
	delUploadImage();
	addImgUpload();

	$("#setDataValue").click();

	backController();

	$(".mui-text-right").css('text-align', 'inherit');
	$(".patient-group-detail .btn-choicecircle input").css('float', 'right');
	//$(".btn-choicebox label").css('float','left');
	$(".mui-btn-block").css('display', 'initial');

}

//拼组件下面的Leaf 最后一层
function addIsdatasChildrenOnlyView(node, rownum) {
	deletePick();
	var crfFieldsStr = '';
	var str = '';
	str += '<form class="mui-input-group">';
	str += '<ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">';
	for (var i = 0; i < node.children.length; i++) {
		var nodeData = node.children[i];
		crfFieldsStr += nodeData.moduleDefineCode + ",";
		str += '<li class="mui-table-view-cell">';
		str += '<div class="ui-flex">';

		str += '<div class="ui-flex-cell">';
		str += '<label>' + nodeData.moduleDefineName + '</label>';
		str += '</div>';
		str += '<div class="mui-text-right">';
		if (nodeData.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
			str += angularFunctionInput_onlyView(nodeData, 'btn mui-btn-block btnClass textRight', rownum);
		} else {
			str += angularFunctionInput_onlyView(nodeData, 'btn mui-btn-block textRight', rownum);
		}

		str += '</div>';
		str += '</div>';
		str += '</li>';
	}
	str += '</form>';
	str += '</ul>';

	backIndex = 5;

	$("#crfItemsB").val(crfFieldsStr);

	$("#addGroupEnd").empty();
	var $div = $(str);
	$("#addGroupEnd").html($div);
	parseScope($div);

	alertDatePick();
	delUploadImage();
	addImgUpload();

	backController();
}

function queryModuleTreeHtml(node, indexValue, obj, crfFlag) {
	if (obj != null) {
		var disableVal = $(obj).parent().attr("disabled");
		if (disableVal == "disabled") {
			return false;
		}
	}

	deletePick();

	var str = '';

	// str += '<div id="offCanvasWrapper" class="mui-off-canvas-wrap mui-draggable">';
	// str += '<aside id="offCanvasSide" class="mui-off-canvas-left">';
	// str += '<div id="offCanvasSideScroll" class="mui-scroll-wrapper">';
	// str += '<div class="mui-scroll" id="muiScroll">';
	// str += '</div>';
	// str += '</div>';
	// str += '</aside>';

	//str += '<div class="mui-inner-wrap">';
	// str += '<header style="margin-top: 10px;" class="mui-bar mui-bar-nav mulu-class">';
	var muiBar = '<a class="mui-icon iconfont icon-mulu mulu-color-class">目录</a>';
	muiBar += '<a class="mui-action-back mui-btn mui-btn-link mui-pull-right mulu-color-class">' + (crfFlag*1 + 1*1) + '/' + crfArray.length + '</a>';

	// str += '</header>';
	// str += '<div id="offCanvasContentScroll" class="mui-content mui-scroll-wrapper">';
	// str += '<div class="mui-scroll">';

	var crfFieldsStr = "";
	var isDatasStr = "";

	if (node.length > 0) {
		str += '<div class="mui-content mui-input-group muiGroupFirst" ' + angularFunction(node[0]) + '>';

		for (var i = 0; i < node.length; i++) {
			//组件
			if (node[i].moduleDefineType == "DIR") {
				var nodeDate = node[i].children;
				for (var j = 0; j < nodeDate.length; j++) {
					crfFieldsStr += nodeDate[j].moduleDefineCode + ",";
					var dataVal = nodeDate[j];
					if (nodeDate[j].moduleDefineType == "LEAF") {
						str += '<div class="mui-input-row dir-calss" ' + angularFunction(dataVal) + '>';
						if (nodeDate[j].projectDefine.projectDefineWebType != "CHECKBOX") {
							str += '<label class="dir-label">' + nodeDate[j].moduleDefineName + '</label>';
						} else {
							str += '<div style="padding: 11px 15px;">' + nodeDate[j].moduleDefineName + '</div>';
						}

						if (nodeDate[j].projectDefine.projectDefineWebType == "DATETIMEPICKER") {
							str += angularFunctionInput(nodeDate[j], "btnClass mui-input-clear dir-label-clear", -1, false);
						} else {
							str += angularFunctionInput(nodeDate[j], "mui-input-clear dir-label-clear", -1, false);
						}
						if ("" != nodeDate[j].unitDefine && null != nodeDate[j].unitDefine && undefined != nodeDate[j].unitDefine) {
							str += '<div class="dir-span">' + nodeDate[j].unitDefine.unitDefineValue + '</div>';
						}
						str += '</div>';
					} else if (nodeDate[j].moduleDefineType == "DIR") {
						var nodeDir = js.lang.String.encodeHtml(JSON.stringify(nodeDate[j]));
						var nodeLeaf = js.lang.String.encodeHtml(JSON.stringify(nodeDate[j].children));
						//表格
						if (nodeDate[j].moduleDefineIsDatas == '1') {
							str += '<div class="mui-content mui-input-group" ' + angularFunction(dataVal) + '>';
							//saveTableSucccess = nodeDate[j];
							str += '<ul class="mui-table-view">';
							str += '<li class="mui-table-view-cell">';
							str += '<a class="mui-navigate-right" onclick="queryIsDatasHtml(' + nodeDir + ')">';
							str += '<i class="mui-icon iconfont icon-iconfont-wenjian"></i>';
							str += nodeDate[j].moduleDefineName;
							str += '</a>';
							str += '</li>';
							str += '</ul>';
							str += '</div>';

							isDatasStr += tableHideData(nodeDate[j]);

						}
						//非表格
						else if (nodeDate[j].moduleDefineIsDatas == '0') {
							str += '<div class="mui-content mui-input-group" ' + angularFunction(dataVal) + '>';
							str += '<ul class="mui-table-view">';
							str += '<li class="mui-table-view-cell dir-title">';
							str += nodeDate[j].moduleDefineName;
							str += '</li>';
							str += '</ul>';

							for (var a = 0; a < nodeDate[j].children.length; a++) {
								var node_a = nodeDate[j].children[a];
								crfFieldsStr += node_a.moduleDefineCode + ",";

								str += '<div class="mui-input-row dir-calss" ' + angularFunction(node_a) + '>';

								if (node_a.projectDefine.projectDefineWebType != "CHECKBOX") {
									str += '<label class="dir-label">' + node_a.moduleDefineName + '</label>';
								} else {
									str += '<div style="padding: 11px 15px;">' + node_a.moduleDefineName + '</div>';
								}
								if (node_a.projectDefine != undefined) {
									if (node_a.projectDefine.projectDefineWebType == "DATETIMEPICKER") {

										str += angularFunctionInput(node_a, "btnClass mui-input-clear dir-label-clear", -1, false);
									} else {
										str += angularFunctionInput(node_a, "mui-input-clear dir-label-clear", -1, false);
									}
								}

								if (null != node_a.unitDefine && "" != node_a.unitDefine && undefined != node_a.unitDefine) {
									str += '<div class="dir-span">' + node_a.unitDefine.unitDefineValue + '</div>';
								}
								str += '</div>';
							}
							str += '</div>';
						}
					}
				}
			} else if (node[i].moduleDefineType == "LEAF") {
				crfFieldsStr += node[i].moduleDefineCode + ",";

				str += '<div class="mui-input-row dir-calss" ' + angularFunction(node[i]) + '>';

				/*if(node[i].moduleDefineType == "LEAF") {
					str += '<a class="huanhang ui-flex" href="javascript:void(0);">';
				} else if(node[i].moduleDefineType == "DIR") {
					var nodeDir = js.lang.String.encodeHtml(JSON.stringify(node[i].children));
					str += '<a onclick="queryModuleTreeHtml(' + nodeDir + ',0,this)">';
				}*/

				if (node[i].projectDefine.projectDefineWebType != "CHECKBOX") {
					str += '<label class="dir-label">' + node[i].moduleDefineName + '</label>';
				} else {
					str += '<div style="padding: 11px 15px;">' + node[i].moduleDefineName + '</div>';
				}
				if (node[i].projectDefine.projectDefineWebType == "DATETIMEPICKER") {
					str += angularFunctionInput(node[i], "btnClass mui-input-clear dir-label-clear", -1, false);
				} else {
					str += angularFunctionInput(node[i], "mui-input-clear dir-label-clear", -1, false);
				}

				if (null != node[i].unitDefine && "" != node[i].unitDefine && undefined != node[i].unitDefine) {
					str += '<div class="dir-span">' + node[i].unitDefine.unitDefineValue + '</div>';
				}
				str += '</div>';
			}
		}
		// str += '</div>';
		// str += '</div>';
		var saveDataCrfStr = '<div></div>';
		var moduleDefineShowType = node[0].moduleDefineShowType;
		var scientificFlag = sessionStorage.getItem('scientificFlag');

		var crfMdst = moduleDefineShowType.split(',');
		var crfRoleByMdst = sessionStorage.getItem('role');
		var moduleDefineShowTypeFlag = false;
		for (var mdst = 0; mdst < crfMdst.length; mdst++) {
			if (crfMdst[mdst] == 'currency' && crfRoleByMdst != undefined && crfRoleByMdst != null && crfRoleByMdst != '' && crfRoleByMdst != 'null') {
				moduleDefineShowTypeFlag = true;
				break;
			} else if(crfMdst[0] == 'doctor' && crfMdst[1] == 'patient'){
				moduleDefineShowTypeFlag = true;
				break;
			} else if (crfMdst[mdst] == 'doctor' && (crfRoleByMdst == 'DOCTOR' || crfRoleByMdst == 'ASSISTANT')) {
				moduleDefineShowTypeFlag = true;
				break;
			} else if (crfMdst[mdst] == 'patient' && crfRoleByMdst == 'PATIENT') {
				moduleDefineShowTypeFlag = true;
				break;
			} else {
				moduleDefineShowTypeFlag = false;
				break;
			}
		}



		if (scientificFlag != '') {
			if (moduleDefineShowTypeFlag) {

				saveDataCrfStr += '<div class="mui-row" style="font-size: 13px;">';
				saveDataCrfStr += '<div class="mui-col-sm-6 mui-col-xs-6">';
				saveDataCrfStr += '<div class="mui-input-row mui-checkbox mui-left">';
				saveDataCrfStr += '<label>标记为已完成</label>';
				if (publicIsCompleted) {
					saveDataCrfStr += '<input id="completedId" name="checkbox" type="checkbox" checked="checked" ';
					saveDataCrfStr += functionFinish(node[0]);
					saveDataCrfStr += '>';
				} else {
					saveDataCrfStr += '<input id="completedId" name="checkbox" type="checkbox"';
					saveDataCrfStr += functionFinish(node[0]);
					saveDataCrfStr += '>';
				}

				saveDataCrfStr += '</div>';
				saveDataCrfStr += '</div>';

				var _crfId = '',
					_crfName = '',
					_crfIndex = '';

				for (var e = 0; e < crfArray.length; e++) {
					var crfIndexModule = crfFlag * 1 + 1*1;

					if(crfIndexModule == crfArray.length){
						_crfId = crfArray[crfArray.length-1].crfId;
						_crfName = crfArray[crfArray.length-1].crfName;
						_crfIndex = crfIndexModule;
					}else{
						if ( crfIndexModule == crfArray[e].crfIndex) {
							_crfId = crfArray[e].crfId;
							_crfName = crfArray[e].crfName;
							_crfIndex = crfArray[e].crfIndex;
						}
	
						if (crfIndexModule > crfArray.length) {
							_crfId = crfIndexModule;
							_crfName = crfIndexModule;
							_crfIndex = crfIndexModule;
						}
					}
				}
				saveDataCrfStr += '<div class="mui-col-sm-5 mui-col-xs-5 save-class" id="saveCrf" crfId="' + _crfId + '" crfName="' + _crfName + '" crfIndex="' + _crfIndex + '">';
				saveDataCrfStr += '<i class="mui-icon iconfont icon-baocun"></i>';
				if (crfFlag != crfArray[crfArray.length - 1].crfIndex) {
					if( sessionStorage.getItem('roleFlag') == 'Calendar'){
						saveDataCrfStr += '保存';
					}else{
						saveDataCrfStr += '保存并跳转下一页';
					}
				} else {
					saveDataCrfStr += '保存';
				}
				saveDataCrfStr += '</div>';
				saveDataCrfStr += '</div>';
			}
		}

		//str += '</div>';
		//str += '</div>';
		//str += '<div class="mui-off-canvas-backdrop"></div>';
		//str += '</div>';
		str += '</div>';

	} else {
		str += '<div class="textCenter">';
		str += '<img src="../../assets/image/no-data-tip.png" alt="" />';
		str += '<p>暂无数据</p>';
		str += '</div>';
		return false;
	}

	/*if(indexValue != 0) {
			str += '<div class="mark" id="confirmBtn">';
	
			str += '<img class="tickSelected isCompletedClass" id="isCompletedId_1" isCompletedValue="1" src="../../assets/image/tick-green.png"></img>';
			str += '<div class="squareCheckbox isCompletedClass" id="isCompletedId_2" isCompletedValue="0"></div>';
	
			str += '<label style="color:#000000">标记该CRF为已完成</label>';
			str += '</div>';
			str += '<button class="mui-btn mui-btn-block btnSave" id="saveCrf" onclick="saveDataCrf()">';
			str += '<img class="save-white" src="../../assets/image/save-white.png" alt="" />';
			str += '保存';
			str += '</button>';
		}*/

	$('.mui-off-canvas-wrap').css('overflow', 'initial');

	$("#crfItems").val(crfFieldsStr);
	$("#notInSameModuleCodes").val(notInSameModuleCodes);
	notInSameModuleCodes_backup = notInSameModuleCodes;
	$("#notInSameCrfCodes").val(notInSameCrfCodes);
	notInSameCrfCodes_backup = notInSameCrfCodes;

	var $div = $(str);
	var $muiBar = $(muiBar);
	var $saveDataCrfStr = $(saveDataCrfStr);

	if (isDatasStr != '') {
		var $isDatasStr = $(isDatasStr);
		$("#isDatasHtml").html($isDatasStr);
		parseScope($isDatasStr);
	}

	if (indexValue == 1) {
		//$("#dirAndLeaf").empty();
		backIndex = 21;
		//$("#dirAndLeaf").html($div);
		$("#muiBar").html(muiBar);
		$("#saveDataCrf").html($saveDataCrfStr);
		parseScope($saveDataCrfStr);

		$("#offCanvasContentScroll .mui-scroll").html(
			$div
		);
		backController();
		// mui('.mui-off-canvas-wrap').offCanvas().show();
		// mui('.mui-off-canvas-wrap').offCanvas().close();
		mui('#offCanvasSideScroll').scroll();
		mui('#offCanvasContentScroll').scroll();

	} else {
		// $("#dirAndLeafCopy").empty();
		// backIndex = 22;
		// $("#dirAndLeaf").hide();
		// $("#dirAndLeafCopy").html($div);

		// backController();
	}

	var $_scrollStr = $(scrollStr);
	$('#muiScroll').html($_scrollStr);
	parseScope($_scrollStr);

	//侧滑导航点击
	mui('.mui-table-view').on('tap', '.sollLi', function () {
		queryModuleTree($(this).attr('moduledefineid'), $(this).attr('index'), $(this).attr('moduledefinename'), $(this).attr('sollcrfindex'));
		mui('.mui-off-canvas-wrap').offCanvas().close();
	});

	//侧滑导航点击 不可保存
	mui('.mui-table-view').on('tap', '.sollLiOnlyView', function () {
		queryModuleTreeOnlyView($(this).attr('moduledefineid'), $(this).attr('index'), $(this).attr('moduledefinename'), $(this).attr('sollcrfindex'));
		mui('.mui-off-canvas-wrap').offCanvas().close();
	});

	//保存CRF点击
	mui('.mui-row').on('tap', '#saveCrf', function () {
		var crfId = $(this).attr('crfId'),
			crfName = $(this).attr('crfName'),
			crfIndex = $(this).attr('crfIndex');

		saveDataCrf(crfId, '1', crfName, crfIndex);
	});

	//目录按钮点击
	mui('#muiBar').on('tap', '.icon-mulu', function () {
		mui('.mui-off-canvas-wrap').offCanvas().show();
	});

	//表格点击
	mui('.mui-table-view-cell').on('tap', '.mui-navigate-right', function () {
		$(this).click();
	});

	parseScope($div);

	alertDatePick();
	delUploadImage();
	addImgUpload();

	isCompletedController();

	$("#setDataValue").click();

	/*$(".mui-scroll-wrapper").css('position','initial');
		
	mui('.mulu-class').on('tap','.mulu-color-class',function(){
		$('.mui-scroll-wrapper').css('position','absolute');
	})*/

	$('.dir-label').each(function () {
		var obj = $(this).next();
		if (obj.get(0).tagName == 'DIV') {
			$(this).css('width', '60%');
		}
	});

	//页面定位到顶部
	mui('#offCanvasContentScroll').scroll().scrollTo(0, 0, 100);

	//去掉隐藏表格必填class
	/*$(".isTable").each(function(){
		if($(this).hasClass('isRequired')){
			$(this).removeClass('isRequired');
		}
	});*/


	//弹出层 当前crf增加背景颜色
	//TODO
	$('.sollLi').each(function () {
		var sollcrfindex = $(this).attr('sollcrfindex');
		if (sollcrfindex == crfFlag) {
			$(this).css('background-color', '#e7f3f9');
		}
	});

	$("#saveDataCrf").show();

}


var _datasValueMap = [];

function tableHideData(node) {
	var _wechart_tableModuleDefineCode = new Array();
	var _map = {};
	var _map_rowNum = {};
	var _oldValueMap = {};
	var tableHideDataStr = '';
	var crfFieldsStrIsDatas = '';

	for (var isD = 0; isD < node.children.length; isD++) {
		var node_isD = node.children[isD];

		if (node_isD.moduleDefineType == "LEAF") {
			_wechart_tableModuleDefineCode.push(node_isD.moduleDefineCode);
			crfFieldsStrIsDatas += node_isD.moduleDefineCode + ",";
		}

	}

	var _tableModuleCode = node.moduleDefineCode;
	var _table_name = node.moduleDefineName;
	var _ary = new Array();
	_ary.push(node);
	_datasValueMap[_tableModuleCode] = _ary;

	var _params = 'siteId=' + sessionStorage.getItem("siteId") +
		'&roleId=' + sessionStorage.getItem("roleId") + '&userId=' + sessionStorage.getItem("userId");

	var paramValue = _params + "&crfFields=" + crfFieldsStrIsDatas + "&visitId=" + sessionStorage.getItem("visitId") +
		"&patientId=" + sessionStorage.getItem("patientId") + "&notInSameCrfCodesStr=&notInSameModuleCodesStr=&currentModuleDefineId=";

	mui.ajax(path + 'crf/searchCrfValue_interface.do?' + paramValue + paramsAcc, {
		data: {},
		dataType: 'json', //服务器返回json格式数据
		async: false,
		type: 'post', //HTTP请求类型
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.toast(data.error);
			} else {
				var _innerHtml = "";

				var datas = data.datas;


				for (var i = 0; i < datas.length; i++) {
					var moduleDefine = datas[i];
					var moduleDefineCode = moduleDefine.moduleDefineCode;
					var projectDefineDataFormat = moduleDefine.projectDefineDataFormat;
					var dataType = "";
					if (projectDefineDataFormat != null && projectDefineDataFormat != "" && projectDefineDataFormat != undefined) {
						dataType = projectDefineDataFormat.projectDefineDataType;
					}
					var values = moduleDefine.values;
					if (values != null && values != "" && values != undefined) {
						if (moduleDefine.moduleDefineIsDatas == "0" && moduleDefine.moduleDefineIsVirtual != "1") {
							var valueObj = values[0];
							var value = valueObj.value;
							var _bacthId = valueObj.batchId;
							var rowNum = String(valueObj.rowNum).substr(_bacthId.length);
							_map_rowNum[moduleDefineCode] = rowNum;
							var value = angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode, value, dataType);
						} else {
							if (moduleDefine.moduleDefineIsVirtual != "1") {
								var _ary = new Array();
								for (var c = 0; c < values.length; c++) {

									var valueObj = values[c];
									var _value = valueObj.value;
									var _bacthId = valueObj.batchId;
									var rowNum = String(valueObj.rowNum).substr(_bacthId.length);
									rowNum = Number(rowNum);
									_ary[c] = rowNum;
									angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode + "_" + rowNum, _value, dataType);
									_oldValueMap[moduleDefineCode + "_" + rowNum] = _value;
								}
								_map[moduleDefineCode] = _ary;
							}
						}
					} else {
						//$("#patient_"+moduleDefine.moduleDefineCode).hide();
						//$("#info_"+moduleDefine.moduleDefineCode).parent().parent().hide();
					}
					if (moduleDefine.moduleDefineIsDatas == "1") {
						map_moduleDefine[moduleDefineCode] = moduleDefine;
					}

				}

				//表格
				var rowNums = "";
				var tableModuleCode = _tableModuleCode;
				var _rowNumAry = new Array();
				var _moduleCodeAry = new Array();

				var moduleDefineShowType = $(this).attr('onlyView');

				for (var k = 0; k < _wechart_tableModuleDefineCode.length; k++) {

					var moduleCode = _wechart_tableModuleDefineCode[k];
					_rowNumAry.push.apply(_rowNumAry, _map[moduleCode]);
				}

				_rowNumAry.sort(compact);

				if (_rowNumAry.length == 0) {
					_rowNumAry.push(0);
				}

				var _new = _rowNumAry.unique3();

				var _obj = _datasValueMap[tableModuleCode];
				var addIsDatasStr = js.lang.String.encodeHtml(JSON.stringify(_obj));
				for (var m = _new.length - 1; m >= 0; m--) {
					_innerHtml += '<ul ' + angularFunction(_obj[0]) + ' class="isTable_required mui-table-view OA_task_1 marginBotton10" tablemodulecode="' + tableModuleCode + '" tableModuleName="' + _table_name + '">';
					_innerHtml += '<li class="mui-table-view-cell paddingLeft18 paddingRight0">';

					_innerHtml += '<div class="mui-slider-handle">';
					_innerHtml += '<div class="tableClass-' + tableModuleCode + ' paddingLeft0 marginTop10 lineHeight3  mui-navigate-right borderBottom1">';
					_innerHtml += '<span>' + _table_name + '-' + (m + 1) + '</span>';
					_innerHtml += '</div>';

					_innerHtml += '<div class="mui-card-content">';
					for (var n = 0; n < _wechart_tableModuleDefineCode.length; n++) {

						var node = map_moduleDefine[_wechart_tableModuleDefineCode[n]];

						if (undefined != node && "" != node && null != node) {
							var remarkValue = oldRemarkValueMap[_moduleCodeAry[n] + "_" + _new[m]];

							_innerHtml += '<div class="mui-row lineHeight3 fontSize17" ' + angularFunction(node) + '>';

							_innerHtml += '<label tableModuleName="' + _table_name + '">' + node.moduleDefineName + ':';
							if (undefined != datas[n].moduleDefineIsRequired && null != datas[n].moduleDefineIsRequired && '' != datas[n].moduleDefineIsRequired) {
								if (datas[n].moduleDefineIsRequired == '1') {
									_innerHtml += '<span tableModuleName="' + _table_name + '" class="tableDatasIsReq color858585">' + createTableDatas(node, _new[m], remarkValue); + '</span>';
								} else {
									_innerHtml += '<span class="color858585">' + createTableDatas(node, _new[m], remarkValue); + '</span>';
								}
							} else {
								_innerHtml += '<span class="color858585">' + createTableDatas(node, _new[m], remarkValue); + '</span>';
							}


							_innerHtml += '</label>';
							_innerHtml += '</div>';

						}

					}
					_innerHtml += '</div>';
					_innerHtml += '</div>';

					_innerHtml += '</li>';
					_innerHtml += '</ul>';

					_innerHtml += '</div>';

				}

				tableHideDataStr = _innerHtml;
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});

	return tableHideDataStr;
}

var completed = '';

function isCompletedController() {
	if ($('#completedId').is(':checked')) {
		completed = true;
	} else {
		completed = false;
	}
}

//表格型展示方式
var table_name = '';

function queryIsDatasHtml(node) {
	deletePick();

	wechart_tableModuleDefineCode = new Array();
	table_name = node.moduleDefineName;
	titleController(table_name);

	var crfFieldsStr = '';
	var tableModuleCode = node.moduleDefineCode;
	var _ary = new Array();
	_ary.push(node);
	datasValueMap[tableModuleCode] = _ary;
	var str = '';

	str += '<div id="table_div" tableModuleCode="' + tableModuleCode + '"  class="crf-table-thead"></div>';

	//	str += '<ul class="mui-table-view">';

	for (var i = 0; i < node.children.length; i++) {
		var nodeParient = node.children[i];
		//		str += '<li class="mui-table-view-cell">';
		//			str += '<div class="mui-slider-right mui-disabled">';
		//			str += '<a class="mui-btn mui-btn-red">删除</a>';
		//			str += '</div>';
		//			str += '<div class="mui-slider-handle">';
		//				str += '<ul class="mui-table-view ">';

		//				if(nodeParient.moduleDefineType == "DIR"){
		//					str += '<li class="mui-table-view-cell ">';
		//						str += '<a class="mui-navigate-right" href="#">'+nodeParient.moduleDefineName+'</a>';
		//						str += '<ul class="mui-table-view mui-table-view-chevron">';
		//						for(var j = 0; j<nodeParient.children.length; j++){
		//							var nodeChildren = nodeParient.children[j];
		//							wechart_tableModuleDefineCode.push(nodeChildren.moduleDefineCode);
		//							crfFieldsStr += nodeChildren.moduleDefineCode+",";

		//							str += '<li class="mui-table-view-cell crf-table-thead" id="crf-table-tbody-'+nodeParient.moduleDefineCode+'">';
		//							str += '<a class="" href="#">'+nodeChildren.moduleDefineName+'</a>';
		//							str += '<label>'+createTableNodeInput(nodeChildren,"",1)+'</label>';
		//							str += '</li>';

		//						}
		//						str += '</ul>';
		//						
		//					str += '</li>';
		/*}else */
		if (nodeParient.moduleDefineType == "LEAF") {
			wechart_tableModuleDefineCode.push(nodeParient.moduleDefineCode);
			crfFieldsStr += nodeParient.moduleDefineCode + ",";
			//					str += '<li class="mui-table-view-cell">';
			//						str += '<a class="mui-navigate-right" href="#">'+nodeParient.moduleDefineName+'</a>';
			//						str += '<label>'+createTableNodeInput(nodeChildren,"",1)+'</label>';
			//					str += '</li>';
		}

		//				str += '</ul>';
		//			str += '</div>';
		//		str += '</li>';
	}
	//	str += '</ul>';

	//$("#dirAndLeaf").hide();

	$("#crfItems").val(crfFieldsStr);

	backIndex = 3;

	$("#isDatasNode").empty();

	var $div = $(str);
	$("#isDatasNode").html($div);
	parseScope($div);

	$("#setDataValue").click();

	backController();
}

//跳转到添加组件页面

function addIsdatas(node, rowNum) {
	deletePick();
	var crfFieldsStr = '';

	var saveTableData = '';

	var str = '';
	str += '<form class="mui-input-group">';
	str += '<ul class="mui-table-view mui-table-view-striped mui-table-view-condensed" tableModuleName="' + node[0].moduleDefineName + '" tablemodulecode="' + node[0].moduleDefineCode + '">';

	for (var i = 0; i < node.length; i++) {
		var nodeIsdata = node[i];
		saveTableData = nodeIsdata;
		for (var j = 0; j < nodeIsdata.children.length; j++) {
			var nodeLeafAndDir = nodeIsdata.children[j];
			crfFieldsStr += nodeLeafAndDir.moduleDefineCode + ",";

			if (nodeLeafAndDir.moduleDefineType == "DIR" && nodeLeafAndDir.moduleDefineIsDatas == "1") {

				for (var k = 0; k < nodeLeafAndDir.children.length; k++) {
					var node_html = nodeLeafAndDir.children[k];
					crfFieldsStr += node_html.moduleDefineCode + ",";
					if (node_html.moduleDefineType == "DIR") {

						for (var a = 0; a < node_html.children.length; a++) {
							crfFieldsStr += node_html.children[a].moduleDefineCode + ",";
						}

						var nodeDirData = js.lang.String.encodeHtml(JSON.stringify(node_html));

						if (node_html.moduleDefineIsRequired == 1) {
							str += '<li class="mui-table-view-cell isRequiredTabAdd" is-datas="1" row-num="' + rowNum + '" ng-model="' + node_html.moduleDefineCode + '_' + rowNum + '"';
							str += functionShow(node_html);
							str += 'moduleDefineName="' + node_html.moduleDefineName + '">';
						} else {
							str += '<li class="mui-table-view-cell" is-datas="1" row-num="' + rowNum + '" ng-model="' + node_html.moduleDefineCode + '_' + rowNum + '"';
							str += functionShow(node_html);
							str += 'moduleDefineName="' + node_html.moduleDefineName + '">';
						}

						str += '<a class="mui-navigate-right">';
						str += '<img class="groupIcon" src="../../assets/image/group.png" alt="">';
						str += '<span>' + node_html.moduleDefineName + '</span>';
						str += '</a>';

						str += '</li>';
					} else {
						if (node_html.moduleDefineIsRequired == 1) {
							str += '<li class="mui-table-view-cell isRequiredTabAdd" is-datas="1" row-num="' + rowNum + '" ng-model="' + node_html.moduleDefineCode + '_' + rowNum + '"';
							str += functionShow(node_html);
							str += 'moduleDefineName="' + node_html.moduleDefineName + '">';
						} else {
							str += '<li class="mui-table-view-cell" is-datas="1" row-num="' + rowNum + '" ng-model="' + node_html.moduleDefineCode + '_' + rowNum + '"';
							str += functionShow(node_html);
							str += 'moduleDefineName="' + node_html.moduleDefineName + '">';
						}
						/*str += '<li class="mui-table-view-cell" is-datas="1" row-num="'+rowNum+'" ng-model="'+node_html.moduleDefineCode+'_'+rowNum+'"';
						str += functionShow(node_html);
						str += '>';*/
						str += '<div class="ui-flex">';

						str += '<div class="ui-flex-item">';
						str += '<label>' + node_html.moduleDefineName + '</label>';
						str += '</div>';

						str += '<div class="mui-text-right" style="">';
						if (node_html.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
							str += angularFunctionInput(node_html, "btn mui-btn-block btnClass textRight pickClass", rowNum);
						} else {
							str += angularFunctionInput(node_html, "btn mui-btn-block textRight", rowNum);
						}

						str += '</div>';

						if (null != nodeLeafAndDir.unitDefine && "" != nodeLeafAndDir.unitDefine && undefined != nodeLeafAndDir.unitDefine && "null" != nodeLeafAndDir.unitDefine) {
							str += '<div>';
							str += '<span>' + nodeLeafAndDir.unitDefine.unitDefineValue + '</span>';
							str += '</div>';
						}
						str += '</div>';
						str += '</li>';
					}

				}
			} else if (nodeLeafAndDir.moduleDefineType == "LEAF") {
				crfFieldsStr += nodeLeafAndDir.moduleDefineCode + ",";
				if (nodeLeafAndDir.moduleDefineIsRequired == 1) {
					str += '<li class="mui-table-view-cell isRequiredTabAdd" ' + angularFunction(nodeLeafAndDir) + ' is-datas="1" row-num="' + rowNum + '" ng-model="' + nodeLeafAndDir.moduleDefineCode + '_' + rowNum + '"';
					str += functionShow(nodeLeafAndDir);
					str += 'moduleDefineName="' + nodeLeafAndDir.moduleDefineName + '">';
				} else {
					str += '<li class="mui-table-view-cell" is-datas="1" ' + angularFunction(nodeLeafAndDir) + ' row-num="' + rowNum + '" ng-model="' + nodeLeafAndDir.moduleDefineCode + '_' + rowNum + '"';
					str += functionShow(nodeLeafAndDir);
					str += 'moduleDefineName="' + nodeLeafAndDir.moduleDefineName + '">';
				}
				/*str += '<li class="mui-table-view-cell" is-datas="1" row-num="'+rowNum+'" ng-model="'+nodeLeafAndDir.moduleDefineCode+'_'+rowNum+'"';
				str += functionShow(nodeLeafAndDir);
				str += '>';*/
				str += '<div class="ui-flex">';

				str += '<div class="ui-flex-item">';
				str += '<label>' + nodeLeafAndDir.moduleDefineName + '</label>';
				str += '</div>';

				str += '<div class="mui-text-right"  style="">';
				if (nodeLeafAndDir.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
					str += angularFunctionInput(nodeLeafAndDir, "btn mui-btn-block btnClass textRight", rowNum);
				} else {
					str += angularFunctionInput(nodeLeafAndDir, "btn mui-btn-block textRight", rowNum);
				}

				str += '</div>';
				if (null != nodeLeafAndDir.unitDefine && "" != nodeLeafAndDir.unitDefine && undefined != nodeLeafAndDir.unitDefine && "null" != nodeLeafAndDir.unitDefine) {
					str += '<div>';
					str += '<span>' + nodeLeafAndDir.unitDefine.unitDefineValue + '</span>';
					str += '</div>';
				}

				str += '</div>';
				str += '</li>';
			}

			/*else if(nodeLeafAndDir.moduleDefineType == "DIR" && nodeLeafAndDir.moduleDefineIsDatas == "0"){
				for(var n = 0; n < nodeLeafAndDir.children.children.length; n++){
					var _node_html = nodeLeafAndDir.children[n];
					
					str += '<li class="mui-table-view-cell">';
						str += '<div class="mui-table">';
							str += '<div class="mui-table-cell mui-col-xs-1">';
								str += '<span class="mui-icon mui-icon-info"></span>';
							str += '</div>';
							str += '<div class="mui-table-cell mui-col-xs-4">';
								str += '<label>'+_node_html.moduleDefineName+'</label>';
							str += '</div>';
							str += '<div class="mui-table-cell mui-col-xs-7 mui-text-right">';
								str += '<input type="text" class="btn mui-btn-block btnClass textRight">';
							str += '</div>';
						str += '</div>';
					str += '</li>';
					
				}
			}*/

		}
	}
	str += '</form>';
	str += '</ul>';

	var nodeValue = js.lang.String.encodeHtml(JSON.stringify(saveTableData));

	var scientificFlag = sessionStorage.getItem('scientificFlag');
	if (scientificFlag != '') {
		if (rowNum == 0) {
			str += '<button type="button" id="saveTableData" accesscontrolkey=""  moduleDefines="' + nodeValue + '" rowNum="-1" tableModuleCode="' + node[0].moduleDefineCode + '" class="mui-btn mui-btn-block btnSave" onclick="saveTableData(this)">';
			str += '<img class="save-white" src="../../assets/image/save-white.png" alt="" />保存';
			str += '</button>';
		} else {
			str += '<button type="button" id="saveTableData" accesscontrolkey="" moduleDefines="' + nodeValue + '" rowNum="' + rowNum + '" tableModuleCode="' + node[0].moduleDefineCode + '" class="mui-btn mui-btn-block btnSave" onclick="updateTableData(this)">';
			str += '<img class="save-white" src="../../assets/image/save-white.png" alt="" />修改';
			str += '</button>';
		}
	}

	//$("#isDatasNode").hide();

	backIndex = 4;

	$("#crfItems").val(crfFieldsStr);

	$("#isDatasAdd").empty();
	var $div = $(str);
	$("#isDatasAdd").html($div);
	parseScope($div);

	// 权限
	var scientificFlag = sessionStorage.getItem('scientificFlag');
	if (scientificFlag == '') {
		$('.access_control').each(function () {
			$(this).hide();
		});
	} else {
		accessControl();
	}

	alertDatePick();
	delUploadImage();
	addImgUpload();

	$("#setDataValue").click();

	backController();

	$(".mui-text-right").css('text-align', 'inherit');
	$(".patient-group-detail .btn-choicecircle input").css('float', 'right');
	//$(".btn-choicebox label").css('float','left');
	$(".mui-btn-block").css('display', 'initial');

}

//拼组件下面的Leaf 最后一层
function addIsdatasChildren(node, rownum) {
	deletePick();
	var crfFieldsStr = '';
	var str = '';
	str += '<form class="mui-input-group">';
	str += '<ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">';
	for (var i = 0; i < node.children.length; i++) {
		var nodeData = node.children[i];
		crfFieldsStr += nodeData.moduleDefineCode + ",";
		str += '<li class="mui-table-view-cell">';
		str += '<div class="ui-flex">';

		str += '<div class="ui-flex-cell">';
		str += '<label>' + nodeData.moduleDefineName + '</label>';
		str += '</div>';
		str += '<div class="mui-text-right">';
		if (nodeData.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
			str += angularFunctionInput(nodeData, 'btn mui-btn-block btnClass textRight', rownum);
		} else {
			str += angularFunctionInput(nodeData, 'btn mui-btn-block textRight', rownum);
		}

		str += '</div>';
		str += '</div>';
		str += '</li>';
	}
	str += '</form>';
	str += '</ul>';

	backIndex = 5;

	$("#crfItemsB").val(crfFieldsStr);

	$("#addGroupEnd").empty();
	var $div = $(str);
	$("#addGroupEnd").html($div);
	parseScope($div);

	alertDatePick();
	delUploadImage();
	addImgUpload();

	backController();
}

function parseScope($div) {
	angular.element(document.body).injector().invoke(function ($compile) {
		var scope = angular.element($div).scope();
		$compile($div)(scope);
	});
}

//返回按钮
function backController() {
	//页面操作
	goOperation();
	//禁止返回 当前页todo
	pushHistory(backIndex);
}

$(window).bind('hashchange', function () {
	backIndex = location.hash.replace("#", "");
	goOperation();
});


function goOperation() {
	if (backIndex == 1) {
		$("#crfGroupDiv,#headData,#headData").show();
		$("#dirAndLeaf,#dirAndLeafCopy,#isDatasNode,#isDatasAdd,#addGroupEnd").hide();
		titleController("数据录入");
	} else if (backIndex == 21) {
		$("#dirAndLeaf").show();
		$("#crfGroupDiv,#dirAndLeafCopy,#isDatasNode,#isDatasAdd,#addGroupEnd,#headData").hide();
	} else if (backIndex == 22) {
		$("#dirAndLeafCopy").show();
		$("#crfGroupDiv,#dirAndLeaf,#isDatasNode,#isDatasAdd,#addGroupEnd,#headData").hide();
	} else if (backIndex == 3) {
		$("#isDatasAdd").html('');
		$("#isDatasNode").show();
		$("#crfGroupDiv,#dirAndLeaf,#dirAndLeafCopy,#isDatasAdd,#addGroupEnd,#headData").hide();
	} else if (backIndex == 4) {
		$("#isDatasAdd").show();
		$("#crfGroupDiv,#dirAndLeaf,#dirAndLeafCopy,#isDatasNode,#addGroupEnd,#headData").hide();
	} else if (backIndex == 5) {
		$("#addGroupEnd").show();
		$("#crfGroupDiv,#dirAndLeaf,#dirAndLeafCopy,#isDatasNode,#isDatasAdd,#headData").hide();
	}
}

function pushHistory(paramUrl) {
	var curHash = location.hash;
	if (curHash == "#" + paramUrl) {
		return;
	}
	var state = {
		title: "title",
		url: "#" + paramUrl
	};
	window.history.pushState(state, "title", "#" + paramUrl);
}

//表格添加
function saveTableData(obj) {
	//$("#saveTableData").attr('disabled',true);
	var tableModuleCode = $(obj).attr("tableModuleCode");

	var _obj = datasValueMap[tableModuleCode];

	var crfItemsStr = $(obj).attr("moduleDefines");
	var crfItems = JSON.parse(crfItemsStr);

	var rowNum = $(obj).attr("rowNum");
	var data = "";
	var mdduleDefineCodeParam = "";
	var _index = 0;

	var requiredTips = "";
	$(".isRequired").each(function () {
		var _classStr = $(this).attr("class");
		var parentClass3 = $(this).parent().parent().parent().attr("class");
		var parentClass4 = $(this).parent().parent().parent().parent().attr("class");
		var parentClass5 = $(this).parent().parent().parent().parent().parent().attr("class");
		var parentClass6 = $(this).parent().parent().parent().parent().parent().parent().attr("class");
		var parentClass7 = $(this).parent().parent().parent().parent().parent().parent().parent().attr("class");
		if (parentClass3 == null || parentClass3 == undefined) {
			parentClass3 = "";
		}
		if (parentClass4 == null || parentClass4 == undefined) {
			parentClass4 = "";
		}
		if (parentClass5 == null || parentClass5 == undefined) {
			parentClass5 = "";
		}
		if (parentClass6 == null || parentClass6 == undefined) {
			parentClass6 = "";
		}
		if (parentClass7 == null || parentClass7 == undefined) {
			parentClass7 = "";
		}
		if (_classStr.indexOf("ng-hide") == -1 && parentClass3.indexOf("ng-hide") == -1 && parentClass4.indexOf("ng-hide") == -1 && parentClass5.indexOf("ng-hide") == -1 && parentClass6.indexOf("ng-hide") == -1 && parentClass7.indexOf("ng-hide") == -1) {

			var ngModel_code = $(this).attr("ng-model");
			var value = angular.element(document.getElementById('setDataValue')).scope().getDataValue_crf(ngModel_code);
			if (typeof value == "object") {
				value = undefined;
			}
			if (value == "[object Object]") {
				value = undefined;
			}
			if (value == null || value == undefined || value == "undefined" || $.trim(value) == "" || value == "") {
				var moduleDefineName = $(this).attr("moduleDefineName");
				var tip = moduleDefineName + "不能为空";
				if (requiredTips.indexOf(tip) > -1) {

				} else {
					requiredTips += $(this).attr("moduleDefineName") + "不能为空" + "<br>";
				}
			}
		}
	})
	if (requiredTips != null && requiredTips != undefined && $.trim(requiredTips) != "") {
		mui.alert(requiredTips, '提示');
		return false;
	}

	for (var i = 0; i < crfItems.children.length; i++) {
		var moduleDefine = crfItems.children[i];
		if (moduleDefine.moduleDefineType == "DIR") {
			for (var c = 0; c < moduleDefine.children.length; c++) {
				var moduleDefineCode = moduleDefine.children[c].moduleDefineCode;
				var moduleDefineId = moduleDefine.children[c].moduleDefineId;
				var isVirtual = moduleDefine.children[c].moduleDefineIsVirtual;
				errorMsgProcess(moduleDefineCode + "_0");
				if (isVirtual == "0") {
					var value = angular.element(document.getElementById('saveTableData')).scope().getDataValue_crf(moduleDefineCode + "_0");
					if (typeof value == "object") {
						value = undefined;
					}
					if (value != null && $.trim(value) != "" && value != undefined) {
						data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
						data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
						data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
						data += 'indicators[' + moduleDefineCode + '].rowNum=&';
						data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
						data += 'indicators[' + moduleDefineCode + '].content=""&';
						data += 'indicators[' + moduleDefineCode + '].isTableData=YES&';
					}
					mdduleDefineCodeParam += '&arrays[' + _index + "]=" + moduleDefineCode;
					_index++;
				}
			}
		} else {
			var moduleDefineCode = moduleDefine.moduleDefineCode;
			var moduleDefineId = moduleDefine.moduleDefineId;
			var isVirtual = moduleDefine.moduleDefineIsVirtual;
			errorMsgProcess(moduleDefineCode + "_0");
			if (isVirtual == "0") {
				var value = angular.element(document.getElementById('saveTableData')).scope().getDataValue_crf(moduleDefineCode + "_0");
				if (typeof value == "object") {
					value = undefined;
				}
				if (value != null && $.trim(value) != "" && value != undefined) {
					data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
					data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
					data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
					data += 'indicators[' + moduleDefineCode + '].rowNum=&';
					data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
					data += 'indicators[' + moduleDefineCode + '].content=""&';
					data += 'indicators[' + moduleDefineCode + '].isTableData=YES&';
				}
				mdduleDefineCodeParam += '&arrays[' + _index + "]=" + moduleDefineCode;
				_index++;
			}
		}

	}

	if (data == "") {
		mui.alert("请填写", '提示');
		return false;
	}

	var paramValue = data + params + "&visitId=" + visitId + "&patientId=" + patientId +
		"&currentModuleDefineId=" + saveDataModuleDefineId + "&isCompleted=" + completed +
		mdduleDefineCodeParam + paramsAcc;

	mui.ajax({
		url: path + 'crf/saveData.do',
		context: this,
		type: "post",
		data: paramValue,
		dataType: "json",
		cache: "false",
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				mui.toast("添加成功");
				//$("#saveTableData").attr('disabled',false);

				queryIsDatasHtml(_obj[0]);

				setTimeout(function () {
					backIndex = 3;
					backController();
				}, 1500);
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//表格修改
function updateTableData(obj) {
	//$("#saveTableData").attr('disabled',true);

	if (completed == true) {
		var requiredTips = "";
		$(".isRequiredTab").each(function () {
			var _classStr = $(this).attr("class");
			var parentClass3 = $(this).parent().parent().parent().attr("class");
			var parentClass4 = $(this).parent().parent().parent().parent().attr("class");
			var parentClass5 = $(this).parent().parent().parent().parent().parent().attr("class");
			var parentClass6 = $(this).parent().parent().parent().parent().parent().parent().attr("class");
			var parentClass7 = $(this).parent().parent().parent().parent().parent().parent().parent().attr("class");
			if (parentClass3 == null || parentClass3 == undefined) {
				parentClass3 = "";
			}
			if (parentClass4 == null || parentClass4 == undefined) {
				parentClass4 = "";
			}
			if (parentClass5 == null || parentClass5 == undefined) {
				parentClass5 = "";
			}
			if (parentClass6 == null || parentClass6 == undefined) {
				parentClass6 = "";
			}
			if (parentClass7 == null || parentClass7 == undefined) {
				parentClass7 = "";
			}
			if (_classStr.indexOf("ng-hide") == -1 && parentClass3.indexOf("ng-hide") == -1 && parentClass4.indexOf("ng-hide") == -1 && parentClass5.indexOf("ng-hide") == -1 && parentClass6.indexOf("ng-hide") == -1 && parentClass7.indexOf("ng-hide") == -1) {

				var ngModel_code = $(this).attr("ng-model");
				var value = angular.element(document.getElementById('setDataValue')).scope().getDataValue_crf(ngModel_code);
				if (typeof value == "object") {
					value = undefined;
				}
				if (value == "[object Object]") {
					value = undefined;
				}
				if (value == null || value == undefined || value == "undefined" || $.trim(value) == "" || value == "") {
					var moduleDefineName = $(this).attr("moduleDefineName");
					var tip = moduleDefineName + "不能为空";
					if (requiredTips.indexOf(tip) > -1) {

					} else {
						requiredTips += $(this).attr("moduleDefineName") + "不能为空" + "<br>";
					}
				}
			}
		})
		if (requiredTips != null && requiredTips != undefined && $.trim(requiredTips) != "") {
			mui.alert(requiredTips, '提示');
			return false;
		}
	}

	var tableModuleCode = $(obj).attr("tableModuleCode");
	var crfItemsStr = $(obj).attr("moduleDefines");
	var crfItems = JSON.parse(crfItemsStr);
	var rowNum = $(obj).attr("rowNum");
	var data = "";
	var map_codeAndValue = [];
	var map_codeAndRemarkValue = [];
	var mdduleDefineCodeParam = "";
	var _index = 0;
	for (var i = 0; i < crfItems.children.length; i++) {
		var moduleDefine = crfItems.children[i];
		if (moduleDefine.moduleDefineType == "DIR") {
			for (var c = 0; c < moduleDefine.children.length; c++) {
				var moduleDefineCode = moduleDefine.children[c].moduleDefineCode;
				var moduleDefineId = moduleDefine.children[c].moduleDefineId;
				var isVirtual = moduleDefine.children[c].moduleDefineIsVirtual;
				errorMsgProcess(moduleDefineCode + "_0");

				if (isVirtual == "0") {
					var _rowAry = map[moduleDefineCode];
					var _type = "insert";
					if (_rowAry != null && _rowAry != undefined) {
						for (var o = 0; o < _rowAry.length; o++) {
							if (_rowAry[o] == rowNum) {
								_type = "update";
							}
						}
					}
					var value = angular.element(document.getElementById('setDataValue')).scope().getDataValue_crf(moduleDefineCode + "_" + rowNum);
					var remarkValue = $("#remark_" + moduleDefineCode + "_" + rowNum).val();
					if (typeof value == "object") {
						value = undefined;
					}
					if (value == "[object Object]") {
						value = undefined;
					}
					if (value != null && value != undefined && value != 'undefined') {
						data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
						data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
						data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
						data += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
						if (_type == "insert") {
							data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
						} else {
							data += 'indicators[' + moduleDefineCode + '].operationType=update&';
						}
						if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
							data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
						} else {
							data += 'indicators[' + moduleDefineCode + '].comment=&';
						}
						map_codeAndValue[moduleDefineCode] = value;
						map_codeAndRemarkValue[moduleDefineCode] = remarkValue;
					} else {
						if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
							data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
							data += 'indicators[' + moduleDefineCode + '].value=&';
							data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
							data += 'indicators[' + moduleDefineCode + '].rowNum=&';
							if (_type == "insert") {
								data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
							} else {
								data += 'indicators[' + moduleDefineCode + '].operationType=update&';
							}
							data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
							data += 'indicators[' + moduleDefineCode + '].isTableData=YES&';
							map_codeAndValue[moduleDefineCode] = "";
							map_codeAndRemarkValue[moduleDefineCode] = remarkValue;
						}
					}
					mdduleDefineCodeParam += '&arrays[' + _index + "]=" + moduleDefineCode;
					_index++;
				}
			}
		} else {
			var moduleDefineCode = moduleDefine.moduleDefineCode;
			var moduleDefineId = moduleDefine.moduleDefineId;
			var isVirtual = moduleDefine.moduleDefineIsVirtual;
			errorMsgProcess(moduleDefineCode + "_0");
			if (isVirtual == "0") {
				var _rowAry = map[moduleDefineCode];
				var _type = "insert";
				if (_rowAry != null && _rowAry != undefined) {
					for (var c = 0; c < _rowAry.length; c++) {
						if (_rowAry[c] == rowNum) {
							_type = "update";
						}
					}
				}
				var value = angular.element(document.getElementById('setDataValue')).scope().getDataValue_crf(moduleDefineCode + "_" + rowNum);
				var remarkValue = $("#remark_" + moduleDefineCode + "_" + rowNum).val();
				if (typeof value == "object") {
					value = undefined;
				}
				if (value == "[object Object]") {
					value = undefined;
				}
				if (value != null && value != undefined && value != 'undefined') {
					data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
					data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
					data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
					data += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
					if (_type == "insert") {
						data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
					} else {
						data += 'indicators[' + moduleDefineCode + '].operationType=update&';
					}
					if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
						data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
					} else {
						data += 'indicators[' + moduleDefineCode + '].comment=&';
					}
					map_codeAndValue[moduleDefineCode] = value;
					map_codeAndRemarkValue[moduleDefineCode] = remarkValue;
				} else {
					if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined") {
						data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
						data += 'indicators[' + moduleDefineCode + '].value=&';
						data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
						data += 'indicators[' + moduleDefineCode + '].rowNum=&';
						if (_type == "insert") {
							data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
						} else {
							data += 'indicators[' + moduleDefineCode + '].operationType=update&';
						}
						data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
						data += 'indicators[' + moduleDefineCode + '].isTableData=YES&';
						map_codeAndValue[moduleDefineCode] = "";
						map_codeAndRemarkValue[moduleDefineCode] = remarkValue;
					}
				}
				mdduleDefineCodeParam += '&arrays[' + _index + "]=" + moduleDefineCode;
				_index++;
			}
		}
	}
	var isCompleted = false;
	if (currentCrfStatus == "COMPLETED") {
		isCompleted = true;
	}
	var paramValue = data + params + "&visitId=" + visitId + "&patientId=" + patientId +
		"&currentModuleDefineId=" + saveDataModuleDefineId + "&isCompleted=" + isCompleted +
		mdduleDefineCodeParam + paramsAcc;

	mui.ajax({
		url: path + 'crf/saveData.do',
		context: this,
		type: "post",
		data: paramValue,
		dataType: "json",
		cache: "false",
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				mui.toast("修改成功");
				//$("#saveTableData").attr('disabled',false);
				//queryIsDatasHtml(saveTableSucccess);

				setTimeout(function () {
					backIndex = 3;
					backController();
				}, 1500);

			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//整张CRF保存
function saveDataCrf(crfId, index, crfName, crfIndex) {

	//弹出层 当前crf增加背景颜色
	//TODO
	$('.sollLi').each(function () {
		var sollcrfindex = $(this).attr('sollcrfindex');
		if (crfIndex == sollcrfindex) {
			$(this).css('background-color', '#e7f3f9');
		}
	});

	$('.sollLiOnlyView').each(function () {
		var sollcrfindex = $(this).attr('sollcrfindex');
		if (crfIndex == sollcrfindex) {
			$(this).css('background-color', '#e7f3f9');
		}
	});

	/*if($("#isCompletedId_1").css('display') != "none") {
		completed = true;
	} else {
		completed = false;
	}*/
	if ($('#completedId').is(':checked')) {
		completed = true;
	} else {
		completed = false;
	}

	if (completed == true) {
		var requiredTips = "";
		$(".isRequired").each(function () {
			var _classStr = $(this).attr("class");
			var parentClass3 = $(this).parent().parent().parent().attr("class");
			var parentClass4 = $(this).parent().parent().parent().parent().attr("class");
			var parentClass5 = $(this).parent().parent().parent().parent().parent().attr("class");
			var parentClass6 = $(this).parent().parent().parent().parent().parent().parent().attr("class");
			var parentClass7 = $(this).parent().parent().parent().parent().parent().parent().parent().attr("class");
			if (parentClass3 == null || parentClass3 == undefined) {
				parentClass3 = "";
			}
			if (parentClass4 == null || parentClass4 == undefined) {
				parentClass4 = "";
			}
			if (parentClass5 == null || parentClass5 == undefined) {
				parentClass5 = "";
			}
			if (parentClass6 == null || parentClass6 == undefined) {
				parentClass6 = "";
			}
			if (parentClass7 == null || parentClass7 == undefined) {
				parentClass7 = "";
			}
			if (_classStr.indexOf("ng-hide") == -1 && parentClass3.indexOf("ng-hide") == -1 && parentClass4.indexOf("ng-hide") == -1 && parentClass5.indexOf("ng-hide") == -1 && parentClass6.indexOf("ng-hide") == -1 && parentClass7.indexOf("ng-hide") == -1) {

				var _classStr = $(this).attr("class");
				if (_classStr.indexOf("ng-hide") == -1) {
					var ngModel_code = $(this).attr("ng-model");
					var value = angular.element(document.getElementById('saveCrf')).scope().getDataValue_crf(ngModel_code);
					if (typeof value == "object") {
						value = undefined;
					}
					if (value == "[object Object]") {
						value = undefined;
					}
					if (value == null || value == undefined || value == "undefined" || $.trim(value) == "" || (typeof value != 'number' && value == "")) {
						var moduleDefineName = $(this).attr("moduleDefineName");
						var tip = moduleDefineName + "不能为空";
						if (requiredTips.indexOf(tip) > -1) {

						} else {
							requiredTips += $(this).attr("moduleDefineName") + "不能为空" + "<br>";
						}
					}
				}
			}
		});



		//TODO
		var tableModuleNameValue = '';
		$(".tableDatasIsReq").each(function () {
			var tableLeafValue = $(this).children().html();
			var parentClass = $(this).parent().parent().parent().parent().parent().parent().attr("class");
			if (parentClass.indexOf("ng-hide") == -1) {
				if (tableLeafValue == '' || tableLeafValue == undefined || tableLeafValue == null) {
					tableModuleNameValue = $(this).parent().attr('tableModuleName') + "必须最少有一行数据" + "<br>";
				} else {
					tableModuleNameValue = '';
				}
			}
		});
		if (tableModuleNameValue != '') {
			requiredTips += tableModuleNameValue;
		}


		if (requiredTips != null && requiredTips != undefined && $.trim(requiredTips) != "") {
			if (requiredTips.length > 100) {
				mui.alert(requiredTips.substring(0, 100) + '...', '提示');
			} else {
				mui.alert(requiredTips, '提示');
			}
			return false;
		}

	}

	var crfItemsStr = $("#crfItems_two_copy").val();
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
		errorMsgProcess(moduleDefineCode);
		if (isVirtual == "0" && isDatas != "1") {
			// var value = $scope.getDataValue(moduleDefineCode)
			var value = angular.element(document.getElementById('saveCrf')).scope().getDataValue_crf(moduleDefineCode);
			var remarkValue = $("#remark_" + moduleDefineCode).val();
			if (type == "insert") {
				if (typeof value == "object") {
					value = undefined;
				}
				if (value == "[object Object]") {
					value = undefined;
				}
				if (value != null && value != undefined && value != 'undefined') {
					data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
					data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
					data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
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
						data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
						data += 'indicators[' + moduleDefineCode + '].rowNum=&';
						data += 'indicators[' + moduleDefineCode + '].operationType=insert&';
						data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
					}
				}
			} else if (type == "update") {
				if (value == null) {
					value = "";
				}
				if (typeof value == "object") {
					value = undefined;
				}
				if (value == "[object Object]") {
					value = undefined;
				}
				if (value != undefined && value != 'undefined') {
					data += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
					data += 'indicators[' + moduleDefineCode + '].value=' + encodeURIComponent(value) + '&';
					data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
					var rowNum = map_rowNum[moduleDefineCode];
					if (rowNum != '' && rowNum != null && rowNum != undefined) {
						data += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
					} else {
						data += 'indicators[' + moduleDefineCode + '].rowNum=1&';
					}

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
						data += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
						var rowNum = map_rowNum[moduleDefineCode];
						if (rowNum != '' && rowNum != null && rowNum != undefined) {
							data += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
						} else {
							data += 'indicators[' + moduleDefineCode + '].rowNum=1&';
						}
						data += 'indicators[' + moduleDefineCode + '].operationType=update&';
						data += 'indicators[' + moduleDefineCode + '].comment=' + encodeURIComponent(remarkValue) + '&';
					}
				}
			}
		}
		/*else{
			mui.toast("存在虚拟列或表格型数据，不可保存");
			return false;
		}*/
	}

	var isCompleted = completed;

	/*if($("#isCompletedId_1").css('display') != "none") {
		isCompleted = true;
	} else {
		isCompleted = false;
	}*/
	if ($('#completedId').is(':checked')) {
		isCompleted = true;
	} else {
		isCompleted = false;
	}

	var paramValue = data + 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId') + "&visitId=" + visitId + "&patientId=" + patientId + "&currentModuleDefineId=" +
		saveDataModuleDefineId + "&isCompleted=" + isCompleted + paramsAcc;

	mui.ajax({
		url: path + 'crf/saveData.do',
		context: this,
		type: "post",
		data: paramValue,
		dataType: "json",
		cache: "false",
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		success: function (data) {
			if (data.error) {
				if (data.error == 'UnbindUser') {
					unbindUser();
				}
				mui.alert(data.error, '提示');
			} else {
				mui.toast("保存成功");
				if( sessionStorage.getItem('roleFlag') == 'Calendar'){
					mui.openWindow({
						url: "patientGroupDetail.html",
						id: "patientGroupDetail.html"
					})
				}else{
					setTimeout(function () {
						titleController("数据录入")
						if ( (crfIndex*1 + 1*1) > crfArray.length) {
							//mui.alert('没有更多了', '提示');
							crfArray = [],
							crfIndexVal = -1,
							sollCrfIndex = 0;
							setTimeout(function () {
								getCrfData();
							}, 1500);
						} else {
							queryModuleTree(crfId, index, crfName, crfIndex);
						}
	
						/*backIndex = 1;
						backController();*/
	
					}, 1500);
				}
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//删除表格
var removeDeleteLength = '';
function deleteTableData(obj) {
	var btnArray = ['否', '是'];
	mui.confirm('确认删除表格?', '提示', btnArray, function (e) {
		if (e.index == 1) {
			var crfItemsStr = $(obj).attr("moduledefines");
			var crfItems = JSON.parse(crfItemsStr);
			var rowNum = $(obj).attr("rownum");

			//循环获取leaf的moduleDefineCode和moduleDefineId
			getCodeAndId(crfItems, rowNum);

			var isCompleted = false;
			if (currentCrfStatus == "COMPLETED") {
				isCompleted = true;
			}
			var paramValue = dataValue + params + "&visitId=" + visitId + "&patientId=" + patientId +
				"&currentModuleDefineId=" + saveDataModuleDefineId + "&isCompleted=" + isCompleted +
				paramsAcc;

			mui.ajax({
				url: path + 'crf/saveData.do',
				context: this,
				type: "post",
				data: paramValue,
				dataType: "json",
				cache: "false",
				contentType: "application/x-www-form-urlencoded;charset=UTF-8",
				success: function (data) {
					if (data.error) {
						if (data.error == 'UnbindUser') {
							unbindUser();
						}
						mui.alert(data.error, '提示');
					} else {
						queryIsDatasHtml(saveTableSucccess);
						setTimeout(function () {
							backIndex = 3;
							backController();

						}, 1500);
					}
				},
				error: function (xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
				}
			});
		}
	});

}

var dataValue = '';

function getCodeAndId(crfItems, num) {
	dataValue = '';

	var rowNum = num;

	for (var i = 0; i < crfItems.length; i++) {
		var node = crfItems[i];

		var moduleDefineCode = node.moduleDefineCode;
		var isVirtual = node.moduleDefineIsVirtual;
		var moduleDefineId = node.moduleDefineId;

		var moduleDefineType = node.moduleDefineType;
		var nodeChildren = node.children;
		if (moduleDefineType != "DIR") {
			if (isVirtual == "0") {
				dataValue += 'indicators[' + moduleDefineCode + '].moduleDefineId=' + moduleDefineId + '&';
				dataValue += 'indicators[' + moduleDefineCode + '].value=&';
				dataValue += 'indicators[' + moduleDefineCode + '].batchId=' + visitId + '&';
				dataValue += 'indicators[' + moduleDefineCode + '].rowNum=' + rowNum + '&';
				dataValue += 'indicators[' + moduleDefineCode + '].operationType=delete&';
				dataValue += 'indicators[' + moduleDefineCode + '].content=""&';
			}
		}
		if ("" != nodeChildren && undefined != nodeChildren && null != nodeChildren) {
			getCodeAndId(nodeChildren, num);
		}

	}

}

function putDateValue(value, moduleDefineCode, rowNum) {
	if (rowNum == -1) {
		angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode, value, "TEXT");
	} else {
		angular.element(document.getElementById('setDataValue')).scope().setDataValue_crf(moduleDefineCode + "_" + rowNum, value, "TEXT");
	}

}

//获取自动提示
function getInData(obj, ngModel, isDatas, myChoose, myFilter, rowNum) {
	$(obj).blur();
	var _str = "";
	_str += '<ul style="margin-top: 40px;list-style: none;text-align: right;margin-right: 45px;" class="pop_select_class pop-select autoTips"  row-num=' + rowNum + ' my-choose="' + myChoose + '" ng-model="' + ngModel + '" is-datas="' + isDatas + '"' +
		'my-filter="' + myFilter + '">';
	/*  for(var d = 0;d<_attrAy.length; d++){
	 _str +='<li onclick="getThisData(this)">'+_attrAy[d]+'</li>';
	 }*/
	_str += '</ul>';

	var $div = $(_str);
	$(obj).empty();
	var ulObj = $(obj).parent().find('ul');
	ulObj.remove();
	$(obj).parent().append($div);
	angular.element(document.body).injector().invoke(function ($compile) {
		var scope = angular.element($div).scope();
		$compile($div)(scope);
	});

}
//end获取自动提示


function createTableDatas(node, rowNum, remarkValue) {
	var _innerHtml = "";
	if (node != null && node != "" && node != undefined) {

		var projectDefineDataFormat = node.projectDefineDataFormat;
		var dataType = "";
		if (projectDefineDataFormat != null && projectDefineDataFormat != "" && projectDefineDataFormat != undefined) {
			dataType = projectDefineDataFormat.projectDefineDataType;
		}

		//常亮3.8begin
		if (node.moduleDefineIsRequired == 0) {
			_innerHtml += '<my-span imagesFlag="1" class="crf-table-inner-input" my-length-limit="255" type="' + dataType + '" is-datas="1" my-model row-num="' + rowNum + '" ';
		} else {
			_innerHtml += '<my-span imagesFlag="1" moduleDefineName="' + node.moduleDefineName + '" class="crf-table-inner-input isRequiredTab" my-length-limit="255" type="' + dataType + '" is-datas="1" my-model row-num="' + rowNum + '" ';
		}
		//常亮3.8end

		var reference_score = new Array();
		var reference_virtual = new Array();
		//my-score
		if (node.score != null && node.score != "" && node.score != undefined) {
			var cond = "";
			var val = "";
			var myScore = new Array();
			var myScore_1 = "{'score':[";
			for (var i = 0; i < node.score.length; i++) {
				cond = node.score[i].cond;
				val = node.score[i].value;
				for (var j = 0; j < node.score[i].reference.length; j++) {
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
		if (node.moduleDefineIsVirtual == "1") {
			var directive = "";
			if (node.directive != null && node.directive != "" && node.directive != undefined) {
				for (var j = 0; j < node.directive.reference.length; j++) {
					reference_virtual.push(replaceJson(JSON.stringify(node.directive.reference[j])));
				}
				if (node.directive.calculateScore != null && node.directive.calculateScore != "" && node.directive.calculateScore != undefined) {
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
		if (typeof isHaveInquiry != 'undefined' && isHaveInquiry == "yes") {
			_innerHtml += '<a class="crf-btn-inquiry searchInquiryClass" title="您有待处理的质询" moduleDefineCode="' + node.moduleDefineCode + '" rowNum="' + rowNum + '" style="display: none;"></a>';
		}
		if (node.moduleDefineCommentFlag != null && node.moduleDefineCommentFlag != "" && node.moduleDefineCommentFlag != undefined &&
			node.moduleDefineCommentFlag == 1) {
			if (remarkValue != null && remarkValue != undefined && remarkValue != "undefined" && remarkValue != "") {
				_innerHtml += '<div class="arrow-right" title="' + remarkValue + '"></div>';
			}
		}

	}
	return _innerHtml;
}

function errorMsgProcess(moduleDefineCode) {
	var errorMsg = angular.element(document.getElementById('saveDataError')).scope().getDataValue_crfErrorMsg(moduleDefineCode);
	if (errorMsg != undefined) {
		mui.alert(errorMsg);
		throw new Error(errorMsg)
	}
}