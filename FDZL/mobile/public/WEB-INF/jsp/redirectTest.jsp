<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="zh-CN">
<head>
    <title>Title</title>
</head>
<body>
<div>
    <label>访问地址</label><br>
    <input type="text" name="访问地址" id="urlId" value="http://localhost:8091/portal/" style="width: 400px;height: 30px">
    <br>
    <label>param</label><br>
    <textarea rows="6" cols="120" id="paramsId"></textarea>
    <br>
    <button onclick="doFunc();">测试</button>
</div>
</body>

<script src="js/jquery.1.9.1.min.js"></script>
<script type="text/javascript">
    var redirectUrl = '${url}';
    window.location.assign(redirectUrl);
    function doFunc() {
        var url = $("#urlId").val();
        var param = $("#paramsId").val();
        alert(url+"?"+param);
        window.open(url+"?"+param);
    }
</script>
</html>
