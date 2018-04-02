
//添加angular指令 div
function angularFunction(nodeDate) {
    /*if (nodeDate.moduleDefineType == "LEAF") {
        var str = '<div class="crf-control-line fold-padding" ng-model="'+nodeDate.moduleDefineCode+'"';
    }else if (nodeDate.moduleDefineType == "DIR"){
        var str = '<div class="crf-control-border" ng-model="'+nodeDate.moduleDefineCode+'"';
    }*/
    var str = '';
    str += ' ng-model="'+nodeDate.moduleDefineCode+'" ';
    //my-show
    str += functionShow(nodeDate);

    //my-disabled
    str += functionDisabled(nodeDate);

    return str;
}
//end 添加angular指令 div

function replaceJson(jsonReference){
    jsonReference = jsonReference.replaceAll("\"","'")
    return jsonReference;
}

//添加angular指令 input
function angularFunctionInput(node,classStyle,rowNum) {


    var str = "";
    var reference = new Array();
    if (node.moduleDefineType == "LEAF" && node.projectDefine.projectDefineWebType == "INPUT") {
        if (node.projectDefineDataFormat.projectDefineDataType == "NUMBER"){
            //classStyle = "input-number afterTime isTable" ;
            classStyle = "input-number afterTime" ;
        }
        if (node.moduleDefineIsRequired == 0) {
            str += '<input class="' + classStyle + '"  placeholder="请输入" ';
        } else {
            str += '<input moduleDefineName="'+node.moduleDefineName+'" placeholder="必填" class="' + classStyle + ' isRequired"' ;
        }
        if(rowNum == 0){
        	str += ' style="width:85px;" '
        }
        if(rowNum != null && rowNum != undefined && rowNum != '' && rowNum != -1){
        	str += ' style="width:85px;" '
        }
        if (node.projectDefineDataFormat.projectDefineDataType == "NUMBER"){ //增加数值型最大上线判断
            str += " my-max-number ";
            str += 'type="text" ';
        }else{
            str += 'type="'+node.projectDefineDataFormat.projectDefineDataType+'"';
        }
        if(node.moduleDefineIsVirtual == "1"  ) str += "readonly='readonly' style='background-color: white;color:#adabab;'";


        str += functionPublicElement(node,rowNum);

        //my-length-limit and my-data-format
        str += functionLimitAndFormat(node);

        //virtual-directive && virtual-directive-score
        str += functionDirectiveaAndDirectiveScore(node);

        //my-choose

        str += functionChoose(node,rowNum);

        //my-score
        str += functionScore(node);

        //my-cond-assign
        str += functionDirectiveCondAssign(node);

        //my-value-compare
        str += functionValueCompare(node);

        //my-show
        str += functionShow(node);

        //my-disabled
        str += functionDisabled(node);


        //正常值校验
        str += functionNumberCheck(node);
        
        

        str += '>';
    }

    //文本域
    else if(node.moduleDefineType == "LEAF" && node.projectDefine.projectDefineWebType == "TEXTAREA"){

        if (node.moduleDefineIsRequired == 0) {
            str += '<textarea class="' + classStyle + '"';
        } else {
            str += '<textarea moduleDefineName="'+node.moduleDefineName+'" class="' + classStyle + ' isRequired"';
        }

        if(node.moduleDefineIsVirtual == "1"  ) str += "readonly='readonly' ";
        str += functionPublicElement(node,rowNum);

        //my-length-limit and my-data-format
        str += functionLimitAndFormat(node);

        //virtual-directive && virtual-directive-score
        str += functionDirectiveaAndDirectiveScore(node);

        //my-choose
        str += functionChoose(node,rowNum);

        //my-score
        str += functionScore(node);

        //my-cond-assign
        str += functionDirectiveCondAssign(node);

        //my-value-compare
        str += functionValueCompare(node);

        //my-show
        str += functionShow(node);

        //my-disabled
        str += functionDisabled(node);


        //正常值校验
        str += functionNumberCheck(node);

        str += '">';
        str += '</textarea>';
    }

    //my-select
    else if(node.moduleDefineType == "LEAF" && (node.projectDefine.projectDefineWebType == "SELECT" ||
			node.projectDefine.projectDefineWebType == "RADIO"/* || node.projectDefine.projectDefineWebType == "CHECKBOX"*/)){


        var cond ="";
        var myFilter = new Array();
        var myFilter_1 ="{'filters':[";
        var val ="";
        // var options = "a for a in "+node.moduleDefineCode+"options";
        var options = "a for a in "+node.moduleDefineCode;
        if(rowNum != -1) {
            options += "_"+rowNum+"options";
        } else {
            options += "options";
        }

        var moduleDefineConstraintValue = "";
        if(node.moduleDefineConstraints != null && node.moduleDefineConstraints[0].moduleDefineConstraintValue != null && node.moduleDefineConstraints[0].moduleDefineConstraintValue != undefined){
            moduleDefineConstraintValue = node.moduleDefineConstraints[0].moduleDefineConstraintValue;
        }

		var pickValue= $.trim(moduleDefineConstraintValue);
		pickValue = pickValue.replaceSpecialCharToExpressionAll();
		//.replaceAll("//","^")
		

        if(node.filters != null && node.filters != "" && node.filters != undefined){
            for(var i=0;i<node.filters.length;i++){
                cond = node.filters[i].cond;
                val =  node.filters[i].value;
                for(var j=0;j<node.filters[i].reference.length;j++){
                    reference.push(replaceJson(JSON.stringify(node.filters[i].reference[j])));
                 }
                myFilter.push("{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "],'value':'"+val+"'}");

                reference = [];
            }
            var myFilter_2 = "]}";
            var myFilterValue = myFilter_1+myFilter+myFilter_2;

            if (rowNum != -1) {
                options = "a for a in " + node.moduleDefineCode + '_' + rowNum + "options";
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span class="pickClass ' + classStyle + '" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '" my-pick="'+ pickValue +'" my-filter="' + myFilterValue + '" ';
                } else {
                    str += '<my-span moduleDefineName="'+node.moduleDefineName+'" class="pickClass ' + classStyle + ' isRequired" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '" my-pick="'+ pickValue +'" my-filter="' + myFilterValue + '" ';
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span class="pickClass ' + classStyle + '" ng-model="' + node.moduleDefineCode + '" my-pick="'+ pickValue +'" my-filter="' + myFilterValue + '"';
                } else {
                    str += '<my-span moduleDefineName="'+node.moduleDefineName+'" class="pickClass ' + classStyle + ' isRequired" ng-model="' + node.moduleDefineCode + '" my-pick="'+ pickValue +'" my-filter="' + myFilterValue + '"';
                }
            }
        }else {
            if (rowNum != -1) {
                options = "a for a in " + node.moduleDefineCode + '_' + rowNum + "options";
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span class="pickClass ' + classStyle + '" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '" my-pick="'+ pickValue +'" ';
                } else {
                    str += '<my-span moduleDefineName="'+node.moduleDefineName+'" class="pickClass ' + classStyle + ' isRequired" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '" my-pick="'+ pickValue +'" ';
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span class="pickClass input-select afterTime ' + classStyle + '" ng-model="' + node.moduleDefineCode + '" my-pick="'+ pickValue +'" ';
                } else {
                    str += '<my-span moduleDefineName="'+node.moduleDefineName+'" class="' + classStyle + ' pickClass input-select isRequired afterTime ' + classStyle + '" ng-model="' + node.moduleDefineCode + '" my-pick="'+ pickValue +'" ';
                }

            }
        }
        
        /*if (node.moduleDefineIsRequired == 1) {
            str += ' placeholder="必填" ';
        } */

        str += functionDirectiveaAndDirectiveScore(node);
        str += functionScore(node);
        //my-show
        str += functionShow(node);

        //my-disabled
        str += functionDisabled(node);
        str += "></my-span>";
    }
    //my-choose-radio
   /* else if(node.moduleDefineType == "LEAF" && node.projectDefine.projectDefineWebType == "RADIO"){

        var cond ="";
        var myChooseRadio = new Array();
        var myChooseRadio_1 ="{'filters':[";
        var val ="";
        if(node.filters != null && node.filters != "" && node.filters != undefined) {
            for (var i = 0; i < node.filters.length; i++) {
                cond = node.filters[i].cond;
                val = node.filters[i].value;
                for (var j = 0; j < node.filters[i].reference.length; j++) {
                    reference.push(replaceJson(JSON.stringify(node.filters[i].reference[j])));
                }
                myChooseRadio.push("{'cond':'" + cond.replaceAll("'","\\'") + "','reference':[" + reference + "],'value':'" + val + "'}");

                reference = [];
            }

        }
        var myChooseRadio_2 = "]}";
        var myChooseRadioValue = myChooseRadio_1+myChooseRadio+myChooseRadio_2;
        // str +='<p class="btn-choicebox">';

        var tmpExpression = "";
        if( node.moduleDefineConstraints != undefined &&node.moduleDefineConstraints[0].moduleDefineConstraintValue != undefined &&  node.moduleDefineConstraints[0].moduleDefineConstraintValue != null)
            tmpExpression  = node.moduleDefineConstraints[0].moduleDefineConstraintValue.replaceSpecialCharToExpressionAll();

        if (rowNum != -1) {
            if (node.moduleDefineIsRequired == 0) {
                str += '<div type="radio" class="btn-choicecircle btn-wrap" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '"' +
                    'my-choose-radio="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseRadioValue + '"';
            } else {
                str += '<div moduleDefineName="'+node.moduleDefineName+'" type="radio" class="btn-choicecircle btn-wrap isRequired" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '"' +
                    'my-choose-radio="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseRadioValue + '"';
            }
        } else {
            if (node.moduleDefineIsRequired == 0) {
                str += '<div type="radio" class="btn-choicecircle btn-wrap" ng-model="' + node.moduleDefineCode + '" ' +
                    'my-choose-radio="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseRadioValue + '"';
            } else {
                str += '<div moduleDefineName="'+node.moduleDefineName+'" type="radio" class="btn-choicecircle btn-wrap isRequired" ng-model="' + node.moduleDefineCode + '" ' +
                    'my-choose-radio="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseRadioValue + '"';
            }
        }

        if(node.moduleDefineIsDatas == "1") {
            str += ' is-datas = "1"';
        }else{
            str += ' is-datas = "0"';
        }
        str += functionDirectiveaAndDirectiveScore(node);
        str += functionScore(node);
        //my-show
        str += functionShow(node);

        //my-cond-assign
        str += functionDirectiveCondAssign(node);

        //my-disabled
        str += functionDisabled(node);
        str +=" >";


        str +='</div>';
        // str +='</p>';
    }*/
    //my-choose-checkbox
    else if(node.moduleDefineType == "LEAF" && node.projectDefine.projectDefineWebType == "CHECKBOX"){

        var cond ="";
        var myChooseCheckbox = new Array();
        var myChooseCheckbox_1 ="{'filters':[";
        var val ="";
        if(node.filters != null && node.filters != "" && node.filters != undefined) {
            for (var i = 0; i < node.filters.length; i++) {
                cond = node.filters[i].cond;
                val = node.filters[i].value;
                for (var j = 0; j < node.filters[i].reference.length; j++) {
                    reference.push(replaceJson(JSON.stringify(node.filters[i].reference[j])));
                }
                myChooseCheckbox.push("{'cond':'" + cond.replaceAll("'","\\'") + "','reference':[" + reference + "],'value':'" + val + "'}");

                reference = [];
            }

        }
        var myChooseCheckbox_2 = "]}";
        var myChooseCheckboxValue = myChooseCheckbox_1 + myChooseCheckbox + myChooseCheckbox_2;
        // str +='<p class="btn-choicebox">';

        var tmpExpression = "";
        if( node.moduleDefineConstraints != undefined &&node.moduleDefineConstraints[0].moduleDefineConstraintValue != undefined &&  node.moduleDefineConstraints[0].moduleDefineConstraintValue != null)
            tmpExpression  = node.moduleDefineConstraints[0].moduleDefineConstraintValue.replaceSpecialCharToExpressionAll();
        if (rowNum != -1) {
            if (node.moduleDefineIsRequired == 0) {
                str += '<div type="checkbox" class="btn-choicecircle ' + classStyle + '" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '"' +
                    'my-choose-checkbox="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseCheckboxValue + '"';
            } else {
                str += '<div moduleDefineName="'+node.moduleDefineName+'" type="checkbox" class="' + classStyle + 'btn-choicecircle isRequired" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '"' +
                    'my-choose-checkbox="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseCheckboxValue + '"';
            }

        } else {
            if (node.moduleDefineIsRequired == 0) {
                str += '<div type="checkbox" class="btn-choicecircle ' + classStyle + '" ng-model="' + node.moduleDefineCode + '" ' +
                    'my-choose-checkbox="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseCheckboxValue + '"';
            } else {
                str += '<div moduleDefineName="'+node.moduleDefineName+'" type="checkbox" class="' + classStyle + ' btn-choicecircle isRequired" ng-model="' + node.moduleDefineCode + '" ' +
                    'my-choose-checkbox="' + tmpExpression + '" ' +
                    'my-filter="' + myChooseCheckboxValue + '"';
            }
        }

        if(node.moduleDefineIsDatas == "1") {
            str += ' is-datas = "1" ';
        }else{
            str += ' is-datas = "0"';
        }
        str += functionDirectiveaAndDirectiveScore(node);
        str += functionScore(node);
        //my-show
        str += functionShow(node);

        //my-disabled
        str += functionDisabled(node);
        str +=">";
        
        str +='</div>';
        // str +='</p>';
    }

    //时间类型 没有处理
    else if(node.moduleDefineType == "LEAF" && node.projectDefine.projectDefineWebType == "DATETIMEPICKER"){

        var dataFormatValue = node.projectDefineDataFormat.projectDefineDataFormatValue;
        if (strEqual(dataFormatValue, "YYYY-MM-DD", "HH:MI:SS") == 1) {
            k = 1;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span type="text" data-options=\'{"starttoday":1,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' class="dataPickClass date1 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date1 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date1 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date1 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode;
                }
            }
            dataFormat = 'YYYY-MM-DD HH:mm:ss';
        } else if (strEqual(dataFormatValue, "YYYY-MM-DD", "HH:MI") == 1) {
            k = 2;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date2 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date2 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date2 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date2 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode;
                }
            }
            dataFormat = 'YYYY-MM-DD HH:mm';
        } else if (strEqual(dataFormatValue, "YYYY-MM-DD", "HH") == 1) {
            k = 3;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"hour","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date4 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"hour","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date4 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }

            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"hour","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date4 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"hour","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date4 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode;
                }

            }
            dataFormat = 'YYYY-MM-DD hh';
        } else if (strEqual(dataFormatValue, "YYYY-MM-DD", null) == 1) {
            k = 4;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"date","beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date5 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"date","beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date5 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"date","beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date5 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"date","beginYear":1900,"endYear":2050,"moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date5 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode;
                }
            }
            dataFormat = 'YYYY-MM-DD';
        } else if (strEqual(dataFormatValue, "YYYY-MM", null) == 1) {
            k = 5;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"month","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date6 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"month","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date6 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"month","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date6 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"month","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date6 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode;
                }
            }
            dataFormat = 'YYYY-MM';
        } else if (strEqual(dataFormatValue, "YYYY", null) == 1) {
            k = 6;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"year","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date7 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"year","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date7 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"year","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date7 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"year","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date7 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode;
                }
            }
            dataFormat = 'YYYY';
        } else if (strEqual(dataFormatValue, "HH:MI", null) == 1) {
            k = 8;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date8 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date8 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date8 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date8 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode
                }
            }
            dataFormat = 'HH:MI';
        } else if (strEqual(dataFormatValue, "HH:MI:SS", null) == 1) {
            k = 9;
            if (rowNum != -1) {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date9 ' + classStyle + ' time_' + k + '" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date9 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum;
                }
            } else {
                if (node.moduleDefineIsRequired == 0) {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' type="text" class="dataPickClass date9 ' + classStyle + ' time_' + k + '" ' +
                        'ng-model="' + node.moduleDefineCode
                } else {
                    str += '<my-span data-options=\'{"starttoday":1,"type":"time","moduleDefineCode":"'+node.moduleDefineCode+'","rowNum":"'+rowNum+'"}\' moduleDefineName="'+node.moduleDefineName+'" type="text" class="dataPickClass date9 ' + classStyle + ' time_' + k + ' isRequired" ' +
                        'ng-model="' + node.moduleDefineCode
                }
            }
            dataFormat = 'HH:MI:SS';
        }
        str += '"';
        str += functionValueCompare(node);
        str += functionDirectiveaAndDirectiveScore(node);
        //my-show
        str += functionShow(node);

        //my-disabled
        str += functionDisabled(node);

        if(node.moduleDefineIsVirtual == "1"  ) str += "readonly='readonly' style='background-color: #E3E3E3;'";
        
        

        str += "></my-span>";
    }

    //图片指标
    else if(node.projectDefine.projectDefineWebType == "PICPICKER"){
        
        var dataFormatValue = node.projectDefineDataFormat.projectDefineDataFormatValue;
        if (rowNum != -1) {
            if (node.moduleDefineIsRequired == 0) {
                str += '<div class="td_model_pic"><div style="display:inline" allowaddtimes='+node.projectDefine.allowAddTimes +'  my-images="" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode  + '_' + rowNum + '"></div>'+
                    '<span class="btn fileinput-button">' +
                    '';

                str += '<input  moduleDefineName="'+node.moduleDefineName+'"row-num="' + rowNum + '" allowAddTimes='+node.projectDefine.allowAddTimes +' data-url="' + path + 'obj/uploadImage.do?thumbnail=1" accept="image/*" name="files[]" type="file" class="fileupload ' + classStyle + ' " ' +
                    'ng-model="' + node.moduleDefineCode + '_' + rowNum;
            } else {
                // if(isTable){
                //     str += '<div class="td_model_pic"><div style="display:inline" allowaddtimes='+node.projectDefine.allowAddTimes +'  my-images="" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode  + '_' + rowNum + '"></div>'+
                //         '<span class="btn fileinput-button">' +
                //         '';

                //     str += '<input  moduleDefineName="'+node.moduleDefineName+'" allowAddTimes='+node.projectDefine.allowAddTimes +' data-url="' + path + 'obj/uploadImage.do?thumbnail=1" name="files[]" type="file" class="fileupload isRequiredTab ' + classStyle + ' " ' +
                //         'ng-model="' + node.moduleDefineCode + '_' + rowNum;
                // }else{
                    str += '<div class="td_model_pic"><div style="display:inline" allowaddtimes='+node.projectDefine.allowAddTimes +'  my-images="" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode  + '_' + rowNum + '"></div>'+
                        '<span class="btn fileinput-button">' +
                        '';

                    str += '<input  moduleDefineName="'+node.moduleDefineName+'"row-num="' + rowNum + '" allowAddTimes='+node.projectDefine.allowAddTimes +' data-url="' + path + 'obj/uploadImage.do?thumbnail=1" accept="image/*" name="files[]" type="file" class="fileupload isRequired ' + classStyle + ' " ' +
                        'ng-model="' + node.moduleDefineCode + '_' + rowNum;
                //}

            }

        }else{
            if (node.moduleDefineIsRequired == 0) {
                str += '<div style="float:right;margin-left:5%;margin-bottom:10px;"><div style="display:inline" allowaddtimes='+node.projectDefine.allowAddTimes +'  my-images="" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '"></div>'+
                    '<span class="btn fileinput-button">' +
                    '';

                str += '<input  moduleDefineName="'+node.moduleDefineName+'" allowAddTimes='+node.projectDefine.allowAddTimes +' data-url="' + path + 'obj/uploadImage.do?thumbnail=1" accept="image/*" name="files[]" type="file" class="fileupload ' + classStyle + ' " ' +
                    'ng-model="' + node.moduleDefineCode;
            } else {
                // if(isTable){
                //     str += '<div style="float:right;margin-left:5%;margin-bottom:10px;"><div style="display:inline" allowaddtimes='+node.projectDefine.allowAddTimes +'  my-images="" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '"></div>'+
                //         '<span class="btn fileinput-button">' +
                //         '';

                //     str += '<input  moduleDefineName="'+node.moduleDefineName+'" allowAddTimes='+node.projectDefine.allowAddTimes +' data-url="' + path + 'obj/uploadImage.do?thumbnail=1" name="files[]" type="file" class="fileupload isRequiredTab ' + classStyle + ' " ' +
                //         'ng-model="' + node.moduleDefineCode;
                // }else{
                    str += '<div style="float:right;margin-left:5%;margin-bottom:10px;"><div style="display:inline" allowaddtimes='+node.projectDefine.allowAddTimes +'  my-images="" row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '"></div>'+
                        '<span class="btn fileinput-button">' +
                        '';

                    str += '<input moduleDefineName="'+node.moduleDefineName+'" allowAddTimes='+node.projectDefine.allowAddTimes +' data-url="' + path + 'obj/uploadImage.do?thumbnail=1" accept="image/*" name="files[]" type="file" class="fileupload isRequired ' + classStyle + ' " ' +
                        'ng-model="' + node.moduleDefineCode;
                // }

            }
        }

        str += '"';
        str += functionValueCompare(node);
        str += functionDirectiveaAndDirectiveScore(node);
        //my-show
        str += functionShow(node);

        //my-disabled
        str += functionDisabled(node);

        if(node.moduleDefineIsVirtual == "1"  ) str += "readonly='readonly' style='background-color: #E3E3E3;'";

        str += ">";
        str += '</span></div>';
    }


    return str;
}
//end 添加angular指令 input

