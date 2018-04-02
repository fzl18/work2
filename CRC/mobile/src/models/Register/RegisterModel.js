import { Toast } from 'antd-mobile';
import * as RegisterService from '../../services/RegisterService';


export default {
  namespace: 'Register',
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
    savehospitalType(state, { payload: { data: listhospitalType = [] || 0 } }) {
      return {
        ...state, listhospitalType,
      };
    },
    savequeryDepHospitalEnterpriseType(state, { payload:
      { data: DepHospitalEnterpriseType = [] || 0 } }) {
      return {
        ...state, DepHospitalEnterpriseType,
      };
    },
    AuditStatus(state, { payload: { data: AuditStatus = {} } }) {
      return {
        ...state, AuditStatus,
      };
    },
    savehospitalName(state, { payload: { data: hospitalName } }) {
      return {
        ...state, hospitalName,
      };
    },
    savehospitalDepName(state, { payload: { data: hospitalDepName } }) {
      return {
        ...state, hospitalDepName,
      };
    },
    keepOrderFormFields(state, { payload: { data: changedFields } }) {
      const OrderFormFieldsOld = state.OrderFormFields || {};
      const OrderFormFields = { ...OrderFormFieldsOld, ...changedFields };
      return {
        ...state, OrderFormFields,
      };
    },
  },
  effects: {
    *register({ payload, callback }, { call, put }) {
      const response = yield call(RegisterService.query, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        // Toast.info('注册失败', 1);
        return;
      } else {
        // Toast.info(response.success);
        sessionStorage.auditStatus = response.auditStatus;
        sessionStorage.acctId = response.acctId;
        sessionStorage.role = response.role;
      }
      if (callback) {
        callback();
      }
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *nonDoctorRegister({ payload, callback }, { call, put }) {
      const response = yield call(RegisterService.querynonDoctorRegister, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        // Toast.info('注册失败', 1);
        return;
      } else {
        // Toast.info(response.success);
        sessionStorage.auditStatus = response.auditStatus;
        sessionStorage.acctId = response.acctId;
        sessionStorage.role = response.role;
      }
      if (callback) {
        callback();
      }
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *checkDoctorRegist({ payload, callback }, { call, put }) {
      const response = yield call(RegisterService.queryNext, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        // Toast.info('注册失败', 1);
        return;
      }
      //  else {
      //   location.href = '/Register/RegisterNext';
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
    *verifyCode({ payload, callback }, { call, put }) {
      const response = yield call(RegisterService.verifyCode, payload);
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
    *queryhospitalType({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(RegisterService.queryhospitalType, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'savehospitalType',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *queryDepHospitalEnterpriseType({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(RegisterService.queryDepHospitalEnterpriseType, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'savequeryDepHospitalEnterpriseType',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *NowAuditStatus({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(RegisterService.NowAuditStatus, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      if (response.success == null) {
        return;
      }
      sessionStorage.auditStatus = response.success && response.success.auditStatus;
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'AuditStatus',
        payload: {
          data: response,
        },
      });
    },
    *uploadImg({ payload, callback }, { call }) {
      const response = yield call(RegisterService.uploadImg, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },

    *queryhospitalName({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 100,
      };
      const response = yield call(RegisterService.queryhospitalName, newpayload);
      if (!response) {
        return;
      }
      // const projects = response.projects || [];
      const { datas = [] } = response;
      yield put({
        type: 'savehospitalName',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *queryhospitalDepName({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 100,
      };
      const response = yield call(RegisterService.queryhospitalDepName, newpayload);
      if (!response) {
        return;
      }
      // const projects = response.projects || [];
      const { datas = [] } = response;
      yield put({
        type: 'savehospitalDepName',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
  },
  subscriptions: {
    // hospitalType({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/Register/RegisterNext') {
    //       dispatch({ type: 'queryhospitalType', payload: query });
    //     }
    //   });
    // },
    // selectNowAuditStatus({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/Register/RegisterNext') {
    //       dispatch({ type: 'NowAuditStatus', payload: query });
    //     }
    //   });
    // },
  },
};
