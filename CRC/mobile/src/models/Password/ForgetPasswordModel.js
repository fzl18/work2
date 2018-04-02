import { Toast } from 'antd-mobile';
import * as ForgetPasswordService from '../../services/ForgetPasswordService';


export default {
  namespace: 'ForgetPassword',
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

  },
  effects: {
    *verifyCode({ payload, callback }, { call, put }) {
      const response = yield call(ForgetPasswordService.verifyCode, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        Toast.info(response.error);
        return;
      }
      if (callback) {
        callback();
      }
      Toast.info('发送验证码成功', 1);


      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *ForgetPassword({ payload, callback }, { call, put }) {
      const response = yield call(ForgetPasswordService.ForgetPassword, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      //  else {
      //   sessionStorage.userMobile = response.userMobile;
      //   location.href = '/ForgetPasswordNext';
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
    *ForgetPasswordNext({ payload, callback }, { call, put }) {
      const response = yield call(ForgetPasswordService.ForgetPasswordNext, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      //  else {
      //   Toast.info(response.success);
      //   location.href = '/Login';
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


  },
  subscriptions: {

  },
};