/**
 * 字符串比较的方法，忽略中间的连接符（空格的assicc码有时是32，有时时160）
 * @param dateFormatValue 传入的完整的字符串
 * @param start 前置
 * @param end 后置
 * @returns {*} 返回是否相等，1-相等；0-不等
 */
function strEqual(dateFormatValue, start, end){
    if (end == null){
        if (dateFormatValue.length != start.length){
            return 0;
        }
        return dateFormatValue == start;
    } else {
        if (dateFormatValue.length < start.length + end.length){
            return 0;
        }
        var idx1 = dateFormatValue.indexOf(start);
        var idx2 = dateFormatValue.indexOf(end);
        if (idx1 < 0 || idx2 < 0){
            return 0;
        }
        if (idx1 == 0 && idx2 + end.length == dateFormatValue.length){
            return 1;
        }
        return 0;
    }
}


function functionDisabled(nodeDate) {
    var cond = "";
    var reference = new Array();
    var str = "";
    if(nodeDate.myDisableds != "" && nodeDate.myDisableds != null && nodeDate.myDisableds != undefined){
        for(var i=0;i<nodeDate.myDisableds.length;i++){
            cond = nodeDate.myDisableds[i].cond;
            for(var j=0;j<nodeDate.myDisableds[i].reference.length;j++){
                reference.push(replaceJson(JSON.stringify(nodeDate.myDisableds[i].reference[j])));
            }
        }
        var myDisable = "{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "]}";
        str += ' my-disabled="'+myDisable+'" ';
        reference = [];
    }

    return str;
}

