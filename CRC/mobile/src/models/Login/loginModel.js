import { Toast } from 'antd-mobile';
import * as LoginService from '../../services/LoginService';


export default {
  namespace: 'Login',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return {
        ...state, list, total, page,
      };
    },
    saveLoginForAssistant(state, { payload: { data: info = {} } }) {
      return {
        ...state, info,
      };
    },

  },
  effects: {
    *Login({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.query, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        Toast.info(response.error, 1);
        return;
      }
      // Toast.info('登录成功', 1);
      // sessionStorage.role = response.role;
      // sessionStorage.acctId = response.acctId;
      // sessionStorage.auditStatus = response.auditStatus;
      // sessionStorage.openId = response.openId;
      // if (response.auditStatus == 'audit_pending') {
      //   location.href = '/PersonalInfo';
      //   return;
      // }
      // if (response.auditStatus == 'audit_passed') {
      //   location.href = '/Order/AddOrder';
      //   return;
      // }
      // if (response.auditStatus == 'audit_failed') {
      //   location.href = '/PersonalInfo';
      //   return;
      // }
      // if (response.auditStatus == 'no_audit') {
      //   // location.href = '/Register/RegisterNext';
      //   location.href = '/Register/Register';
      //   return;
      // }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *LoginForAssistant({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.LoginForAssistant, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      // Toast.info('登录成功', 1); // 登录判断
      // sessionStorage.role = response.role;
      // sessionStorage.acctId = response.acctId;
      // sessionStorage.openId = response.openId;
      // location.href = '/Order/RobNewOrder';
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'saveLoginForAssistant',
        payload: {
          data: response,
        },
      });
    },
  },
  subscriptions: {
  },
};
