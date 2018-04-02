if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
var split = "//";
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'ig'), replacement);
};

function createMyNumberLimitErrorMsg(tips,replaceValue,moduleDefineName){
    tips =  tips;
    tips = tips.replaceAll(replaceValue,moduleDefineName);
    tips = tips.replaceAll("[$]","");
    tips = tips.replaceAll("[&][&]","并且");
    tips = tips.replaceAll("[|][|]","或");
    return tips;
}


/*清空监听*/
function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return index;
}

function incrementWatchersCount(current, count) {
    do {
        current.$$watchersCount += count;
    } while ((current = current.$parent));
}


//根据数据格式定义产生step
function createStep(dataformat){
    var index = dataformat.indexOf(".");
    var length = 0;
    if(index >0 )
        length = dataformat.substr(index+1).length;
    if(length > 0){
        var step="0.";
        for(var i = 0;i<length-1;i++){
            step +="0";
        }
        step +="1";
        return step;
    }
    return "1";
}

//html转义特殊字符
String.prototype.replaceSpecialCharToExpressionAll = function() {
    var target = this;

    return target.replace(/＜/g,"&lt").replace(/＞/g,"&gt").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g,"&apos;");
};
String.prototype.replaceLTlSCharToExpressionAll = function() {
    var target = this;

    return target.replace(/＜/g,"&lt").replace(/＞/g,"&gt").replace(/>/g, "&gt;").replace(/</g, "&lt;");
};

//html反向转义
String.prototype.convertSpecialCharFromExpressionAll = function(){
    var target =this;
    return target.replace(new RegExp('&amp;','ig'), "&").replace(new RegExp('&gt;','ig'), ">").replace(new RegExp('&lt;','ig'), "<").replace(new RegExp('&quot;','ig'), "\"").replace(new RegExp('&apos;','ig'), "\'").replace(new RegExp('&nbsp','ig'),"' '");
}

//转16进制
String.prototype.stringToHex = function(){
    var val="";
    var target = this;
    for(var i = 0; i < target.length; i++){
        if(val == "")
            val = target.charCodeAt(i).toString(16);
        else
            val += " " + target.charCodeAt(i).toString(16);
        if((i+1)%10 == 0) val += "\n";
    }
    return val;
}

//js转义
String.prototype.replaceSpecialCharJsAll = function() {
    var target = this;
    target = target.replace(/\\/g,"\\\\")
    target = target.replaceAll("'","\\'");
    target = target.replaceAll("\"","\\\"");
    target = target.replace(/[\xa0\xA0]/g,"");
    target = target.replace(/[\xa0\xA0]/g,"");
    target = target.replace(/[\xd0\xD0]/g,"");
    // fixbug:7604 chushuming
    target = target.replace(/[\x0d\x0D]/g,"");
    target = target.replace(/[\x0a\x0A]/g,"");
    return target;
}

String.prototype.replaceSpecialChar20JsAll = function() {
    var target = this;
    target = target.replace(/[\xa0\xA0]/g," ");
    return target;
}
/**数字判断*/
String.prototype.isNumber = function (){
    var target = this;
    if(target.length == 0) return false;
    return !isNaN(target);
}
function removeChildElement(_element){
    var child = _element.firstChild;
    while (_element.firstChild) {
        _element.removeChild(_element.firstChild);
    }
}

function triggerEvent(name,element){
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(name, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = name;
    }

    event.eventName = name;

    if (document.createEvent) {
        element.dispatchEvent(event);
    } else {
        element.fireEvent("on" + event.eventType, event);
    }
}

var myApp =   angular.module('myApp', []);