/*2017-03-09 wrj*/
function functionFinish(nodeDate) {
    var cond = "";
    var reference = new Array();
    var str = "";
    if(nodeDate.myFinish != "" && nodeDate.myFinish != null && nodeDate.myFinish != undefined){
        for(var i=0;i<nodeDate.myFinish.length;i++){
            cond = nodeDate.myFinish[i].cond;
            for(var j=0;j<nodeDate.myFinish[i].reference.length;j++){
                reference.push(replaceJson(JSON.stringify(nodeDate.myFinish[i].reference[j])));
            }
        }
        var myFinish = "{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "]}";
        str += ' my-disabled="'+myFinish+'" ';
        reference = [];
    }
    return str;
}
/*2017-03-09 wrj*/


function functionShow(nodeDate) {
    var cond = "";
    var reference = new Array();
    var str = "";
    if(nodeDate.myShow != "" && nodeDate.myShow != null && nodeDate.myShow != undefined){
        cond = nodeDate.myShow.cond;
        for(var i=0;i<nodeDate.myShow.reference.length;i++){
            reference.push(replaceJson(JSON.stringify(nodeDate.myShow.reference[i])));
        }

        // cond = cond.replaceAll("'","\'");
        var myShow = "{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "]}";
        str += ' my-show="'+myShow+'" ';

        str += ' my-group=""';
        reference = [];
    }
    return str;
}


