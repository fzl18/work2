	//底部菜单栏点击跳转页面
	mui('.mui-bar-tab').on('tap', '.menu-item', function(e) {
		this.classList.add("mui-active");
		var url = "../home/home.html?openId="+localStorage.getItem('openId');
		switch(this.target) {
			case "home":
				url = "../home/home.html?openId="+localStorage.getItem('openId');
				break;
			case "patientManager":
				url = "../patient/patientList.html";
				break;
		}
		mui.openWindow({
			url: url,
			id: url
		});
	});