myApp.controller('myController', function ($scope) {

    $scope.getDataValue_crf = function (moduleDefineCode) {
        //todo
        if (moduleDefineCode) {
            var ret = eval("$scope." + moduleDefineCode);
			if(ret == null || ret == undefined ) return undefined; //不能使用 !ret 这样将会导致 数字0也错误
			else return ret;
            // if (!$scope.$$phase) $scope.$apply();
        } else {
            return null;
        }
    }
    
    $scope.getDataValue_crfErrorMsg = function (moduleDefineCode) {
        //todo
        if (moduleDefineCode) {
            var ret = eval("$scope." + moduleDefineCode+"ErrorMsg");
            if(ret != null && ret != undefined && ret != "") return ret; //不能使用 !ret 这样将会导致 数字0也错误
            else return undefined;
            // if (!$scope.$$phase) $scope.$apply();
        } else {
            return undefined;
        }
    }

    $scope.setDataValue_crf = function (moduleDefineCode, value, dataType) {
        //todo
        var exe = "$scope." + moduleDefineCode;
        if(value !=null && value != undefined)
            if(typeof value == "string"){
                value = value.replaceAll("\n","");
            }
        if (dataType == 'NUMBER'  && typeof value == "string" && value.isNumber())
            exe = exe + "=" + value + "";
        else
            exe = exe + "='" + value + "'";
        eval(exe);
        if (!$scope.$$phase) $scope.$apply();
    }


    $scope.preTestngCond = function(referenceArrays,ngcond,index,moduleName){

        var length = referenceArrays.length;
        var subModelName = referenceArrays[index];

        var len = subModelName.indexOf("Arrays");
        var referenceName = subModelName.substring(0,len);
        var expressionRet = eval("$scope."+subModelName+" == undefined");
        if(expressionRet) eval("$scope."+subModelName+"=[]");//未定义定义为数组
        var curlen = eval("$scope."+subModelName+".length");
        var curValues = [];
        for(var j = 0 ; j < curlen;j++){
            var  tmpValue = eval("$scope."+subModelName+"["+j+"]");
            if(tmpValue != undefined)
                if(tmpValue.isNumber()){
                    curValues.push(tmpValue);
                }else{
                    curValues.push("'"+tmpValue+"'");
                }
        }

        for(var j = 0 ; j < curValues.length;j++){
            var expression = "$scope."+referenceName+"_"+moduleName+" =" +curValues[j];;
            eval(expression);
            if(length-1 == index){
                var ret =false; try{ret= eval(ngcond);}catch(err){};
                if( ret ) return ret;
            }else{
                //继续走下个门
                var ret2 = $scope.preTestngCond( referenceArrays,ngcond,index+1,moduleName);
                if(ret2) return ret2;
            }
        }
        return false;

    }

    $scope.change = function(expression,rownum) {
        expression = expression.replaceAll("%s",rownum);
        alert(expression);
        eval(expression);
        scope.$apply();
        //$scope.a1_p1_v1_1_bmi =  $scope.a1_p1_v1_1_height/( $scope.a1_p1_v1_1_weight* $scope.a1_p1_v1_1_weight);
    }
    $scope.condReplaceFunction = function(cond,reference,modelName,rowNum){
        for(var i = 0 ;i < reference.length;i++){
            var referenceValue = reference[i].value;
            var referenceIsInSameGroup = reference[i].isInSameGroup;
            var curReference = referenceValue.replaceAll("%s","");
            if(	referenceValue.indexOf("%s") > 0){  //判断为数组
                if(referenceIsInSameGroup != 1 || rowNum == undefined)
                    cond = cond.replaceAll(referenceValue,curReference+"_"+modelName);
                else
                    cond = cond.replaceAll(referenceValue,curReference+"_"+rowNum);
            }
        }
        return cond;
    }
    $scope.condFunction = function(cond,reference,modelName,rowNum){
        //cond = cond.replaceAll("%s","_"+rownum);
        var referenceArrays = [];
        var ngcond =cond;

        //生成ngcond
        for(var i = 0 ;i < reference.length;i++){
            var referenceValue = reference[i].value;
            var referenceIsInSameGroup = reference[i].isInSameGroup;

            ngcond = ngcond.replaceAll(reference[i].value,"$scope."+reference[i].value);
            var curReference = reference[i].value;

            if(	curReference.indexOf("%s") > 0){  //判断为数组
                if(referenceIsInSameGroup == 1 && rowNum != undefined)//在同一组内取相同行号
                {
                    curReference = curReference.replaceAll("%s","");
                    ngcond = ngcond.replaceAll(reference[i].value,curReference+"_"+rowNum);
                }else{
                    var subModelName = curReference.replaceAll("%s","Arrays");//数组
                    referenceArrays.push(subModelName);
                }
            }
        }
        //表格数据已 INDICATOR_9_3 +"当前指标名字->INDICATOR_9_3_INDICATOR_9_4 避免重复
        ngcond = ngcond.replaceAll("%s","_"+modelName);

        for(var i = 0 ; i < reference.length;i++){
            var curReference = reference[i].value;
            var referenceIsInSameGroup = reference[i].isInSameGroup;
            if(	curReference.indexOf("%s") > 0 && (referenceIsInSameGroup !=1 || rowNum == undefined)){  //判断为数组
                var subModelName = curReference.replaceAll("%s","Arrays");//数组watch对象
                $scope.$watchCollection(subModelName, function (newVal, oldVal) {
                    var k = 0;
                    $scope.preTestngCond(referenceArrays,ngcond,k,modelName);
                });
            }
        }
        ngcond = ngcond.replaceSpecialChar20JsAll();//处理特殊字符
        return  ngcond;
    }

    $scope.setElementChildrenDisable=function(element){
        var childs = element.children;
        if(childs == null || childs == undefined) return;
        for (var i = 0, n = childs.length; i < n; i++)
        {
            var child = 	childs[i];
            var childDisable = child.getAttribute("my-disable")
            if(childDisable == null || childDisable == undefined )
            {
                child.setAttribute("disabled",true);
                $scope.setElementChildrenDisable(child);
            }
        }
    }

    $scope.setElementChildrenEnable=function(element){
        var childs = element.children;
        if(childs == null || childs == undefined) return;
        for (var i = 0, n = childs.length; i < n; i++)
        {
            var child = 	childs[i];
            var childDisable = child.getAttribute("my-disable")
            if(childDisable == null || childDisable == undefined )
            {
                child.removeAttribute("disabled");
                $scope.setElementChildrenEnable(child);
            }
        }
    }

    $scope.setDatasValues = function(modelName,type){
        var position = modelName.lastIndexOf("_");
        var subModelName = modelName.substr(0,position);
        var currPosition = modelName.substr(position+1);
        var curVal = eval("$scope."+modelName);//可能会取不到

        var expression = "if($scope."+subModelName+"Arrays == undefined){"+
            "$scope."+subModelName+"Arrays =new Array();"+
            "}";
        if(type == 'NUMBER')
            expression = expression +"$scope."+subModelName+"Arrays["+(currPosition-1)+"]="+curVal+";";
        else
            expression = expression +"$scope."+subModelName+"Arrays["+(currPosition-1)+"]='"+curVal+"';";

        eval(expression);
        if (!$scope.$$phase) $scope.$apply() // fix $digest already in progress
    }

    $scope.chooseFunction=function(filterExpression,modelName,currValue,datas,rowNum,isSelect){
        var filter = null;
        if(filterExpression != null && filterExpression != undefined){
            filter = eval("(" + filterExpression + ")"); //转json对象
        }
        //赋值历史数据
        var oldVar = eval("$scope."+modelName);
        if(oldVar != null && oldVar != undefined) currValue = oldVar;
        if(oldVar != null && oldVar != undefined)
            eval("$scope."+modelName+"= '"+oldVar+"'");
        else
            eval("$scope."+modelName+"= {}");
        eval("$scope."+modelName+"currentValue=\""+currValue+"\"");
        eval("$scope."+modelName+"options=[]");
        eval("$scope." + modelName + "filterOptionsDefault=[]");


        var alwaysCond = "";
        var alwaysngCond = "";
        var modelNameWithRowNum = modelName;


        //确保当只有一个值时被选中
        $scope.$watch(modelName+"options", function(newVal, oldVal, scope) {
            var length = eval("$scope."+modelName+"options.length");
            if(length == 1){
                var value = eval("$scope."+modelName+"options[0]");
                eval("$scope."+modelName+"='"+value+"'");
            }
            if (!$scope.$$phase) $scope.$apply();
        },true);

        for (var l = 0; l < datas.length; l++) {
            var optionValue = datas[l].replaceSpecialCharJsAll();
            eval("$scope." + modelName + "filterOptionsDefault.push('" + optionValue+"')");
            eval("$scope."+modelName+"options.push('"+optionValue+"')");
        }
        eval("$scope."+modelName+"options=[]");
        if(filter !=null && filter != undefined){
            eval("$scope." + modelName +"filterPosition=10000;"); //最开始的位置记录
            eval("$scope." + modelName + "filterLock = 1;"); //锁记录保证每次只能有一个线程在运行
            eval("$scope."+modelName+"filterArray =new Array();");//记录所有数据
            eval("$scope."+modelName+"filterArrayHaveData =new Array();");//记录每次成功的位置 最小的先push
            for(var j = 0 ; j< filter.filters.length; j ++){//针对每种过滤条件进行监听 以实现过滤条件动态变化。

                if(filter.filters[j].cond) {
                    var cond = filter.filters[j].cond;
                    var reference = filter.filters[j].reference;

                    var ngcond = $scope.condFunction(cond, reference, modelName + j, rowNum);

                    // cond = cond.replaceAll("%s","_"+modelName+j);
                    cond = $scope.condReplaceFunction(cond, reference, modelName + j, rowNum);

                    eval("$scope."+modelName+"filterArrayHaveData.push(undefined)");//初始化为全部为空

                    alwaysCond += "!(" + cond + ")&&";
                    alwaysngCond += "!(" + ngcond + ")&&";
                    var values = filter.filters[j].value.split(split);

                    var pushDataExpr = "";
                    eval("$scope." + modelName + "filterOptions" + j + "=[]");
                    for (var k = 0; k < values.length; k++) {
                        pushDataExpr += "eval(\"$scope." + modelName + "filterOptions" + j + ".push('" + values[k] + "')\");";
                    }
                    eval(pushDataExpr);
                    eval("$scope." + modelName + "filterOptions" + j + "Argument={}");//
                    eval("$scope." + modelName + "filterOptions" + j + "Argument.position=" + j);// 变量记录位置
                    eval("$scope." + modelName + "filterOptions" + j + "Argument.values=$scope." + modelName + "filterOptions" + j + ";");//变量记录值

                    eval("$scope."+modelName+"filterArray.push($scope." + modelName + "filterOptions" + j + "Argument)");//初始化当前位置。

                    // eval("'"+pushDataExpr+"'");//
                    // ;//
                    //cond = cond.replaceAll("'","\\'");
                    //ngcond = ngcond.replaceAll("'","\\'");

                    var filterExpr = "$scope.$watch(\""+cond+"\", function(newVal, oldVal, scope) { "+
                        "do{}while($scope."+modelName+"filterLock<=0); $scope."+modelName+"filterLock = 0 ;try{"+
                        "var ret = false; try{ ret = eval("+ngcond+");}catch(err){};"+
                        "if(ret){"+
                        "$scope."+modelName+"filterArrayHaveData.splice("+j+",1,"+j+");"    + //添加已有位置
                        " if($scope."+modelName+"filterPosition >="+j+"){"+
                        " $scope."+modelName+"='';" +
                        "$scope."+modelName+"options=[];"+
                        " $scope."+modelName+"filterPosition="+j+";"+
                        "$scope."+modelName+"options = $scope."+modelName+"filterOptions"+j+"Argument.values;"+   //取值
                        "\t\t\t\t}"+
                        "\t\t}"+
                        "else{  " +
                        "var offsetPosition = undefined;"+
                        "for(var index = 0;index <$scope."+modelName+"filterArrayHaveData.length;index++){ var tv =$scope."+modelName+"filterArrayHaveData[index]; if(tv == "+j+") {offsetPosition = index;break;}}" +
                        " if(offsetPosition != undefined){"+
                        " $scope."+modelName+"filterArrayHaveData.splice(offsetPosition,1,undefined); " +
                        "}"+
                        " var currShiftValue = undefined ;" +
                        "for(var index = 0;index <$scope."+modelName+"filterArrayHaveData.length;index++){ var tv =$scope."+modelName+"filterArrayHaveData[index]; if(tv != undefined) {currShiftValue = index;break;}}" +//找满足条件的数据
                        "$scope."+modelName+"options=[];"+
                        " if(currShiftValue != undefined ){ " +
                        "$scope."+modelName+"filterPosition = currShiftValue; $scope."+modelName+"options = $scope."+modelName+"filterArray[currShiftValue].values;" +
                        "} else {" +
                        "$scope."+modelName+"options=$scope."+modelName+"filterOptionsDefault; $scope."+modelName+"filterPosition = 10000;" +
                        "}" +
                        "\t\t\t\}"+
                        "$scope."+modelName +"filterLock =1;"+
                        "if (!$scope.$$phase) $scope.$apply();}catch(err){ $scope."+modelName +"filterLock =1; };}, true);";
                    //alert(filterExpr);
                    eval(filterExpr);
                }
            }
        }
        alwaysCond +="1==1";
        alwaysngCond += "1==1";
        var alwaysExpr = "";
        if(isSelect)  alwaysExpr += "$scope."+modelName+"options.push('');";
        for(var k = 0 ; k <datas.length;k++){
            var optionValue = datas[k].replaceSpecialCharJsAll();
            alwaysExpr += "$scope."+modelName+"options.push('"+optionValue+"');";
        }


        eval(alwaysExpr);//
        var alwaysExpr = "$scope.$watch(\""+alwaysCond+"\", function(newVal, oldVal, scope) {"+
            "var ret = false; try{ ret =  eval(\""+alwaysngCond+"\");}catch(err){};"+
            "if(ret){"+
            "$scope."+modelName+"options=[];"+
            alwaysExpr;
        if(!currValue) alwaysExpr += "eval($scope."+modelName+" = '');"; //如果没有默认值直接为空值
        alwaysExpr += "if (!$scope.$$phase) $scope.$apply();}}, true);";
        //alert(alwaysExpr);
        eval(alwaysExpr);

    }


});