function functionValueCompare(node){
    var cond = "";
    var reference = new Array();
    var str = "";
    if(node.myValueCompares != null && node.myValueCompares != "" && node.myValueCompares != undefined){
        var cond ="";
        for(var i=0;i<node.myValueCompares.length;i++){
            cond = node.myValueCompares[i].cond;
            for(var j=0;j<node.myValueCompares[i].reference.length;j++){
                reference.push(replaceJson(JSON.stringify(node.myValueCompares[i].reference[j])));
            }
        }
        var myValueCompares = "{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "]} ";
        str += ' my-value-compare="'+myValueCompares+'" ';
        reference = [];
    }
    return str;
}

function functionScore(node){
    var cond = "";
    var reference = new Array();
    var str = "";
    if(node.score != null && node.score != "" && node.score != undefined){
        var cond ="";
        var val ="";
        var myScore = new Array();
        var myScore_1 ="{'score':[";
        for(var i=0;i<node.score.length;i++){
            cond = node.score[i].cond;
            val =  node.score[i].value;
            for(var j=0;j<node.score[i].reference.length;j++){
                reference.push(replaceJson(JSON.stringify(node.score[i].reference[j])));
            }
            myScore.push("{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "],'value':'"+val+"'}");
            reference = [];
        }
        var myScore_2 = "]}";
        var myScoreValue = myScore_1 + myScore + myScore_2;
        str += 'my-score="'+myScoreValue+'"';
    }
    return str;
}

