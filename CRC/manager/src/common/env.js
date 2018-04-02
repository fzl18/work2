const DEV = {
    ADMIN_URL: 'http://192.168.10.166:9099/manager', //135
    SAML_URL: '/saml',
    LOGOUT_URL: './',
};

const TEST = {
    ADMIN_URL: 'http://192.168.10.152:14003/manager',  //179 //152
    SAML_URL: '/saml',
    LOGOUT_URL: './',
};

const LOC = {
    ADMIN_URL: 'http://localhost:9090/manager',
    SAML_URL: '/front',
    LOGOUT_URL: './',
};

const PRODUCTION = {
    ADMIN_URL: 'http://101.37.16.69:13000/portal',
    SAML_URL: '/front',
    LOGOUT_URL: './',
};

const CONFIG = window.configs;
export let ENV = DEV;
// export let ENV = TEST;
//export const ENV = PRODUCTION;
// const ENV = CONFIG;
// const ENV = LOC;


export {ENV as default};
