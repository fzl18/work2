mui.ready(function () {

	getSearchVisit();

	getCrfData();

	titleController(titleName);

});

var backIndex = 1;

//查询访视信息
function getSearchVisit() {
	var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId') + '&visitId=' + sessionStorage.getItem('visitId') +
		'&patientId=' + sessionStorage.getItem('patientId');
	mui.ajax(path + 'patient/searchVisit.do?' + _params + paramsAcc, {
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
				var visit = data.visit;
				/*var visitIdModify = visit.visitId;
				$("#viewEdit").attr("visitIdModify",visitIdModify);*/

				if (null != visit.visitTypeName && "" != visit.visitTypeName && undefined != visit.visitTypeName) {
					$("#visitTypeName").html(visit.visitTypeName);
				}
				if (null != visit.visitTimeStr && "" != visit.visitTimeStr && undefined != visit.visitTimeStr) {
					$("#visitTimeStr").html("访视时间:" + visit.visitTimeStr);
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
mui('.mui-content').on('tap', '#viewEdit', function() {
	var visitIdModify = $(this).attr('visitIdModify');
	sessionStorage.setItem("visitIdModify", visitIdModify);
	mui.openWindow({
		url: "patientVisitModify.html",
		id: "patientVisitModify.html"
	})
});

var statusValueMap = [];
//获取CRF

function getCrfData() {
	deletePick();

	mui.ajax(path + 'crf/queryModuleTreeIsNotFormByName.do?visitId=' + visitId + '&patientId=' + patientId + '&visitTypeId=' + visitTypeId + '&' + params + paramsAcc, {
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
	crfIndexVal = 0,
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
				str += data1.moduleDefineName;
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
							str += data2.moduleDefineName;
							str += '</a>';
							str += '</li>';
							if ('' != data2.children && null != data2.children && undefined != data2.children) {
								var data2Node_1 = data2.children[0];
								if ("0" == data2Node_1.moduleDefineIsForm) {
									str += '<li class="mui-table-view-cell">';
									str += '<a style="padding-left: 40px;" class="javascript:void(0);">';
									str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
									str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
									str += data2Node_1.moduleDefineName;
									str += '</a>';
									str += '</li>';
									if ('' != data2Node_1.children && null != data2Node_1.children && undefined != data2Node_1.children) {
										var data2Node_2 = data2Node_1.children[0];
										if ("0" == data2Node_2.moduleDefineIsForm) {
											str += '<li class="mui-table-view-cell">';
											str += '<a style="padding-left: 60px;" class="javascript:void(0);">';
											str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
											str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
											str += data2Node_2.moduleDefineName;
											str += '</a>';
											str += '</li>';
											if ('' != data2Node_2.children && null != data2Node_2.children && undefined != data2Node_2.children) {
												var data2Node_3 = data2Node_2.children[0];
												if ("0" == data2Node_3.moduleDefineIsForm) {
													str += '<li class="mui-table-view-cell">';
													str += '<a style="padding-left: 80px;" class="javascript:void(0);">';
													str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
													str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
													str += data2Node_2.moduleDefineName;
													str += '</a>';
													str += '</li>';
													if ('' != data2Node_3.children && null != data2Node_3.children && undefined != data2Node_3.children) {
														var data2Node_4 = data2Node_3.children[0];
														if ("0" == data2Node_4.moduleDefineIsForm) {
															str += '<li class="mui-table-view-cell">';
															str += '<a style="padding-left: 80px;" class="javascript:void(0);">';
															str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
															str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
															str += data2Node_4.moduleDefineName;
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
							str += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTree(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\',' + crfIndexVal + ')">';

							//str += '<a class="mui-navigate-right">';
							str += '<div class="mui-row mui-navigate-right">';
							str += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
							str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							str += '</div>';
							str += '<div class="mui-col-sm-1 mui-col-xs-1">';
							str += '<i class="mui-icon iconfont icon-wenjian"></i>';
							str += '</div>';
							str += '<div class="mui-col-sm-7 mui-col-xs-7">';
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
				str += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTree(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + crfIndexVal + ')">';

				//str += '<a class="mui-navigate-right">';
				str += '<div class="mui-row mui-navigate-right">';
				/*str += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
				str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
				str += '</div>';*/
				str += '<div class="mui-col-sm-1 mui-col-xs-1">';
				str += '<i class="mui-icon iconfont icon-wenjian"></i>';
				str += '</div>';
				str += '<div class="mui-col-sm-8 mui-col-xs-8">';
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
							scrollStr += data2.moduleDefineName;
							scrollStr += '</a>';
							scrollStr += '</li>';
							if ('' != data2.children && null != data2.children && undefined != data2.children) {
								var data2Node_1 = data2.children[0];
								if ("0" == data2Node_1.moduleDefineIsForm) {
									scrollStr += '<li class="mui-table-view-cell">';
									scrollStr += '<a style="padding-left: 30px;" class="javascript:void(0);">';
									scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
									scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
									scrollStr += data2Node_1.moduleDefineName;
									scrollStr += '</a>';
									scrollStr += '</li>';
									if ('' != data2Node_1.children && null != data2Node_1.children && undefined != data2Node_1.children) {
										var data2Node_2 = data2Node_1.children[0];
										if ("0" == data2Node_2.moduleDefineIsForm) {
											scrollStr += '<li class="mui-table-view-cell">';
											scrollStr += '<a style="padding-left: 60px;" class="javascript:void(0);">';
											scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
											scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
											scrollStr += data2Node_2.moduleDefineName;
											scrollStr += '</a>';
											scrollStr += '</li>';
											if ('' != data2Node_2.children && null != data2Node_2.children && undefined != data2Node_2.children) {
												var data2Node_3 = data2Node_2.children[0];
												if ("0" == data2Node_3.moduleDefineIsForm) {
													scrollStr += '<li class="mui-table-view-cell">';
													scrollStr += '<a style="padding-left: 80px;" class="javascript:void(0);">';
													scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
													scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
													scrollStr += data2Node_2.moduleDefineName;
													scrollStr += '</a>';
													scrollStr += '</li>';
													if ('' != data2Node_3.children && null != data2Node_3.children && undefined != data2Node_3.children) {
														var data2Node_4 = data2Node_3.children[0];
														if ("0" == data2Node_4.moduleDefineIsForm) {
															scrollStr += '<li class="mui-table-view-cell">';
															scrollStr += '<a style="padding-left: 80px;" class="javascript:void(0);">';
															scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
															scrollStr += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
															scrollStr += data2Node_4.moduleDefineName;
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
							// if ("" != data2.moduleDefineShowType && null != data2.moduleDefineShowType && undefined != data2.moduleDefineShowType) {
							// 	scrollStr += '<li class="mui-table-view-cell" ' + angularFunction(data2) + ' onclick="queryModuleTreeOnlyView(' + data2.moduleDefineId + ',1,\'' + data2.moduleDefineName + '\')">';
							// } else {
							// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
							// }
							scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data2) + ' moduleDefineId="' + data2.moduleDefineId + '" moduleDefineName="' + data2.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex) + '">';

							//str += '<a class="mui-navigate-right">';
							scrollStr += '<div class="mui-row mui-navigate-right">';
							scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
							scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
							scrollStr += '</div>';
							scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1">';
							scrollStr += '<i class="mui-icon iconfont icon-wenjian"></i>';
							scrollStr += '</div>';
							scrollStr += '<div class="mui-col-sm-6 mui-col-xs-6">';
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
				// if ("" != data1.moduleDefineShowType && null != data1.moduleDefineShowType && undefined != data1.moduleDefineShowType) {
				// 	scrollStr += '<li class="mui-table-view-cell" ' + angularFunction(data1) + ' onclick="queryModuleTreeOnlyView(' + data1.moduleDefineId + ',1,\'' + data1.moduleDefineName + '\',' + sollCrfIndex + ')">';
				// } else {
				// 	scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex * 1 - 1 * 1) + '">';
				// }
				scrollStr += '<li class="mui-table-view-cell sollLi" ' + angularFunction(data1) + ' moduleDefineId="' + data1.moduleDefineId + '" moduleDefineName="' + data1.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex) + '">';
				//str += '<a class="mui-navigate-right">';
				scrollStr += '<div class="mui-row mui-navigate-right">';
				/*scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
				scrollStr += '<i class="mui-icon iconfont icon-guaijiao"></i>';
				scrollStr += '</div>';*/
				scrollStr += '<div class="mui-col-sm-1 mui-col-xs-1">';
				scrollStr += '<i class="mui-icon iconfont icon-wenjian"></i>';
				scrollStr += '</div>';
				scrollStr += '<div class="mui-col-sm-7 mui-col-xs-7">';
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

	console.log(crfArray);

}

function moreCrfStr(nodeValue, sty, index) {

	var str = '';

	for (var i = 0; i < nodeValue.children.length; i++) {
		var node = nodeValue.children[i];
		if ("0" != node.moduleDefineIsForm) {
			crfIndexVal = crfIndexVal + 1;
			sollCrfIndex = sollCrfIndex + 1
			crfArray.push(new crfClass(node.moduleDefineId, crfIndexVal, node.moduleDefineName));
			if ("" != node.moduleDefineShowType && null != node.moduleDefineShowType && undefined != node.moduleDefineShowType) {
				str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ',' + sollCrfIndex + ')">';
			} else {
				if (index == 1) {
					str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ',' + sollCrfIndex + ')">';
				} else {
					str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + sollCrfIndex + '" ' + angularFunction(node) + ' >';
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
			str += '<div class="mui-col-sm-6 mui-col-xs-6">';
			str += node.moduleDefineName;
			str += '</div>';

			var moduleDefineId = node.moduleDefineId,
				statusName = statusValueMap[moduleDefineId];

			if (statusName != "已完成") {
				if (statusName == "录入中" || statusName == "提交中" || statusName == "清理中") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row-status">' + statusName + '</div>';
				} else if (statusName == "已提交" || statusName == "已清理") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row-status color67d3f0">' + statusName + '</div>';
				} else if (statusName == "未录入") {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row-status colorfca9c8">' + statusName + '</div>';
				} else {
					str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row-status finishColor">' + statusName + '</div>';
				}

			} else {
				str += '<div class="mui-col-sm-3 mui-col-xs-3 col25 row-status finishColor">' + statusName + '</div>';
			}
			// str += '</a>';
			str += '</li>';
		} else {
			str += '<li class="mui-table-view-cell" style="padding-left:' + (sty * 1 - 5 * 1) + 'px;">';
			str += '<a class="javascript:void(0);">';
			str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
			str += '<i class="mui-icon iconfont icon-wenjianjia"></i>';
			str += node.moduleDefineName;
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
			if (index == 1) {
				str += '<li class="mui-table-view-cell" ' + angularFunction(node) + ' onclick="queryModuleTree(' + node.moduleDefineId + ',1,\'' + node.moduleDefineName + '\',' + crfIndexVal + ',' + (sollCrfIndex * 1 - 1 * 1) + ')">';
			} else {
				str += '<li class="mui-table-view-cell sollLi" moduleDefineId="' + node.moduleDefineId + '" moduleDefineName="' + node.moduleDefineName + '" index="1" sollCrfIndex="' + (sollCrfIndex) + '" ' + angularFunction(node) + ' >';
			}

			//str += '<a class="mui-navigate-right">';
			str += '<div class="mui-row mui-navigate-right side-row" style="padding-left:' + sty + 'px;">';
			str += '<div class="mui-col-sm-1 mui-col-xs-1 index1">';
			str += '<i class="mui-icon iconfont icon-guaijiao"></i>';
			str += '</div>';
			str += '<div class="mui-col-sm-1 mui-col-xs-1">';
			str += '<i class="mui-icon iconfont icon-wenjian"></i>';
			str += '</div>';
			str += '<div class="mui-col-sm-7 mui-col-xs-7">&nbsp;';
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
			str += node.moduleDefineName;
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
var publicIsCompleted = ''
var notInSameCrfCodes = "";
var notInSameModuleCodes = "";
var notInSameModuleCodes_backup = '';
var notInSameCrfCodes_backup = '';
var _crfFlag = '';

function queryModuleTree(moduleDefineId, index, name, crfFlag) {
	deletePick();
	titleController(name);

	saveDataModuleDefineId = moduleDefineId;

	mui.ajax(path + 'crf/queryModuleTreeIsCrfByModuleDefineId.do?moduleDefineId=' + moduleDefineId + '&visitId=' + visitId + '&patientId=' + patientId + '&' + params + paramsAcc, {
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
				isdatasValue = data.datas;
				publicIsCompleted = data.isCompleted;
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

//拼接CRF树下的指标和组件
var saveTableSucccess = '';
var titleMap = [];

function queryModuleTreeHtml(node, indexValue, obj, crfFlag) {

	if (obj != null) {
		var disableVal = $(obj).parent().attr("disabled");
		if (disableVal == "disabled") {
			return false;
		}
	}

	deletePick();

	var str = '';

	var muiBar = '<a class="mui-icon iconfont icon-mulu mulu-color-class">目录</a>';
	muiBar += '<a class="mui-action-back mui-btn mui-btn-link mui-pull-right mulu-color-class">' + crfFlag + '/' + crfArray.length + '</a>';

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

						if (nodeDate[j].projectDefine.projectDefineWebType != "CHECKBOX"){
							str += '<label class="dir-label">' + nodeDate[j].moduleDefineName + '</label>';
						}else{
							str += '<div style="padding: 11px 15px;">' + nodeDate[j].moduleDefineName + '</div>';
						}

						if (nodeDate[j].projectDefine.projectDefineWebType == "DATETIMEPICKER") {
							str += angularFunctionInput(nodeDate[j], "btnClass mui-input-clear dir-label-clear", -1, false);
						}else if(nodeDate[j].projectDefine.projectDefineWebType == "PICPICKER"){
							str += angularFunctionInput_onlyView(nodeDate[j], "btn mui-btn-block btnClass textRight", -1, false);
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
							saveTableSucccess = nodeDate[j];
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

								if (node_a.projectDefine.projectDefineWebType != "CHECKBOX"){
									str += '<label class="dir-label">' + node_a.moduleDefineName + '</label>';
								}else{
									str += '<div style="padding: 11px 15px;">' + node_a.moduleDefineName + '</div>';
								}

								if (node_a.projectDefine != undefined) {
									if (node_a.projectDefine.projectDefineWebType == "DATETIMEPICKER") {

										str += angularFunctionInput(node_a, "btnClass mui-input-clear dir-label-clear", -1, false);
									}else if(node_a.projectDefine.projectDefineWebType == "PICPICKER"){
										str += angularFunctionInput_onlyView(node_a, "btn mui-btn-block btnClass textRight", -1, false);
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

				if (node[i].projectDefine.projectDefineWebType != "CHECKBOX"){
					str += '<label class="dir-label">' + node[i].moduleDefineName + '</label>';
				}else{
					str += '<div style="padding: 11px 15px;">' + node[i].moduleDefineName + '</div>';
				}

				if (node[i].projectDefine.projectDefineWebType == "DATETIMEPICKER") {
					str += angularFunctionInput(node[i], "btnClass mui-input-clear dir-label-clear", -1, false);
				}else if(node[i].projectDefine.projectDefineWebType == "PICPICKER"){
					str += angularFunctionInput_onlyView(node[i], "btn mui-btn-block btnClass textRight", -1, false);
				} else {
					str += angularFunctionInput(node[i], "mui-input-clear dir-label-clear", -1, false);
				}

				if (null != node[i].unitDefine && "" != node[i].unitDefine && undefined != node[i].unitDefine) {
					str += '<div class="dir-span">' + node[i].unitDefine.unitDefineValue + '</div>';
				}
				str += '</div>';
			}
		}

		var saveDataCrfStr = '';
		saveDataCrfStr += '<div class="mui-row">';
		saveDataCrfStr += '<div class="mui-col-sm-6 mui-col-xs-6">';

		var _crfId = '',
			_crfName = '',
			crfIndex = '',
			_crfIndex = '';

		var _crfIdPrev = '',
			_crfNamePrev = '',
			crfIndexPrev = '';

		for (var e = 0; e < crfArray.length; e++) {
			var crfIndexModule = crfFlag * 1 + 1 * 1;
			if (crfIndexModule == crfArray[e].crfIndex) {
				_crfId = crfArray[e].crfId;
				_crfName = crfArray[e].crfName;
				_crfIndex = crfArray[e].crfIndex;
			}
			if (crfIndexModule > crfArray.length) {
				_crfId = crfIndexModule;
				_crfName = crfIndexModule;
				_crfIndex = crfIndexModule;
			}

			var _crfIndexModule = crfFlag * 1 - 1 * 1;
			if (_crfIndexModule == crfArray[e].crfIndex) {
				_crfIdPrev = crfArray[e].crfId;
				_crfNamePrev = crfArray[e].crfName;
				crfIndexPrev = crfArray[e].crfIndex;
			}
			if (_crfIndexModule > crfArray.length) {
				_crfIdPrev = crfIndexModule;
				_crfNamePrev = crfIndexModule;
				crfIndexPrev = crfIndexModule;
			}
		}

		if (crfIndexPrev == 0) {
			saveDataCrfStr += '<div style="color:#999" class="mui-col-sm-5 mui-col-xs-5 save-class" crfId="' + _crfIdPrev + '" crfName="' + _crfNamePrev + '" crfIndex="' + crfIndexPrev + '">';
			saveDataCrfStr += '上一页';
			saveDataCrfStr += '</div>';
		} else {
			saveDataCrfStr += '<div class="mui-col-sm-5 mui-col-xs-5 save-class" id="saveCrfPrev" crfId="' + _crfIdPrev + '" crfName="' + _crfNamePrev + '" crfIndex="' + crfIndexPrev + '">';
			saveDataCrfStr += '上一页';
			saveDataCrfStr += '</div>';
		}

		saveDataCrfStr += '</div>';

		if ((_crfIndex * 1 - 1 * 1) == crfArray.length) {
			saveDataCrfStr += '<div style="color:#999" class="mui-col-sm-5 mui-col-xs-5 save-class" crfId="' + _crfId + '" crfName="' + _crfName + '" crfIndex="' + _crfIndex + '">';
			saveDataCrfStr += '下一页';
			saveDataCrfStr += '</div>';
		} else {
			saveDataCrfStr += '<div class="mui-col-sm-5 mui-col-xs-5 save-class" id="saveCrf" crfId="' + _crfId + '" crfName="' + _crfName + '" crfIndex="' + _crfIndex + '">';
			saveDataCrfStr += '下一页';
			saveDataCrfStr += '</div>';
		}
		saveDataCrfStr += '</div>';
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
	var $saveDataCrfStr = $(saveDataCrfStr);
	if (indexValue == 1) {
		//$("#dirAndLeaf").empty();
		backIndex = 21;
		//$("#dirAndLeaf").html($div);
		$("#muiBar").html(muiBar);
		$("#saveDataCrf").html(saveDataCrfStr);

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

	//下一页
	mui('.mui-row').on('tap', '#saveCrf', function () {
		var crfId = $(this).attr('crfId'),
			crfName = $(this).attr('crfName'),
			crfIndex = $(this).attr('crfIndex');

		queryModuleTree(crfId, '1', crfName, crfIndex);

	});

	//上一页
	mui('.mui-row').on('tap', '#saveCrfPrev', function () {
		var crfId = $(this).attr('crfId'),
			crfName = $(this).attr('crfName'),
			crfIndex = $(this).attr('crfIndex');

		queryModuleTree(crfId, '1', crfName, crfIndex);

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


	//弹出层 当前crf增加背景颜色
	//TODO
	$('.sollLi').each(function () {
		var sollcrfindex = $(this).attr('sollcrfindex');
		if (sollcrfindex == crfFlag) {
			$(this).css('background-color', '#e7f3f9');
		}
	});

}

//侧滑
function canvas() {
	mui.init();

	//侧滑容器父节点
	var offCanvasWrapper = mui('#offCanvasWrapper');

	//主界面容器
	var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');

	//菜单容器
	var offCanvasSide = document.getElementById("offCanvasSide");

	//移动效果是否为整体移动
	var moveTogether = false;

	//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
	var classList = offCanvasWrapper[0].classList;

	//变换侧滑动画移动效果；
	offCanvasSide.classList.remove('mui-transitioning');
	offCanvasSide.setAttribute('style', '');
	classList.remove('mui-slide-in');
	classList.remove('mui-scalable');
	moveTogether = true;

	//整体滑动时，侧滑菜单在inner-wrap内
	offCanvasInner.insertBefore(offCanvasSide, offCanvasInner.firstElementChild);
	offCanvasWrapper.offCanvas().refresh();

	//主界面和侧滑菜单界面均支持区域滚动；

	mui('#offCanvasSideScroll').scroll();
	mui('#offCanvasContentScroll').scroll();

	//实现ios平台原生侧滑关闭页面；
	if (mui.os.plus && mui.os.ios) {
		mui.plusReady(function () { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
			plus.webview.currentWebview().setStyle({
				'popGesture': 'none'
			});
		});
	}
};

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

	str += '<div id="table_div" tableModuleCode="' + tableModuleCode + '"  onlyView="1" class="crf-table-thead"></div>';

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
	str += '<ul class="mui-table-view mui-table-view-striped mui-table-view-condensed" tableModuleName="' + node.moduleDefineName + '" tablemodulecode="' + node.moduleDefineCode + '">';

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
							str += '<li class="mui-table-view-cell isTable_required isRequiredTabAdd" is-datas="1" row-num="' + rowNum + '" ng-model="' + node_html.moduleDefineCode + '_' + rowNum + '"';
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
							str += '<li class="mui-table-view-cell isTable_required isRequiredTabAdd" is-datas="1" row-num="' + rowNum + '" ng-model="' + node_html.moduleDefineCode + '_' + rowNum + '"';
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

						str += '<div class="ui-flex-item title">';
						str += '<label>' + node_html.moduleDefineName + '</label>';
						str += '</div>';

						str += '<div class="mui-text-right" style="margin-right: 15px;">';
						if (node_html.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
							str += angularFunctionInput_onlyView(node_html, "btn mui-btn-block btnClass textRight", rowNum);
						} else {
							str += angularFunctionInput_onlyView(node_html, "btn mui-btn-block textRight", rowNum);
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
					str += '<li class="mui-table-view-cell isTable_required isRequiredTabAdd" is-datas="1" row-num="' + rowNum + '" ng-model="' + nodeLeafAndDir.moduleDefineCode + '_' + rowNum + '"';
					str += functionShow(nodeLeafAndDir);
					str += 'moduleDefineName="' + nodeLeafAndDir.moduleDefineName + '">';
				} else {
					str += '<li class="mui-table-view-cell" is-datas="1" row-num="' + rowNum + '" ng-model="' + nodeLeafAndDir.moduleDefineCode + '_' + rowNum + '"';
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

				str += '<div class="mui-text-right"  style="margin-right: 15px;">';
				if (nodeLeafAndDir.projectDefine.projectDefineWebType == "DATETIMEPICKER") {
					str += angularFunctionInput_onlyView(nodeLeafAndDir, "btn mui-btn-block btnClass textRight", rowNum);
				} else {
					str += angularFunctionInput_onlyView(nodeLeafAndDir, "btn mui-btn-block textRight", rowNum);
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

	/*if(rowNum == 0) {
		str += '<button type="button" id="saveTableData" accesscontrolkey="addPatient_btn"  moduleDefines="' + nodeValue + '" rowNum="-1" tableModuleCode="' + node[0].moduleDefineCode + '" class="access_control mui-btn mui-btn-block btnSave" onclick="saveTableData(this)">';
		str += '<img class="save-white" src="../../assets/image/save-white.png" alt="" />保存';
		str += '</button>';
	} else {
		str += '<button type="button" id="saveTableData" accesscontrolkey="addPatient_btn" moduleDefines="' + nodeValue + '" rowNum="' + rowNum + '" tableModuleCode="' + node[0].moduleDefineCode + '" class="access_control mui-btn mui-btn-block btnSave" onclick="updateTableData(this)">';
		str += '<img class="save-white" src="../../assets/image/save-white.png" alt="" />修改';
		str += '</button>';
	}*/

	//$("#isDatasNode").hide();

	backIndex = 4;

	$("#crfItems").val(crfFieldsStr);

	$("#isDatasAdd").empty();
	var $div = $(str);
	$("#isDatasAdd").html($div);
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

	alertDatePick()

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
	pushHistory();

}

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

window.addEventListener("popstate", function (e) {
	$(".mui-poppicker").hide();
	$(".mui-backdrop").css("position", "");
	doGetBackIndexValue();
}, false);

//返回赋值
function doGetBackIndexValue() {
	if ("1" == backIndex) {
		mui.openWindow({
			url: 'patientDetail.html',
			id: 'patientDetail.html'
		});
	} else {
		if ("5" == backIndex) {
			backIndex = "4";
		} else if ("4" == backIndex) {
			backIndex = "3";
		} else if ("3" == backIndex) {
			backIndex = "21";
		} else if ("22" == backIndex) {
			backIndex = "21";
		} else if ("21" == backIndex) {
			backIndex = "1";
		}
		goOperation();
	}
}

function pushHistory() {
	var state = {
		title: "title",
		url: "#"
	};
	window.history.pushState(state, "title", "#");
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