function functionChoose(node,rowNum){
    var cond = "";
    var reference = new Array();
    var str = "";
    if(node.moduleDefineConstraints != null && node.moduleDefineConstraints != "" && node.moduleDefineConstraints != undefined){
        if(node.moduleDefineConstraints[0].moduleDefineConstraintType == "IN"){
            var ngModel = node.moduleDefineCode;
                if(rowNum >= 0) ngModel+= "_"+rowNum;
            var cond ="";
            var myFilter = new Array();
            var myFilter_1 ="{'filters':[";
            var myFilter_2 = "]}";
            var val ="";
            if(node.filters != null && node.filters != "" && node.filters != undefined) {
                for (var i = 0; i < node.filters.length; i++) {
                    cond = node.filters[i].cond;
                    val = node.filters[i].value;
                    for (var j = 0; j < node.filters[i].reference.length; j++) {
                        reference.push(replaceJson(JSON.stringify(node.filters[i].reference[j])));
                    }
                    myFilter.push("{'cond':'" + cond.replaceAll("'","\\'") + "','reference':[" + reference + "],'value':'" + val + "'}");
                    reference = [];
                }

            }
            var myFilterValue = myFilter_1 + myFilter + myFilter_2;
            for(var c = 0;c<node.moduleDefineConstraints.length;c++){
                var mychoose = node.moduleDefineConstraints[c].moduleDefineConstraintValue;
                mychoose = mychoose.replaceSpecialCharToExpressionAll();
                var getInDataFunction = "getInData(this,'"+ngModel+"',1,'"+mychoose+"','"+myFilterValue.replaceSpecialCharJsAll()+"',"+rowNum+")";
                str +='onclick="'+getInDataFunction+'" placeholder="请输入文本" isHaveTips="true"';
            }
        }else{
            //my-number-limit
            if(node.moduleDefineConstraints != null && node.moduleDefineConstraints != "" && node.moduleDefineConstraints != undefined){
                str += 'my-mini-value="'+ node.moduleDefineConstraints[0].myMiniValue+'" my-number-limit="'+node.moduleDefineConstraints[0].moduleDefineConstraintValue+'" number-limit-cond="1==1"';
            }
        }
    }
    return str;
}