myApp.directive("mySpan", [function() {
    return {
        restrict: "E",
        priority : 1000,

        replace:true,
        template:"<span ></span>",
        link: function (scope, element, attrs) {
            var $scope = scope;
            var type   = attrs.myType;
            var attrType   = attrs.type;
            var classValue = attrs.class;
            var modelName = attrs.ngModel;
            var value = eval("$scope."+modelName);
            var imagesflag = attrs.imagesflag;
            //value = value.replaceAll("\n","");
            if(attrType == "PIC" && imagesflag != '1'){
                var imgArray = [];
                var temp = "";
                if(value){
                    imgArray = JSON.parse(value);
                }
                temp += "<div class='my-span-pic'>";
                $.each(imgArray, function (index, file) {
                    temp += '<div class="img_box" style="float:none;display:inline-block;margin-left:10px;margin-right:0px">' +
                    '<img moduleDefineCode="'+modelName+'" id="img_'+modelName+'" class="img_url" style="background-image:url('+file.imageUrl_thumbnail+')" fileKey="'+file.fileKey+'" fileName="' + file.fileName + '" src="'+file.imageUrl+'" href="'+file.imageUrl+'" data-lightbox="pre_'+modelName+'" data-preview-src="" data-preview-group="1"></img>'+
                    '</div>';
                })
                temp += "</div>";
                $(element).html(temp);
            }else{
                $(element).html(value);
            }
            $scope.$watch(modelName, function(newVal, oldVal, scope) {
                var value = eval("$scope."+modelName);
                //value = value.replaceAll("\n","");
				var className = element.attr("class");
				if(className != null && className != undefined && className.indexOf("pickClass") > -1){
					if(className != null && className != undefined && className.indexOf("isRequired") > -1){
						if(value != null && value != undefined && value != ""){
						 	$(element).css('color','#222222');
	                        $(element).css('font-size','17px');
	                        $(element).html(value);
						}else{
							$(element).css('color','#A9A9A9');
                        	$(element).css('font-size','17px');
                        	$(element).html("必选");
						}
						
					}else{
						if(value != null && value != undefined && value != ""){
	                        $(element).css('color','#222222');
	                        $(element).css('font-size','17px');
	                        $(element).html(value);
	
						} else {
	                        $(element).css('color','#A9A9A9');
	                        $(element).css('font-size','17px');
	                        
	                        $(element).html("请选择");
							//$(element).html("请选择");
						}
					}
					
				} else if(className != null && className != undefined && className.indexOf("dataPickClass") > -1){
					if(className != null && className != undefined && className.indexOf("isRequired") > -1){
						if(value != null && value != undefined && value != ""){
						 	$(element).css('color','#222222');
	                        $(element).css('font-size','17px');
	                        $(element).html(value);
						}else{
							$(element).css('color','#A9A9A9');
                        	$(element).css('font-size','17px');
                        	$(element).html("必选");
						}
					}else{
						if(value != null && value != undefined && value != ""){
	                        $(element).css('color','#222222');
	                        $(element).css('font-size','17px');
	                        $(element).html(value);
	
						} else {
	                        $(element).css('color','#A9A9A9');
	                        $(element).css('font-size','17px');
	                        
	                        $(element).html("请选择");
							//$(element).html("请选择");
						}
					}
					
				} else if(attrType == "PIC"){
                    var imgArray = [];
                    var temp = "";
                    if(newVal){
                        imgArray = JSON.parse(newVal);
                    }
                    temp += "<div class='my-span-pic'>";
                    $.each(imgArray, function (index, file) {
                        temp += '<div class="img_box" style="float:none;display:inline-block;margin-left:10px;margin-right:0px">' +
                        '<img class="img_url" style="background-image:url('+file.imageUrl_thumbnail+')" fileKey="'+file.fileKey+'" fileName="' + file.fileName + '" src="'+file.imageUrl+'" href="'+file.imageUrl+'" data-lightbox="pre_'+modelName+'" data-preview-src="" data-preview-group="1"></img>'+
                        '</div>';
                    })
                    temp += "</div>";
                    $(element).html(temp);
                } else {
					$(element).html(value);
				}
            },true);
        }
    }
}]);

myApp.directive("mySelect", [function() {
    return {
        restrict: "A",
        priority : 10,
        link: function (scope, element, attrs) {
            var $scope = scope;
            var expression = attrs.mySelect;
            var currValue = attrs.currentValue;
            var datas = expression.split(split);
            var modelName = attrs.ngModel;
            var filterExpression = attrs.myFilter;
            var rownum = attrs.rowNum;
            //var str = "{'cond':'score1>10','value':'fff^hhh'}";
            if(!currValue) $scope.modelName = '';
            $scope.chooseFunction(filterExpression,modelName,currValue,datas,rownum,1)


        }
    }
}]);


myApp.directive("myLengthLimit", [function() {
    return {
        restrict: "A",
        priority : 1000,

        link: function(scope, elem, attrs) {
            var condExpression = attrs.lengthLimitCond;
            var limitLength = attrs.myLengthLimit;
            var indicatorName = attrs.ngModel;
            angular.element(elem).on("keypress", function(e) {
                var key;
                var v = '';


                if (e.which == null) {
                    // IE
                    key = e.keyCode;
                }
                if (e.which != 0) {
                    // all but IE
                    key = e.which;
                }
                var ret =false;
                try{
                    ret = eval(condExpression);
                }catch(err){};
                if(ret){
                    if(this.value.length>=limitLength&&(key != 8 && key != 46)){
                        // alert("length over"+limitLength);
                        $.app.alert("长度限制"+limitLength);
                        e.preventDefault();
                    }
                }
            });
        }
    }
}]);

