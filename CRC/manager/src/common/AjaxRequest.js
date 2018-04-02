/**
 * Created by casteloyee on 2017/7/27.
 */
import $ from './XDomainJquery';
import React from 'react';
import {Modal, Button} from 'antd';
import StringUtil from './StringUtil';
import ENV from './env.js';

export default class AjaxRequest {

    static sendRequest(options) {
        const datas = {};
        if (sessionStorage.curEnterpriseId && sessionStorage.curEnterpriseId > 0){
            datas.curEnterpriseId = sessionStorage.curEnterpriseId;
        }
        if (sessionStorage.userId && sessionStorage.userId > 0){
            datas.curUserId = sessionStorage.userId;
        }
        if (sessionStorage.invId && sessionStorage.invId > 0){
            datas.curInvId = sessionStorage.invId;
        }
        if (sessionStorage.siteId && sessionStorage.siteId > 0){
            datas.curSiteId = sessionStorage.siteId;
        }
        if (!StringUtil.isNull(sessionStorage.curRole)){
            datas.curRoleCode = sessionStorage.curRole;
        }
        if (!StringUtil.isNull(sessionStorage.positionRole)){
            datas.curPositionRoleCode = sessionStorage.positionRole;
        }
        if (!StringUtil.isNull(sessionStorage.curEmployeeCode)){
            datas.curEmployeeCode = sessionStorage.curEmployeeCode;
        }
        let method = options.method;
        if (window.XDomainRequest) {
            method = "get";
          }

        const showConfirm = () => {
            Modal.warning({
                title: '登录超时',
                content: '请重新登录',
                onOk() {
                    sessionStorage.curRole = '';
                    sessionStorage.positionRole = '';
                    sessionStorage.positionName = '';
                    sessionStorage.userId = '';
                    sessionStorage.userName = '';
                    sessionStorage.curEnterpriseId = '';
                    sessionStorage.curEmployeeCode = '';
                    sessionStorage.invName = '';
                    sessionStorage.invId = 0;
                    sessionStorage.siteId = 0;
                    sessionStorage.investigationSiteName = '';
                    sessionStorage.investigationSiteCode = '';
                    location.href = ENV.LOGOUT_URL
                  },
            });
        }
        
        const encodedUrl = encodeURI(options.url).replace(/#/g, '%23');

        $.ajax({
            method: method,
            url: encodedUrl,          
            data: {
                ...options.data,
                ...datas,
                CKS:"NO"
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader(header, token);
            },
            type: options.type,
            async: options.async == null || options.async == undifined ? true : options.async,
        }).done(result => {
            if (result.error) {
                if(result.error == "NOACCESS"){
                    showConfirm();
                    $.ajaxStop();
                    return;
                }
                if((options.showError && option.showError == 1) || !options.showError){
                    //message.error(result.error);
                    Modal.error({title: result.error});
                }
                if (options.errorResult){
                    options.errorResult(result.error);
                }
            } else if (result.data && result.data.error) {
                if((options.showError && option.showError == 1) || !options.showError){
                    Modal.error({title: result.data.error});
                }
                if (options.errorResult) {
                    options.errorResult(result.data.error);
                }
            } else {
                options.doneResult(result);
            }
        }).fail(result => {
                Modal.error({title: "获取服务失败，请刷新页面后重试"});
                if(options.failResult){
                    options.failResult(result);
                }
            }
        );
    }
}