function functionDirectiveCondAssign(node){
    var cond = "";
    var reference = new Array();
    var str = "";
    if(node.myCondAssigns != null && node.myCondAssigns != "" && node.myCondAssigns != undefined){
        var cond ="";
        var val ="";
        var condAssign = new Array();
        var condAssignJson_1 ="{'condAssign':[";
        for(var i=0;i<node.myCondAssigns.length;i++){
            cond = node.myCondAssigns[i].cond;
            val =  node.myCondAssigns[i].value;
            for(var j=0;j<node.myCondAssigns[i].reference.length;j++){
                reference.push(replaceJson(JSON.stringify(node.myCondAssigns[i].reference[j])));
            }
            condAssign.push("{'cond':'"+cond.replaceAll("'","\\'") + "','reference':["+reference + "],'value':'"+val+"'}");
            reference = [];
        }
        var condAssignJson_2 = "]}";
        var myCondAssign = condAssignJson_1 + condAssign + condAssignJson_2;
        str += "my-disabled={'cond':'1!=1','reference':[]} ";
        str += 'my-cond-assign="'+myCondAssign+'"';

        var myDisable = "{'cond':'1!=1','reference':[]}";
        str += ' my-disabled="'+myDisable+'"';

        // str += " disabled='true' ";
    }
    return str;
}

