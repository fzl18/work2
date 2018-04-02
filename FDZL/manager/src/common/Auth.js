
const authStrategies = {
    role(options, selType) {
        const invId = sessionStorage.getItem("invId");
        const siteId = sessionStorage.getItem("siteId");
        if (selType == 0){
            if (invId > 0 || siteId > 0) {
                return com => '';
            }
        } else if (selType == 1) {
            if (invId == 0 || siteId > 0) {
                return com => '';
            }
        } else {
            if (invId == 0 || siteId == 0) {
                return com => '';
            }
        }
        /*const roles = sessionStorage.getItem('roles') && sessionStorage.getItem('roles').split(',');
        if (roles && roles.length) {
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (options.includes(role)) {
                    return com => com;
                }
            }
        }*/
        if (options == null || options.length == 0 || options.includes(sessionStorage.curRole)){
            return com => com;
        }
        return com => '';
    },
    permission(options) {
        let show = false;
        const permissions = JSON.parse(sessionStorage.getItem('permission'));
        for (let i = 0; i < permissions.length; i++) {
            const permission = permissions[i].name;
            if (options.includes(permission)) {
                show = true;
                break;
            }
        }
        return com => show ? com : '';
    },
};

const Auth = function (key, options, selType) {
    return authStrategies[key](options, selType);
};

export default Auth;

export function auth2 (options) {
    return true;
};


// 验证权限
// auth('permission', ['模板:添加,修改,删除', '权限:/permission/list'])(component)
