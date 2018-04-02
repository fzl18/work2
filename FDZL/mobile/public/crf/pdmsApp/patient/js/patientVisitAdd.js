mui.ready(function () {
	getVisitType();

	//backController();
});

// function backController() {
// 	pushHistory();
// }

// window.addEventListener("popstate", function (e) {
// 	doGetBackIndexValue();
// }, false);

// function doGetBackIndexValue() {
// 	mui.openWindow({
// 		url: 'patientDetail.html',
// 		id: 'patientDetail.html'
// 	});

// }

// function pushHistory() {
// 	var state = {
// 		title: "title",
// 		url: "#"
// 	};
// 	window.history.pushState(state, "title", "#");
// }

//新建访视
mui('.mui-content').on('tap', '.btnSave', function (e) {
	$(".btnSave").prop("disabled", true);
	var visitTypeId = $("#visitTypeIdValue").val();
	var visitTime = $("#visitTime").html();

	if ("" == visitTypeId || null == visitTypeId || undefined == visitTypeId) {
		mui.alert("请选择访视类型", '提示');
		$(".btnSave").prop("disabled", false);
		return false;
	}
	if ("" == visitTime || null == visitTime || undefined == visitTime || '请选择' == $.trim(visitTime)) {
		mui.alert("请选择访视时间", '提示');
		$(".btnSave").prop("disabled", false);
		return false;
	}
	var _params = 'siteId=' + sessionStorage.getItem('siteId') + '&roleId=' + sessionStorage.getItem('roleId') +
		'&userId=' + sessionStorage.getItem('userId');
	var _param = 'patientId=' + sessionStorage.getItem('patientId') + '&visitTypeId=' + visitTypeId + '&visitTime=' + visitTime + '&' + _params;

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
				$(".btnSave").prop("disabled", false);
			} else {
				mui.toast('新建访视成功');
				setTimeout(function () {
					mui.openWindow({
						url: 'patientDetail.html',
						id: 'patientDetail.html'
					})
				}, 1500);
			}
		},
		error: function (xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
			$(".btnSave").prop("disabled", false);
		}
	});
});