function functionDirectiveaAndDirectiveScore(node){
    var cond = "";
    var reference = new Array();
    var str = "";
    if(node.moduleDefineIsVirtual == "1"){
        var directive = "";
        if(node.directive != null && node.directive != "" && node.directive != undefined){
            for(var j=0;j<node.directive.reference.length;j++){

                reference.push(replaceJson(JSON.stringify(node.directive.reference[j])));
            }
            if(node.directive.calculateScore != null && node.directive.calculateScore != "" && node.directive.calculateScore != undefined){
                directive = node.directive.calculateScore;
                var calculateScore = "{'calculateScore':'"+directive + "','reference':["+reference + "]}";
                str += 'virtual-directive-score="'+calculateScore+'"';
                str += 'my-disabled={"cond":"1!=1","reference":[]} ';
            }else{
                directive = node.directive.calculate;
                var calculate = "{'calculate':'"+directive + "','reference':["+reference + "]}";
                str += 'virtual-directive="'+calculate+'"';
                str += 'my-disabled={"cond":"1!=1","reference":[]} ';
            }
            reference = [];
        }

    }
    return str;
}

function functionLimitAndFormat(node){
    var str = "";

    if(node.projectDefineDataFormat != null && node.projectDefineDataFormat != "" && node.projectDefineDataFormat != undefined){
        if(node.projectDefineDataFormat.projectDefineDataType == "TEXT" ) //文本增加长度
            str += 'my-length-limit="'+node.projectDefineDataFormat.projectDefineDataFormatValue+'" length-limit-cond="1==1" ';
        //'placeholder="文本长度不能超过'+node.projectDefineDataFormat.projectDefineDataFormatValue+'"';
        if(node.projectDefineDataFormat.projectDefineDataType == "NUMBER" )//数据格式增加格式字段
            str += 'my-data-format="'+node.projectDefineDataFormat.projectDefineDataFormatValue+'"';

            str += 'step="'+createStep(node.projectDefineDataFormat.projectDefineDataFormatValue)+'"';;
    }

    return str;
}

//正常值校验
function functionNumberCheck(node){
    var str = "";
    if(node.moduleDefineChecks != null && node.moduleDefineChecks != "" && node.moduleDefineChecks != undefined){
        str += 'my-number-check="'+ node.moduleDefineChecks[0].moduleDefineCheckValue+'" ';
    }
    return str;
}

function functionPublicElement(node,rowNum){
    var str = "";
    if(rowNum != -1) {
        str += 'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '"';
    } else {
        str += 'ng-model="'+node.moduleDefineCode+'"';
    }

    if(node.moduleDefineIsDatas == "1"){
        str +=' my-model is-datas="1" ';
    }else{
        str +=' is-datas="0" ';
    }


    if(node.projectDefineDataFormat != null && node.projectDefineDataFormat!= undefined && node.projectDefineDataFormat != ""){
        if(node.projectDefineDataFormat.projectDefineDataType != null && node.projectDefineDataFormat.projectDefineDataType!= undefined && node.projectDefineDataFormat.projectDefineDataType != ""){
            str += '    my-type="'+ node.projectDefineDataFormat.projectDefineDataType +'"' ;
        }
    }
    return str;
}