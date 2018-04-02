mui.ready(function () {

	var scientificFlag = sessionStorage.getItem('scientificFlag');
	if(scientificFlag == ''){
		$(".btnSave").hide();
		$('.access_control').each(function(){
			$(this).hide();
		});
	}

	getVisitData();

});


function getVisitData() {
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

				if (null != visit.visitTypeName && "" != visit.visitTypeName && undefined != visit.visitTypeName) {
					$("#system-auto").html(visit.visitTypeName);
					$("#system-auto").css('color','#bababa');
				}
				if (null != visit.visitTimeStr && "" != visit.visitTimeStr && undefined != visit.visitTimeStr) {
					$("#visitTime").html(visit.visitTimeStr);
					var roleName = sessionStorage.getItem('role');
					if(roleName == 'PATIENT'){
						$("#visitTime").css('color','#bababa');
						$("#removeNavigate").removeClass('mui-navigate-right');
						$("#visitTime").removeClass('btnClass');
					}else{
						$("#visitTime").css('color','#000');
						$("#removeNavigate").addClass('mui-navigate-right');
						$("#visitTime").addClass('btnClass');

						var btns = $('.btnClass');
						btns.each(function(i, btn) {
							btn.addEventListener('tap', function() {
								var optionsJson = this.getAttribute('data-options') || '{}';
								var options = JSON.parse(optionsJson);
								var picker = new mui.DtPicker(options);
								picker.show(function(rs) {
									btns.html(rs.text);
									btns.css('color','#000000');
									picker.dispose();
								});
							}, false);
						});
					}
				}

			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

//修改访视
mui('.mui-content').on('tap', '.btnSave', function (e) {
	var visitTime = $("#visitTime").html();

	/*if("" == visitTypeId  || null == visitTypeId || undefined == visitTypeId){
		mui.toast("请选择访视类型");
		return false;
	}*/
	if ("" == visitTime || null == visitTime || undefined == visitTime) {
		mui.alert("请选择访视时间", '提示');
		return false;
	}
	var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId');
	var _param = 'patientId=' + sessionStorage.getItem('patientId') + '&visitId=' + sessionStorage.getItem('visitId') + '&visitTime=' + visitTime + '&' + _params;

	mui.ajax(path + 'patient/updateVisit.do?' + _param + paramsAcc, {
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
				mui.toast('修改访视成功');
				setTimeout(function () {
					mui.openWindow({
						url: 'patientGroupDetail.html',
						id: 'patientGroupDetail.html'
					},2500);
				});
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
});

// function backController() {
// 	pushHistory();
// }

// window.addEventListener("popstate", function (e) {
// 	doGetBackIndexValue();
// }, false);

// function doGetBackIndexValue() {
// 	var modifyVisitFlag = sessionStorage.getItem('modifyVisitFlag');
// 	if(modifyVisitFlag == '1'){
// 		mui.openWindow({
// 			url: 'patientGroupDetail.html',
// 			id: 'patientGroupDetail.html'
// 		});
// 	}else if(modifyVisitFlag == '2'){
// 		mui.openWindow({
// 			url: 'patientOnlyViewCrf.html',
// 			id: 'patientOnlyViewCrf.html'
// 		});
// 	}
// }

// function pushHistory() {
// 	var state = {
// 		title: "title",
// 		url: "#"
// 	};
// 	window.history.pushState(state, "title", "#");
// }