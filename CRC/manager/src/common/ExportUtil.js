/**
 * Created by casteloyee on 2017/7/21.
 */
import StringUtil from './StringUtil';

export default class ExportUtil {

    static export(options, pagination, url) {
        
        let locationRef = url + '?offset=1';
        if(pagination){
            locationRef += '&limit=' + pagination.total;
        }
         if (sessionStorage.curEnterpriseId && sessionStorage.curEnterpriseId > 0){
            locationRef += '&curEnterpriseId=' + sessionStorage.curEnterpriseId;
        }
        if (sessionStorage.userId && sessionStorage.userId > 0){
            locationRef += '&curUserId=' + sessionStorage.userId;
        }
        if (sessionStorage.invId && sessionStorage.invId > 0){
            locationRef += '&curInvId=' + sessionStorage.invId;
        }
        if (sessionStorage.siteId && sessionStorage.siteId > 0){
            locationRef += '&curSiteId=' + sessionStorage.siteId;
        }
        if (!StringUtil.isNull(sessionStorage.curRole)){
            locationRef += '&curRoleCode=' + sessionStorage.curRole;
        }
        if (!StringUtil.isNull(sessionStorage.curEmployeeCode)){
            locationRef += '&curEmployeeCode=' + sessionStorage.curEmployeeCode;
        }
        if (options){
            for(var key in options){
                if(options[key] != null && options[key] != undefined){
                    locationRef += '&' + key + "=" + encodeURI(options[key]);
                }
            }
        }
        window.location.href = locationRef;
    }


}