myApp.directive("myNumberLimit", [function() {
    return {
        restrict: "A",
        priority : 1000,

        link: function(scope, elem, attrs) {
            var $scope =scope;
            var condExpression = attrs.numberLimitCond;
            var limitExpression = attrs.myNumberLimit;

            var indicatorName = attrs.ngModel;
            var moduleDefineName = attrs.moduledefinename;
            var rowNum = attrs.rowNum;
            var miniValue = attrs.myMiniValue;
            limitExpression = limitExpression.replaceAll("%s","_"+rowNum);
            limitExpression = limitExpression.replaceAll(indicatorName,"$scope."+indicatorName+"_value");

            elem.bind('',function(e){
                var curVal =this.value;
                eval("$scope."+indicatorName+"_value="+curVal);
                var ret = false;
                try{
                    ret = eval(limitExpression);
                }catch(err){};
                if(!ret){
                    var tips = limitExpression;
                    tips = createMyNumberLimitErrorMsg(tips,"scope."+indicatorName+"_value",moduleDefineName);
                    eval("$scope."+indicatorName+"ErrorMsg='"+tips+"'");
                    if (!$scope.$$phase) $scope.$apply();
                }else{
                    eval("$scope."+indicatorName+"ErrorMsg=''");
                    if (!$scope.$$phase) $scope.$apply();
                }
                //$scope.$apply(model.assign($scope, false));
            });

            angular.element(elem).on("change", function(e) {
                var curVal =this.value;
                eval("$scope."+indicatorName+"_value="+curVal);
                var ret = false;
                try{
                    ret = eval(limitExpression);
                }catch(err){};
                if(!ret){
                    var tips = limitExpression;
                    tips = createMyNumberLimitErrorMsg(tips,"scope."+indicatorName+"_value",moduleDefineName);
                    eval("$scope."+indicatorName+"ErrorMsg='"+tips+"'");
                    if (!$scope.$$phase) $scope.$apply();
                }else{
                    eval("$scope."+indicatorName+"ErrorMsg=''");
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }
    }
}]);

//自动计算
myApp.directive("virtualDirective", [function() {
    return{
        restrict: "A",
        priority: 1000,
        link: function(scope, elem, attrs) {
            var $scope = scope;
            var expression = attrs.virtualDirective;
            var rownum = attrs.rowNum;
            var modelName = attrs.ngModel;
            var myDataFormat = attrs.myDataFormat;
            var fixIndex = -1;
            var type = attrs.myType;
            if(myDataFormat != null && myDataFormat != undefined){
                fixIndex = myDataFormat.indexOf(".");
            }
            var fix = 0;
            if( fixIndex > 0){
                fix = myDataFormat.substring(fixIndex+1).length;
            }
            //expression = expression.replaceAll("%s",rownum);

            var calculateJson =eval("(" + expression + ")"); //转json对象
            var reference = calculateJson.reference;
            var calcualte = calculateJson.calculate;
            //calcualte = $scope.scoreFunction(calcualte,reference,modelName,rownum);
            var watchCond = "";
            var ngcalculate=calcualte;

            for(var i = 0 ;i < reference.length;i++){
                if(type == 'NUMBER') {//解决BUG#7630 跨CRF加法自动计算
                    ngcalculate = ngcalculate.replaceAll(reference[i].value,"Number($scope."+reference[i].value+")");
                } else {
                    ngcalculate = ngcalculate.replaceAll(reference[i].value,"$scope."+reference[i].value);
                }
                var curReference = reference[i].value;

                if(	curReference.indexOf("%s") > 0){  //判断为数组
                    curReference = curReference.replaceAll("%s","_"+rownum);//数组
                    watchCond = watchCond +curReference+"+";
                }else{
                    curReference = curReference;
                    watchCond = watchCond +curReference+"+";
                }
            }
            watchCond = watchCond + "1";
            ngcalculate = ngcalculate.replaceAll("%s","_"+rownum);

            $scope.$watch(watchCond, function(newVal, oldVal, scope) {
                var exe = "";
                var value = eval(ngcalculate);
                if(type == 'NUMBER') {
                    if(value != undefined && value != null && value != 'NaN')
                        exe +="$scope."+modelName+"=eval("+ngcalculate+");";

                }
                else{
                    if(value != undefined && value != null)
                        exe += "$scope."+modelName+"='"+value+"'";
                    else
                        exe += "$scope."+modelName+"=null";
                }
                try{
                    eval(exe);

                    if( type == 'NUMBER'){
                        var  v = eval("$scope."+modelName);
                        if(v != undefined && v != 'NaN'){
                            v = v.toFixed(fix);
                            eval("$scope."+modelName+"="+v);
                        }

                    }
                    if (!$scope.$$phase) $scope.$apply();
                }catch(err){};
            },true);
        }
    }
}]);

//赋值
myApp.directive("mySetValue",[function(){
    return {
        restrict: "A",
        priority : 0,

        link:function(scope, elem, attrs){
            var $scope = scope;
            var type   = attrs.myType;
            var modelName = attrs.ngModel;
            var value =attrs.value;
            if(type == 'NUMBER')
                eval("($scope." + modelName + "="+value +")");
            else {
                eval("($scope." + modelName + "='"+value+"')");
            }
        }
    }
}]);

myApp.directive("myGroup",[function(){
    return {
        restrict: "A",
        priority : 9,
        link:function(scope, elem, attrs) {

            var $scope =scope;
            var expression = attrs.ngShow;


            var $scope = scope;
            var modelName = attrs.ngModel;
            var showExpression = attrs.myShow;
            var show =eval("(" + showExpression + ")");
            var rowNum = attrs.rowNum;

            var cond = show.cond;
            var reference = show.reference;

            var ngcond = $scope.condFunction(cond,reference,modelName);

            cond = cond.replaceAll("%s","_"+modelName);

            //cond = cond.replaceAll("'","\\'");
            //ngcond = ngcond.replaceAll("'","\\'");

            $scope.$watch(cond,function(newVal, oldVal, scope) {
                var ret =false;
                try{
                    ret = eval(ngcond);
                }catch(err){};
                if(ret){
                    //所有子元素赋值为上一次的值
                    var childs = elem[0].querySelectorAll ("[ng-model]");
                    for (var i = 0, n = childs.length; i < n; i++)
                    {
                        var child = childs[i];

                        var oldValue = "";
                        var ngModelName = child.getAttribute("ng-model");
                        var oldValue =eval("$scope."+ngModelName+"oldValue");
                        if(oldValue != undefined){
                            if(typeof oldValue == "string"){ 							//string
                                if(!oldValue.isNumber()){
                                    eval("$scope."+ngModelName+"='"+oldValue+"'");
                                }else{
                                    eval("$scope."+ngModelName+"="+oldValue);
                                }
                            }else if(typeof oldValue == "number"){
                                eval("$scope."+ngModelName+"="+oldValue);
                            }

                        }
                    }
                    if (!$scope.$$phase) $scope.$apply(); // fix $digest already in progress
                }else{
                    //所有子元素清空值，同时当前单元增加default值
                    //var childs = angular.elem(document.querySelectorAll("my-model"));//getAllElementsWithAttribute("my-model",elem);

                    //所有子元素清空值，同时当前单元增加default值
                    //var childs = angular.elem(document.querySelectorAll("my-model"));//getAllElementsWithAttribute("my-model",elem);

                    //var childs =  $(elem[0].querySelectorAll ("ng-model");//children;
                    var childs = elem[0].querySelectorAll ("[ng-model]");
                    for (var i = 0, n = childs.length; i < n; i++)
                    {
                        var child = childs[i];
                        var ngModelName = child.getAttribute("ng-model");
                        var oldValue =eval("$scope."+ngModelName);
                        if(oldValue != undefined){
                            if(typeof oldValue != "object"){ //not object
                                if(typeof oldValue == "string"){  //string
                                    if(!oldValue.isNumber()){
                                        eval("$scope."+ngModelName+"oldValue='"+oldValue+"'");
                                    }else{
                                        eval("$scope."+ngModelName+"oldValue="+oldValue);
                                    }
                                }else if(typeof oldValue == "number"){
                                    eval("$scope."+ngModelName+"oldValue="+oldValue);
                                }
                                eval("$scope."+ngModelName+"=undefined");
                            }
                        }
                    }
                    if (!$scope.$$phase) $scope.$apply(); // fix $digest already in progress
                }
            });
        }
    }
}]);

myApp.directive("myModel", [function() {
    return {
        restrict: "A",
        priority: 1001,
        link: function(scope, elem, attrs) {

            var $scope = scope;
            var modelName = attrs.ngModel;
            var position = modelName.lastIndexOf("_");
            var subModelName = modelName.substr(0,position);
            var currPosition = modelName.substr(position+1);
            var curVal = undefined;
            var dataType = attrs.myType;
            curVal= eval("$scope."+modelName);
            var expression = "if($scope."+subModelName+"Arrays == undefined){"+
                "$scope."+subModelName+"Arrays =new Array();"+
                "}";
            if(currPosition > 0 && curVal != "")
            {
                if(dataType !='NUMBER' ){
                    curVal = "'" + curVal +"'";
                }

                expression += "$scope."+subModelName+"Arrays["+(currPosition)+"]="+curVal+";";
            }
            else
                expression += "$scope."+subModelName+"Arrays["+(currPosition)+"]= null ;";

            eval(expression);
            if (!$scope.$$phase) $scope.$apply() // fix $digest already in progress

            $scope.$watch(modelName, function(newVal, oldVal, scope) {
                var curVal = eval("$scope."+modelName);
                var expression = "if($scope."+subModelName+"Arrays == undefined){"+
                    "$scope."+subModelName+"Arrays =new Array();"+
                    "}";

                if(dataType=='NUMBER' ){
                    if( curVal !=""&&currPosition >0) //currPosition =0 是临时变量
                        expression = expression + "$scope."+subModelName+"Arrays["+(currPosition)+"]="+curVal+";";
                    else{
                        expression = expression + "$scope."+subModelName+"Arrays["+(currPosition)+"]=null;";
                    }
                }
                else{
                    if(currPosition > 0 && curVal != "")
                        expression = expression + "$scope."+subModelName+"Arrays["+(currPosition)+"]='"+curVal+"';";
                    else
                        expression = expression + "$scope."+subModelName+"Arrays["+(currPosition)+"]=null;";
                }

                eval(expression);
                if (!$scope.$$phase) $scope.$apply(); // fix $digest already in progress
            });

            angular.element(elem).on("change", function(e) {

                //var curVal = this.value;//可能会取不到


            });
        }
    }
}]);


myApp.directive("virtualDirectiveScore", [function() {
    return{
        restrict: "A",
        priority : 100,

        link: function(scope, elem, attrs) {
            var $scope = scope;
            var calculateScoreExpression = attrs.virtualDirectiveScore;
            var rownum = attrs.rowNum;
            var modelName = attrs.ngModel;
            var dataType = attrs.myType;
            var calculateScore =eval("(" + calculateScoreExpression + ")"); //转json对象
            var reference = calculateScore.reference;
            var calcualte = calculateScore.calculateScore;
            //calcualte = $scope.scoreFunction(calcualte,reference,modelName,rownum);
            var watchCond = "";
            var ngcalculateScore=calcualte;
            //生成ngcond
            for(var i = 0 ;i < reference.length;i++){
                ngcalculateScore = ngcalculateScore.replaceAll(reference[i].value,"$scope."+reference[i].value+"score");
                var curReference = reference[i].value;

                if(	curReference.indexOf("%s") > 0){  //判断为数组
                    curReference = curReference.replaceAll("%s","_"+rownum+"score");//数组
                    watchCond = watchCond +curReference+"+";
                }else{
                    curReference = curReference+"score";
                    watchCond = watchCond +curReference+"+";
                }
            }
            watchCond = watchCond + "1";
            ngcalculateScore = ngcalculateScore.replaceAll("%s","_"+rownum);


            //getAllReferencedObject(modelName);
            //3.8*Math.log($scope.TbilScore%s/88.41) + 11.2*Math.log($scope.INRScore) + 9.6*Math.log($scope.CrScore/17.1) + 6.4*$scope.byScore).toFixed(2)
            $scope.$watch(watchCond, function(newVal, oldVal, scope) {
                var exe = "$scope."+modelName;
                if(dataType == 'NUMBER')
                    exe = exe + "=eval("+ngcalculateScore+")";
                else
                    exe = exe + "=eval('"+ngcalculateScore+"')";
                //alert(exe);
                eval(exe);
                if (!$scope.$$phase) $scope.$apply();
            },true);
        }
    }
}]);

myApp.directive("myCondAssign", [function() {
    return {
        restrict: "A",
        priority : 90,

        link: function (scope, element, attrs) {
            var $scope = scope;

            var condAssignExpression = attrs.myCondAssign;
            var condAssign =eval("(" + condAssignExpression + ")"); //转json对象
            var modelName = attrs.ngModel;
            var rowNum = attrs.rowNum;

            if(condAssign !=null && condAssign != undefined){
                eval("$scope." + modelName +"condAssignPosition=10000;");//默认位置
                eval("$scope." + modelName + "condAssignLock = 1;"); //锁
                eval("$scope."+modelName+"condAssignArray =new Array();");//记录所有数据
                eval("$scope."+modelName+"condAssignArrayHaveData =new Array();");//记录每次成功的位置 最小的先push

                for(var j = 0 ; j< condAssign.condAssign.length; j ++){

                    if(condAssign.condAssign[j].cond){

                        var assignValue = condAssign.condAssign[j].value;
                        var reference = condAssign.condAssign[j].reference;
                        var cond      = condAssign.condAssign[j].cond;

                        var ngcond = $scope.condFunction(cond,reference,modelName+j,rowNum);



                        cond = $scope.condReplaceFunction(cond,reference,modelName+j,rowNum);

                        eval("$scope."+modelName+"condAssignArray.push('"+assignValue+"');");
                        eval("$scope."+modelName+"condAssignArrayHaveData.push(undefined)");//设置为全部为空

                        var condAssignExpr = "$scope.$watch(\""+cond+"\", function(newVal, oldVal, scope) { "+
                            "do{}while($scope."+modelName+"condAssignLock<=0); try{" +
                            "$scope."+modelName+"condAssignLock = 0 ;"+
                            "var ret = false; try{ret = eval(\""+ngcond+"\");}catch(err){};"+
                            "if(ret){"+
                            "$scope."+modelName+"condAssignArrayHaveData.splice("+j+",1,"+j+");"+ //添加已有位置
                            " if($scope."+modelName+"condAssignPosition >="+j+"){"+
                            " eval(\"$scope."+modelName+"='"+assignValue+"'\");  $scope."+modelName+"condAssignPosition="+j+";}" +
                            "\t\t\t\t}"+
                            "else{ " +
                            "var  offsetPosition = undefined; "+
                            "for(var index = 0;index <$scope."+modelName+"condAssignArrayHaveData.length;index++){ var tv =$scope."+modelName+"condAssignArrayHaveData[index]; if(tv == "+j+") {offsetPosition = index;break;}}" +
                            "if (offsetPosition != undefined){" +
                            " $scope."+modelName+"condAssignArrayHaveData.splice(offsetPosition,1,undefined); " +
                            "}"+
                            " var currShiftValue = undefined ;" +
                            "for(var index = 0;index <$scope."+modelName+"condAssignArrayHaveData.length;index++){ var tv =$scope."+modelName+"condAssignArrayHaveData[index]; if(tv != undefined) {currShiftValue = index;break;}}" +//找满足条件的数据.
                            "$scope."+modelName+"=undefined;"+
                            " if(currShiftValue != undefined ){  " +
                            " var changeValue = $scope."+modelName+"condAssignArray[currShiftValue];"+
                            "$scope."+modelName+"condAssignPosition = currShiftValue; $scope."+modelName+" = changeValue;" +
                            "\t\t\t\t} else {" +
                            "$scope."+modelName+"=undefined; $scope."+modelName+"condAssignPosition = 10000;" +
                            "\t\t\t\t}" +
                            "\t\t}"+
                            "$scope."+modelName +"condAssignLock =1;"+

                            "if (!$scope.$$phase) $scope.$apply();}catch(err){ $scope."+modelName +"condAssignLock =1;};}, true);" ;
                        eval(condAssignExpr);
                    }
                }
            }
        }
    }
}]);

myApp.directive("myScore", [function() {
    return {
        restrict: "A",
        priority : 100,

        link: function (scope, element, attrs) {
            var $scope = scope;

            var scoreExpression = attrs.myScore;
            var score =eval("(" + scoreExpression + ")"); //转json对象
            var modelName = attrs.ngModel;
            var rowNum = attrs.rowNum;

            if(score !=null && score != undefined){
                eval("$scope." + modelName +"scorePosition=10000;");//默认位置
                eval("$scope." + modelName + "scoreLock = 1;"); //锁
                eval("$scope."+modelName+"scoreArray =new Array();");//记录所有数据
                eval("$scope."+modelName+"scoreArrayHaveData =new Array();");//记录每次成功的位置 最小的先push

                for(var j = 0 ; j< score.score.length; j ++){

                    if(score.score[j].cond){

                        var scoreValue = parseInt(score.score[j].value);
                        var reference = score.score[j].reference;
                        var cond      = score.score[j].cond;

                        var ngcond = $scope.condFunction(cond,reference,modelName+j,rowNum);


                        cond = $scope.condReplaceFunction(cond,reference,modelName+j,rowNum);

                        eval("$scope."+modelName+"scoreArray.push("+scoreValue+");");
                        eval("$scope."+modelName+"scoreArrayHaveData.push(undefined)");//设置为全部为空

                        var scoreExpr = "$scope.$watch(\""+cond+"\", function(newVal, oldVal, scope) { "+
                            "do{}while($scope."+modelName+"scoreLock<=0); try{" +
                            "$scope."+modelName+"scoreLock = 0 ;"+
                            "var ret = false ;try{ret = eval(\""+ngcond+"\");}catch(err){};"+
                            "if(ret){"+
                            "$scope."+modelName+"scoreArrayHaveData.splice("+j+",1,"+j+");"+ //添加已有位置
                            " if($scope."+modelName+"scorePosition >="+j+"){"+
                            " eval('$scope."+modelName+"score="+scoreValue+"');  $scope."+modelName+"scorePosition="+j+";}" +
                            "\t\t\t\t}"+
                            "else{ " +
                            "var  offsetPosition = undefined; "+
                            "for(var index = 0;index <$scope."+modelName+"scoreArrayHaveData.length;index++){ var tv =$scope."+modelName+"scoreArrayHaveData[index]; if(tv == "+j+") {offsetPosition = index;break;}}" +
                            "if (offsetPosition != undefined){" +
                            " $scope."+modelName+"scoreArrayHaveData.splice(offsetPosition,1,undefined); " +
                            "}"+
                            " var currShiftValue = undefined ;" +
                            "for(var index = 0;index <$scope."+modelName+"scoreArrayHaveData.length;index++){ var tv =$scope."+modelName+"scoreArrayHaveData[index]; if(tv != undefined) {currShiftValue = index;break;}}" +//找满足条件的数据.
                            "$scope."+modelName+"score=Number.NaN;"+
                            " if(currShiftValue != undefined ){  " +
                            " var changeValue = $scope."+modelName+"scoreArray[currShiftValue];"+
                            "$scope."+modelName+"scorePosition = currShiftValue; $scope."+modelName+"score = changeValue;" +
                            "\t\t\t\t} else {" +
                            "$scope."+modelName+"score=Number.NaN; $scope."+modelName+"scorePosition = 10000;" +
                            "\t\t\t\t}" +
                            "\t\t}"+
                            "$scope."+modelName +"scoreLock =1;"+

                            "if (!$scope.$$phase) $scope.$apply();}catch(err){ $scope."+modelName +"scoreLock =1;};}, true);" ;
                        eval(scoreExpr);
                    }
                }
            }
        }
    }
}]);

myApp.directive("myShow",['$animate',function($animate) {
    return {
        restrict: "A",
        priority : 1,
        link: function (scope, element, attrs) {
            var $scope = scope;
            var modelName = attrs.ngModel;
            var showExpression = attrs.myShow;
            var show =eval("(" + showExpression + ")");
            var rowNum = attrs.rowNum;

            var cond = show.cond;
            var reference = show.reference;

            var ngCond = $scope.condFunction(cond,reference,modelName,rowNum);

            //cond = cond.replaceAll("%s","_"+modelName);
            cond = $scope.condReplaceFunction(cond,reference,modelName,rowNum);
            //  cond = cond.replaceAll("'","\\'");
            // ngCond = ngCond.replaceAll("'","\\'");




            $scope.$watch(cond, function ngShowWatchAction(value) {
                try{
                    var ret = eval(ngCond);
                    if(ret){
                    }else{
                        eval("$scope."+modelName+"=null");
                        if (!$scope.$$phase) $scope.$apply();
                    }
                }catch(err){};
                $animate[value ? 'removeClass' : 'addClass'](element, "ng-hide", {
                    tempClasses: "ng-hide-animate"
                });

            });

        }
    }
}]);


myApp.directive("myValueCompare",[function() {
    return {
        restrict: "A",
        priority : 100,

        link: function (scope, element, attrs) {
            var $scope = scope;
            var modelName = attrs.ngModel;
            var compareExpression = attrs.myValueCompare;
            var compare =eval("(" + compareExpression + ")");
            var rownum = attrs.rowNum;
            var referVar = null;
            var referVarExpression = "";
            var cond = compare.cond;
            var referce = compare.reference;

            cond = cond.replaceAll("%s","_"+rownum);
            //getAllReferencedObject(modelName);
            //3.8*Math.log($scope.TbilScore%s/88.41) + 11.2*Math.log($scope.INRScore) + 9.6*Math.log($scope.CrScore/17.1) + 6.4*$scope.byScore).toFixed(2)
            var watchVar = "";
            var ngcond = cond;
            var setVar = "$scope."+modelName+"=";
            if(referce.length != 2) return; //参数格式错误
            var referenceModelName ="";
            for(var j = 0 ; j< referce.length; j ++){
                var refer = referce[j].value.replaceAll("%s","_"+rownum);
                if(refer != modelName){
                    setVar = setVar +"$scope."+refer;
                    referVarExpression   ="$scope."+refer;
                }
                ngcond = ngcond.replaceAll(refer,"$scope."+refer);
                watchVar = watchVar+refer+"+";
            }
            watchVar = watchVar +"1";

            $scope.$watch(watchVar, function(newVal, oldVal, scope) {
                try{
                    var ret = eval(ngcond);

                    if(!ret){
                        // alert("指标值修改");
                        if(referVarExpression != "")
                            referVar = eval(referVarExpression);
                        if(referVar != null && referVar != undefined)
                            eval(setVar);
                    }
                    //alert(exe);
                    ;
                    if (!$scope.$$phase) $scope.$apply();
                }catch(err){};
            },true);



        }
    }
}]);

myApp.directive("myDisabled",[function() {
    return {
        restrict: "A",
        priority : 1,
        link: function (scope, element, attrs) {
            var $scope = scope;
            var modelName = attrs.ngModel;
            var disableExpression = attrs.myDisabled;
            var disable =eval("(" + disableExpression + ")");
            var rowNum = attrs.rowNum;

            var cond = disable.cond;
            var reference = disable.reference;

            var ngCond = $scope.condFunction(cond,reference,modelName,rowNum);

            cond = $scope.condReplaceFunction(cond,reference,modelName,rowNum);

            //cond = cond.replaceAll("'","\\'");
            //ngCond = ngCond.replaceAll("'","\\'");

            $scope.$watch(cond, function ngShowWatchAction(value) {
                var ret = false;
                try{
                    ret = eval(ngCond);
                }catch(err){};
                if(!ret){
                    attrs.$set('disabled', true); //element.disabled = "true";

                    $scope.setElementChildrenDisable(element[0]);
                }else{
                    attrs.$set('disabled', false);

                    $scope.setElementChildrenEnable(element[0]);

                }
            });

        }
    }
}]);

myApp.directive("myChooseDirective",[function(){
    return {
        restrict: "A",
        priority : 9,

        link: function (scope, ele, attrs) {
            var $scope = scope;
            var modelName = attrs.myChooseDirective;
            var isDatas = attrs.isDatas;
            var rownum = attrs.rowNum;
            var myValue = attrs.value;
            var datasValue = attrs.myCurrentValue;
            var type = attrs.myType;
            if(datasValue == myValue){
                choosedFlag = true;

                var expression ="	$scope."+modelName+"='"+datasValue+"';";
                eval(expression);
                if(isDatas=="1"){
                    $scope.setDatasValues(modelName,type);
                }
                if(choosedFlag)
                    ele[0].checked = true;
                else
                    ele[0].checked = false;
            }
            angular.element(ele).on("tap", function(e) {
                expression ="	$scope."+modelName+"='"+myValue+"';";		//文本
                eval(expression);
                if(isDatas=="1"){
                    $scope.setDatasValues(modelName,type);
                }
                $(ele).parent().parent().val($(ele).html());
                $(ele).parent().css("display","none");
                if (!$scope.$$phase) $scope.$apply();
            });
//          mui('.pop_select_class').on('tap','.myChooseLi',function(){
//         		expression ="	$scope."+modelName+"='"+myValue+"';";
//              eval(expression);
//              if(isDatas=="1"){
//                  $scope.setDatasValues(modelName,type);
//              }
//              $(this).parent().parent().val($(ele).html());
//              $(this).parent().css("display","none");
//              if (!$scope.$$phase) $scope.$apply();
//              
//      	});
            
        }
    }
}]);

myApp.directive("myChoose", [function() {
    return {
        restrict: "A",
        priority : 10,

        link: function (scope, element, attrs) {
            var $scope = scope;
            var expression = attrs.myChoose;
            expression = expression.convertSpecialCharFromExpressionAll();
            var currValue = attrs.currentValue;
            if(currValue)
                currValue = currValue.replaceSpecialCharJsAll();
            var datas = expression.split(split);
            var modelName = attrs.ngModel;
            var onclickFunction = attrs.myFunctionName;
            var filterExpression = attrs.myFilter;
            var isDatas = attrs.isDatas;
            var rowNum = attrs.rowNum;
            var  mydisabled = attrs.myDisabled;
            if(!rowNum) rowNum = 1;
            //var str = "{'cond':'score1>10','value':'fff^hhh'}";
            if(mydisabled) mydisabled = mydisabled.replaceLTlSCharToExpressionAll();
            $scope.chooseFunction(filterExpression,modelName,currValue,datas,rowNum)


            $scope.$watchCollection(modelName+"options", function (newVal, oldVal) {

                removeChildElement(element[0]);

                var modelNameOptions = eval("$scope."+modelName+"options");
                for(var index = 0 ; index <modelNameOptions.length; index++){
                    if(currValue == undefined) currValue = modelNameOptions[0].replaceSpecialCharJsAll();

                    var optionValue = modelNameOptions[index].replaceSpecialCharJsAll();

                    var tmp = "";
                    if(currValue){
                        if(index == 0){
                            tmp += "<li name="+ modelName +" is_datas="+isDatas+" my-current-value=";
                        }
                        tmp += "<li name="+ modelName +" is_datas="+isDatas+" my-current-value="+currValue ;
                    } else {
                        tmp += "<p class='btn-choicebox'><input name="+ modelName +" type=\"radio\" is_datas="+isDatas;
                    }

                    if(mydisabled) tmp += " my-disabled="+mydisabled;
                    tmp +="    my-choose-directive="+modelName+"  value='"+optionValue+"' row-num="+rowNum+">"+modelNameOptions[index]+"</li>";
                    var $inputObj= $(tmp);
                    element.append($inputObj);

                    angular.element(document.body).injector().invoke(function($compile) {
                        var scope = angular.element(document.body).scope();
                        $compile($inputObj)(scope);
                    });


                }
            });

        }
    }
}]);

myApp.directive("myRadio",[function(){
    return {
        restrict: "A",
        priority : 9,
        link: function (scope, ele, attrs) {
            var $scope = scope;
            var modelName = attrs.myRadio;
            var isDatas = attrs.isDatas;
            var rowIndex = attrs.ngValue;

            var myValue = attrs.value;
            var datasValue = attrs.myCurrentValue;
            var type = attrs.myType;
            var chooseFlag = false;
            if(datasValue == myValue){
                choosedFlag = true;

                var expression ="	$scope."+modelName+"='"+datasValue+"';";
                eval(expression);
                if(isDatas=="1"){
                    $scope.setDatasValues(modelName,type);
                }
                if(choosedFlag)
                    ele[0].checked = true;
                else
                    ele[0].checked = false;
            }

            $scope.$watch(modelName,   function(newVal, oldVal, scope) {
                var currentValue = eval("$scope."+modelName);

                if(currentValue == myValue){
                    ele[0].checked = true;
                }else{
                    ele[0].checked = false;
                }
            });


            //alert("element radio123");
            angular.element(ele).on("click", function(e) {
                var oldVar = eval("$scope."+modelName);
                if(oldVar == myValue) { //取消当前值
                    expression ="	$scope."+modelName+"=undefined";
                }else{
                    expression ="	$scope."+modelName+"='"+myValue+"';";		//文本
                }
                eval(expression);
                if(isDatas=="1"){
                    $scope.setDatasValues(modelName,type);
                }
                if (!$scope.$$phase) $scope.$apply();
            });
        }
    }
}]);

myApp.directive("myChooseRadio", [function() {
    return {
        restrict: "A",
        priority : 10,
        link: function (scope, element, attrs) {
            var $scope = scope;
            var expression = attrs.myChooseRadio;
            expression = expression.convertSpecialCharFromExpressionAll();


            var datas = expression.split(split);
            var modelName = attrs.ngModel;
            var isDatas = attrs.isDatas;
            var rownum = attrs.rowNum;
            var mydisabled = attrs.myDisabled;
            if(!rownum) rownum = 1;
            //var onclickFunction = attrs.myFunctionName;
            var filterExpression = attrs.myFilter;
            //var str = "{'cond':'score1>10','value':'fff^hhh'}";

            var currValue = attrs.currentValue;
            if(mydisabled) mydisabled = mydisabled.replaceLTlSCharToExpressionAll();
            //赋值历史数据
            var oldVar = eval("$scope."+modelName);
            if(oldVar != null && oldVar != undefined) currValue = oldVar;
            if(currValue)
                if(typeof  currValue == "string")
                    currValue = currValue.replaceSpecialCharJsAll();

            $scope.chooseFunction(filterExpression,modelName,currValue,datas,rownum);

            $scope.$watchCollection(modelName+"options", function (newVal, oldVal) {

                removeChildElement(element[0]);
                var modelNameOptions = eval("$scope."+modelName+"options");
                for(var index = 0 ; index <modelNameOptions.length; index++){
                    //var liObj = document.createElement("li");
                    var optionValue = modelNameOptions[index].replaceSpecialCharJsAll()
                    var tmp = "";
                    if(currValue)
                        tmp += "<p class='btn-choicebox'><input name="+ modelName +" type=\"radio\" is_datas="+isDatas+" my-current-value="+currValue ;
                    else
                        tmp += "<p class='btn-choicebox'><input name="+ modelName +" type=\"radio\" is_datas="+isDatas;

                    if(mydisabled) tmp += " my-disabled=\""+mydisabled+"\"";
                    tmp +="  my-radio="+modelName+"  value='"+optionValue+"'  row-num="+rownum+"><label class='ng-scope btn-choicetxt'>"+modelNameOptions[index]+"</label></p>";
                    var $inputObj= $(tmp);
                    element.append($inputObj);


                    element.append($inputObj);

                    angular.element(document.body).injector().invoke(function($compile) {
                        var scope = angular.element(document.body).scope();
                        $compile($inputObj)(scope);
                    });

                }
            });

        }
    }
}]);

myApp.directive("myCheckbox",[function(){
    return {
        restrict: "A",
        priority : 9,
        link: function (scope, element, attrs) {
            var $scope = scope;
            var modelName = attrs.myCheckbox;
            var isDatas = attrs.isDatas;
            var rowIndex = attrs.ngValue;
            var myValue = attrs.currentDataValue;
            var datasValue = attrs.myCurrentDatas;
            // var expression = "1==1";
            var type = attrs.myType;
            var datas = [];
            if(datasValue != undefined)
                datas = datasValue.split(split);
            var choosedFlag =false;
            for(var i = 0;i<datas.length;i++){
                if(datas[i] == myValue){
                    eval("$scope."+modelName+"checkbox["+rowIndex+"]=myValue;");
                    choosedFlag = true;
                    break;
                }
            }
            eval("$scope."+modelName+"='"+datasValue+ "'");
            if(isDatas=="1"){
                $scope.setDatasValues(modelName,type);
            }
            if(choosedFlag) element[0].checked = true;
            else element[0].checked = false;




            $scope.$watch(modelName,   function(newVal, oldVal, scope) {
                var currentValue = eval("$scope." + modelName);
                if (currentValue != undefined && typeof currentValue == 'string' ) {
                    var tmpValues = currentValue.split(split);
                    var index = -1;
                    for(var i = 0 ;i<tmpValues.length;i++){
                        if(tmpValues[i] == myValue) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        element[0].checked = true;
                        eval("$scope."+modelName+"checkbox["+rowIndex+"]=myValue;");
                    } else {
                        element[0].checked = false;
                        eval("$scope."+modelName+"checkbox["+rowIndex+"]=undefined;");
                    }
                }else{
                    element[0].checked = false;
                    eval("$scope."+modelName+"checkbox["+rowIndex+"]=undefined;");
                }

            });

            angular.element(element).on("change", function(e) {
                if(element[0].checked==false){
                    expression ="	$scope."+modelName+"checkbox["+rowIndex+"]=undefined;";
                }else if(element[0].checked==true){
                    expression ="	$scope."+modelName+"checkbox["+rowIndex+"]='"+myValue+"';";		//文本
                }
                eval(expression);
                expression  = "var values='';var haveData=false; for(var i =0 ;i <$scope."+modelName+"checkbox.length;i++){"+

                    " if($scope."+modelName+"checkbox[i]!=undefined&&$scope."+modelName+"checkbox[i]!=null){ if(haveData){values = values +'"+split+"'+ $scope."+modelName+"checkbox[i]; }else{ values = values +$scope."+modelName+"checkbox[i]; haveData=true;}}"+
                    "}"+
                    "$scope."+modelName+"=values;";


                //alert(expression);
                eval(expression);
                var modelNameValue= eval("$scope."+modelName);
                if(modelNameValue == '') eval("$scope."+modelName+"= null");

                //如果是表格则需要进行数组处理
                if(isDatas=="1"){
                    $scope.setDatasValues(modelName,type);
                }
                if (!$scope.$$phase) $scope.$apply();
            });
        }
    }
}]);

//最大值为999999999 超过 11 angularjs会出现问题取值为undefined
myApp.directive("myMaxNumber", [function() {
    return {
        restrict: "A",
        priority : 1,
        link: function (scope, element, attrs) {
            var type =attrs.myType;
            var $scope = scope;
            var modelName = attrs.ngModel;

            if(type == 'NUMBER'){ //数值型限定最大值

                $scope.$watch(modelName,   function(newVal, oldVal, scope) {
                    var oldValue = eval( "$scope."+modelName);
                    var length = 0;
                    if(typeof oldValue == 'string')
                        length = oldValue.toString().length;

                    if(length > 10){ //超过最大值
                        //alert(oldValue);
                        var newValue = oldValue.toString().substr(0,length-1);
                        eval("$scope."+modelName +"="+newValue);
                        if (!$scope.$$phase) $scope.$apply();
                    }
                });
            }
        }
    }
}]);

myApp.directive("myChooseCheckbox", [function() {
    return {
        restrict: "A",
        priority : 10,

        link: function (scope, element, attrs) {
            var $scope = scope;
            var expression = attrs.myChooseCheckbox;
            expression = expression.convertSpecialCharFromExpressionAll();
            var currValue = attrs.currentValue;
            var isDatas = attrs.isDatas;
            var modelName = attrs.ngModel;
            var mydisabled =attrs.myDisabled;
            //赋值历史数据
            var oldVar = eval("$scope."+modelName);
            if(oldVar != null && oldVar != undefined) currValue = oldVar;
            if(currValue)
                currValue = currValue.replaceSpecialCharJsAll();
            var htmlCurrValue = currValue;
            if(htmlCurrValue) htmlCurrValue = htmlCurrValue.replaceSpecialCharToExpressionAll();
            //var onclickFunction = attrs.myFunctionName;
            var filterExpression = attrs.myFilter;
            var datas = expression.split(split);
            var rownum = attrs.rowNum;
            if(!rownum) rownum = 1;
            if(mydisabled) mydisabled = mydisabled.replaceLTlSCharToExpressionAll();


            $scope.chooseFunction(filterExpression,modelName,currValue,datas,rownum);

            $scope.$watchCollection(modelName+"options", function (newVal, oldVal) {

                removeChildElement(element[0]);
                var modelNameOptions = eval("$scope."+modelName+"options");

                var expression = "if($scope."+modelName+"checkbox == undefined){ "+
                    "$scope."+modelName+"checkbox=[];}";
                eval(expression);
                for(var index = 0 ; index <modelNameOptions.length; index++){
                    //var liObj = document.createElement("li");
                    var optionValue = modelNameOptions[index].replaceSpecialCharJsAll();
                    //if(mydisabled)
                    //   mydisabled = mydisabled.replaceSpecialCharJsAll();
                    var tmp = "";
                    if(currValue)
                        tmp += "<p class='btn-choicebox'><input type=\"checkbox\" is_datas="+isDatas+" my-checkbox="+modelName+" my-current-datas="+currValue;
                    else
                        tmp +=  "<p class='btn-choicebox'><input type=\"checkbox\" is_datas="+isDatas+" my-checkbox="+modelName ;
                    if(mydisabled) tmp += " my-disabled=\""+mydisabled+"\"";
                    tmp +=" current-data-value='"+optionValue+"' data-ng-value="+index+" row-num="+rownum+"><label class='ng-scope btn-choicetxt'>"+modelNameOptions[index]+"</label></p>";
                    var $inputObj= $(tmp);
                    element.append($inputObj);

                    angular.element(document.body).injector().invoke(function($compile) {
                        var scope = angular.element(document.body).scope();
                        $compile($inputObj)(scope);
                    });

                }
            });

        }
    }
}]);

//格式控制
myApp.directive("myDataFormat", [function() {
    return {
        restrict: "A",
        priority: 999,
        link: function (scope, element, attrs) {
            var $scope = scope;
            var rownum = attrs.rowNum;
            var modelName = attrs.ngModel;
            var myDataFormat = attrs.myDataFormat;
            var fixIndex = -1;
            var type = attrs.myType;
            if(myDataFormat != null && myDataFormat != undefined){
                fixIndex = myDataFormat.indexOf(".");
            }
            var fix = 0;
            if( fixIndex > 0){
                fix = myDataFormat.substring(fixIndex+1).length;
            }

            $scope.$watch(modelName,   function(newVal, oldVal, scope) {
                var curVal =eval("$scope."+modelName);
                if(curVal) {
                    if(typeof curVal == "number"){
                        curVal = curVal.toString();
                    }
                    if (typeof curVal == "string") {
                        if (!curVal.isNumber() && curVal != '-') {
                            tips = "请输入有效数字";
                            eval("$scope." + modelName + "=undefined" );
                        } else if(curVal == '-'){

                        }else {
                            var newFix = curVal.indexOf(".");
                            var curlength = 0;
                            if (newFix > 0)
                                curlength = curVal.substring(newFix + 1).length;
                            //超过小数点后超出部分数字
                            if (curlength > fix) {
                                curVal = curVal.substr(0, curVal.length - curlength + fix );
                                eval("$scope." + modelName + "=" + curVal);
                            }else{
                                var tips = "";
                                 //fix bug 7660 转换为数值型在自动计算时会强制转换.
                               /* if(newFix > 0 && newFix == (curVal.length -1)) //判断.不在末尾
                                {try{eval("$scope." + modelName + "=" + curVal+".");}catch(err){};}//捕获符值异常
                                else
                                    eval("$scope." + modelName + "=" + curVal);*/
                                var curTips = eval("$scope."+modelName+"ErrorMsg");
                                if(curTips != null && curTips != undefined) {
                                    if (curTips.indexOf("精度不能超过") >= 0 || curTips.indexOf("请输入有效数字") >= 0)//对于其他指令抛出的错误不做处理
                                        eval("$scope." + modelName + "ErrorMsg='" + tips + "'");
                                }
                            }
                        }
                        if (!$scope.$$phase) $scope.$apply();
                    }else {
                        tips = "请输入有效数字";
                        eval("$scope." + modelName + "ErrorMsg='" + tips + "'");
                        eval("$scope." + modelName + "=undefined" );
                        if (!$scope.$$phase) $scope.$apply();
                    }
                }
            });
            angular.element(element).on("blur", function(e) {
                var curVal =this.value;
                if(!curVal.isNumber()) {
                    eval("$scope."+modelName+"=undefined");
                    this.value='';
                }
            });
            angular.element(element).on("keypress", function(e) {
                var key;
                var v = '';


                if (e.which == null) {
                    // IE
                    key = e.keyCode;
                }
                if (e.which != 0) {
                    // all but IE
                    key = e.which;
                }
                var curVal =this.value;
                /*获取当前小数位数*/
                if(!e.shitKey && (key >= 48 && key <= 57)){
                    if(curVal == undefined || curVal == null || curVal=="")
                        curVal =  key-48;
                    else
                        curVal = this.value + (key-48);
                }


                var curValStr = curVal.toString();
                if(curValStr == undefined){
                    tips ="请输入有效数字";
                    eval("$scope."+modelName+"ErrorMsg='"+tips+"'");
                    if (!$scope.$$phase) $scope.$apply();
                    e.preventDefault();
                }else{
                    var newFix = curValStr.indexOf(".");
                    var curlength = 0;
                    if(newFix > 0)
                        curlength = curValStr.substring(newFix+1).length;
                    if(curlength > fix){
                        tips = "精度不能超过"+fix;
                        eval("$scope."+modelName+"ErrorMsg='"+tips+"'");
                        if (!$scope.$$phase) $scope.$apply();
                        e.preventDefault();
                    }
                }

            });
        }
    }
}]);

//正常值校验
myApp.directive("myNumberCheck", [function() {
    return {
        restrict: "A",
        priority : 2,

        link: function (scope, element, attrs) {
            var $scope = scope;
            var expression = attrs.myNumberCheck;
            var rowNum = attrs.rowNum;
            var indicatorName = attrs.ngModel;
            var type = attrs.myType;
            //style="color: #f00;"修改为红色

            expression = expression.replaceAll("%s","_"+rowNum);
            expression = expression.replaceAll(indicatorName,"$scope."+indicatorName+"_value");

            $scope.$watch(indicatorName,   function(newVal, oldVal, scope) {
                var curVal = eval("$scope."+indicatorName);
                eval("$scope."+indicatorName+"_value="+curVal);
                var ret = false;
                try{
                    ret = eval(expression);
                }catch(err){};
                if(!ret){//修改为红色
                    element[0].style="color: #f00;";
                }else{
                    element[0].style="color: #4e4e4e;";
                }
            });
        }
    }
}]);

//mytype
myApp.directive("myType", [function() {
    return {
        restrict: "A",
        priority : 900,

        link: function (scope, element, attrs) {
            var $scope = scope;
            var indicatorName = attrs.ngModel;
            var type = attrs.myType;


            $scope.$watch(indicatorName,   function(newVal, oldVal, scope) {
                var curVal = eval("$scope."+indicatorName);
                if(type == 'NUMBER' && typeof curVal != 'number' && curVal == '') {
                    eval("$scope."+indicatorName+"=Number.NaN;");
                }
                if (!$scope.$$phase) $scope.$apply();
            });
        }
    }
}]);


//手机端处理pick
myApp.directive("myPick", [function() {
    return {
        restrict: "A",
        priority : 10,
        link: function (scope, elem, attrs) {
            var $scope = scope;
            var expression = attrs.myPick;
            var currValue = attrs.currentValue;
            var datas = expression.split(split);
            var modelName = attrs.ngModel;
            var filterExpression = attrs.myFilter;
            var rownum = attrs.rowNum;
            
            /*/ar str = "{'cond':'score1>10','value':'fff^hhh'}";*/
           
            if(!currValue) $scope.modelName = '';
            
            
            $scope.chooseFunction(filterExpression,modelName,currValue,datas,rownum,1);
            
			
			
			$scope.$watchCollection(modelName+"options", function (newVal, oldVal) {

				var arry = new Array();
				var value;
				var text;
				
				
                var modelNameOptions = eval("$scope."+modelName+"options");
                for(var index = 0 ; index <modelNameOptions.length; index++){
                    
                    value = modelNameOptions[index];
                    text = modelNameOptions[index];
                    
                    var _map = [];
					_map["value"]=value;
					_map["text"]=text;
					arry.push(_map);
                }
                
          

              
				
				//点击取消清空值，暂时去掉,待讨论
				/*
				var _obj_cancel = document.querySelector('.mui-poppicker-btn-cancel_'+modelName);
				_obj_cancel.addEventListener('tap', function(event) {
					eval("$scope."+modelName+"=undefined");
					   if (!$scope.$$phase) $scope.$apply();
				}, false);*/
				
				/*angular.element(document.querySelector('.mui-poppicker-btn-ok_'+modelName)).on('click',function(){
					eval("$scope."+modelName+"=currentPicker.getSelectedItems()[0].text");
					   if (!$scope.$$phase) $scope.$apply();
				});
				
				angular.element(document.querySelector('.mui-poppicker-btn-cancel')).on('click',function(){
					eval("$scope."+modelName+"=undefined");
					   if (!$scope.$$phase) $scope.$apply();
				});*/
				angular.element(elem).unbind();
                angular.element(elem).on("tap", function(e) {
                	$("input").blur();
					
					var _objRemove = document.querySelector('.mui-poppicker_'+modelName);
					if(_objRemove != null){
						_objRemove.remove();
					}
					
					var currentPicker = new mui.PopPicker(arry,modelName);
					currentPicker.setData(arry);
					
					
					var _obj = document.querySelector('.mui-poppicker-btn-ok_'+modelName);
					_obj.addEventListener('tap', function(event) {
						$("input").blur();
						eval("$scope."+modelName+"=currentPicker.getSelectedItems()[0].text");
						   if (!$scope.$$phase) $scope.$apply();
					}, false);
					
					currentPicker.show(function(items) {
						angular.element().value = items[0];
					});
				});
				
				 
            });
        }
    }
}]);


//图片指标
myApp.directive("myImages", [function() {
    return {
        restrict: "A",
        priority : 100,

        link: function (scope, element, attrs) {
            var $scope = scope;
            var modelName = attrs.ngModel;
            var mydisabled =attrs.myDisabled;
            var allowAddTimes =attrs.allowaddtimes;
            $scope.$watchCollection(modelName, function (newVal, oldVal) {
                removeChildElement(element[0]);
                if(newVal || newVal == ""){
                    var imgArray = [];
                    if(newVal){
                        imgArray = JSON.parse(newVal);
                    }
                    if(allowAddTimes == 1 && imgArray.length >= 1){
                        $(element).parent().find(".fileinput-button").hide();
                    }else{
                        $(element).parent().find(".fileinput-button").show();
                    }
                    var tmp = "";
                    for (var i=0; i < imgArray.length; i++){
                        var file = imgArray[i];
                        tmp += '<div class="img_box">' +
                            '<i class="del_icon" >&times;</i>'+
                            '<img moduleDefineCode="'+modelName+'" id="img_'+modelName+'" class="img_url" style="background-image:url('+file.imageUrl_thumbnail+')" fileKey="'+file.fileKey+'" fileName="' + file.fileName + '" src="'+file.imageUrl+'" href="'+file.imageUrl+'" data-lightbox="pre_'+modelName+'" data-preview-src="" data-preview-group="pre_'+modelName+'" ></img>'+
                            '</div>';
                    }
                    var $inputObj = $(tmp);
                    element.append($inputObj);
                    angular.element(document.body).injector().invoke(function ($compile) {
                        var scope = angular.element(document.body).scope();
                        $compile($inputObj)(scope);
                    });
                }
            });

        }
    }
}]);
