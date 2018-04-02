//添加angular指令 input
function angularFunctionInput_onlyView(node,classStyle,rowNum) {
    var str = "";
    var reference = new Array();
    if (node.moduleDefineType == "LEAF") {
        str += '<my-span class="control-line-inputtext" ng-readonly="true" type="'+node.projectDefineDataFormat.projectDefineDataType+'"';
        if(rowNum != -1) {
            str += 'row-num="' + rowNum + '" ng-model="' + node.moduleDefineCode + '_' + rowNum + '"';
        } else {
            str += 'ng-model="'+node.moduleDefineCode+'"';
        }

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
        // str += functionShow(node);

        //my-disabled
        // str += functionDisabled(node);


        //正常值校验
        str += functionNumberCheck(node);

        str += '></my-span>';
    }

    return str;
}
//end 添加angular指令 input
