import { Toast } from 'antd-mobile';
import * as PersonalInfoService from '../../services/PersonalInfoService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'PersonalInfo',
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
    savePersonalInfo(state, { payload: { data: PersonalInfoList = {} } }) {
      return {
        ...state, PersonalInfoList,
      };
    },
    saveBaisInfo(state, { payload: { data: BaisInfo = {} } }) {
      return {
        ...state, BaisInfo,
      };
    },
    saveAssistantBaisInfo(state, { payload: { data: AssistantBaisInfo = {} } }) {
      return {
        ...state, AssistantBaisInfo,
      };
    },
    updateUserMobile(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
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
    AuditFailedToPass(state, { payload: { data: AuditFailedToPassInfo = {} } }) {
      return {
        ...state, AuditFailedToPassInfo,
      };
    },
    AuditInfo(state, { payload: { data: AuditInfo = {} } }) {
      return {
        ...state, AuditInfo,
      };
    },
    showPersonalInfo(state, { payload: { data: showPersonalInfoDetail = {} } }) {
      return {
        ...state, showPersonalInfoDetail,
      };
    },
    SaveFailReason(state, { payload: { data: FailReason = {} } }) {
      return {
        ...state, FailReason,
      };
    },
    saveBalanceParameter(state, { payload: { data: BalanceParameter = {} } }) {
      return {
        ...state, BalanceParameter,
      };
    },
    WithdrawalsDetailList(state,
      { payload: { data: WithdrawalsDetailList, total, page, noMore } }) {
      return {
        ...state, WithdrawalsDetailList, total, page, noMore,
      };
    },
    RechargeDetailList(state, { payload: { data: RechargeDetaillist, total, page, noMore } }) {
      return {
        ...state, RechargeDetaillist, total, page, noMore,
      };
    },
    SaveAvailableBalance(state, { payload: { data: AvailableBalance = {} } }) {
      return {
        ...state, AvailableBalance,
      };
    },
    addRechargeDetailList(state, { payload: { data: RechargeDetaillist, total, page, noMore } }) {
      const addList = [...state.RechargeDetaillist, ...RechargeDetaillist];
      return {
        ...state, RechargeDetaillist: addList, total, page, noMore,
      };
    },
    updateAssistantInfo(state, { payload: { data: AssistantBaisInfo = {} } }) {
      return {
        ...state, AssistantBaisInfo,
      };
    },
  },
  effects: {
    *verifyCode({ payload, callback }, { call, put }) {
      const response = yield call(PersonalInfoService.verifyCode, payload);
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
    *PersonalInfo({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.queryPersonalInfo, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      // const { datas = [] } = response;
      yield put({
        type: 'savePersonalInfo',
        payload: {
          data: response,
        },
      });
    },
    *BaisInfo({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.BaisInfo, payload);
      Toast.hide();
      if (response.error) {
        Toast.info(response.error);
      }
      yield put({
        type: 'saveBaisInfo',
        payload: {
          data: response,
        },
      });
    },
    *modifyUserMobile({ payload, callback }, { call, put }) {
      const response = yield call(PersonalInfoService.modifyUserMobile, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      // if (response.success) {
      //   Toast.info(response.success);
      //   // setTimeout(() => {
      //   location.href = '/Login';
      //   // }, 1500);
      // }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'updateUserMobile',
        payload,
      });
    },
    *queryhospitalType({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(PersonalInfoService.queryhospitalType, newpayload);
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
      const response = yield call(PersonalInfoService.queryDepHospitalEnterpriseType, newpayload);
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
    *AuditFailedToPass({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.AuditFailedToPass, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      yield put({
        type: 'AuditFailed',
        payload: {
          data: response,
        },
      });
    },
    *AuditInfomation({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.AuditInfomation, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'AuditInfo',
        payload: {
          data: response,
        },
      });
    },
    *reviseAuditInfomation({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.reviseAuditInfomation, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      sessionStorage.auditStatus = response.auditStatus;
      if (callback) {
        callback();
      }
      yield put({
        type: 'AuditInfo',
        payload: {
          data: response,
        },
      });
    },
    *queryIntegralDetail({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(PersonalInfoService.queryPersonalInfo, newpayload);
      if (!response) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'showPersonalInfo',
        payload: {
          data,
          page: payload.page,
        },
      });
    },
    *AuditFailReason({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.AuditFailReason, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      yield put({
        type: 'SaveFailReason',
        payload: {
          data: response,
        },
      });
    },
    *queryBalanceParameter({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
        amountParameterType: 'PAY',
      };
      const response = yield call(PersonalInfoService.queryAmountParameter, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveBalanceParameter',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *WithdrawalsDetail({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.WithdrawalsDetailList, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = payload.page * PAGE_SIZE >= totalCount;
      yield put({
        type: 'WithdrawalsDetailList',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *RechargeDetail({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.RechargeDetailList, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = payload.page * PAGE_SIZE >= totalCount;
      yield put({
        type: 'RechargeDetailList',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *AvailableBalanceDetail({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.AvailableBalanceDetail, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      yield put({
        type: 'SaveAvailableBalance',
        payload: {
          data: response,
        },
      });
    },
    *RechargeDetailnextPage({ payload }, { call, put }) {
      const response = yield call(PersonalInfoService.RechargeDetailList, payload);
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = payload.page * PAGE_SIZE >= totalCount;
      yield put({
        type: 'addRechargeDetailList',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *AssistantBaisInfo({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(PersonalInfoService.AssistantBaisInfo, payload);
      Toast.hide();
      if (response.error) {
        Toast.info(response.error);
      }
      const { datas = [] } = response;
      const AssistantBaisInfo = datas[0];
      yield put({
        type: 'saveAssistantBaisInfo',
        payload: {
          data: AssistantBaisInfo,
        },
      });
    },
    *modifyAssistantInfo({ payload, callback }, { call, put }) {
      const response = yield call(PersonalInfoService.AssistantInfo, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        Toast.info(response.error);
        return;
      }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'updateAssistantInfo',
        payload,
      });
    },
  },
  subscriptions: {
    // PersonalInfo({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/PersonalInfo') {
    //       dispatch({ type: 'PersonalInfo', payload: query });
    //     }
    //   });
    // },
    EssentialiInformation({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/EssentialiInformation') {
          dispatch({ type: 'BaisInfo', payload: query });
        }
      });
    },
    hospitalType({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/AuditInfomation') {
          dispatch({ type: 'queryhospitalType', payload: query });
        }
      });
    },
    AuditFailedToPass({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/AuditFailedToPass') {
          dispatch({ type: 'AuditFailReason', payload: query });
        }
      });
    },
    RechargeChoose({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/WePay/Balance/Recharge') {
          dispatch({ type: 'queryBalanceParameter', payload: query });
        }
      });
    },
    WithdrawalsList({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/WithdrawalsDetail') {
          dispatch({ type: 'WithdrawalsDetail', payload: query });
        }
      });
    },
    RechargeList({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/RechargeDetail') {
          dispatch({ type: 'RechargeDetail', payload: query });
        }
      });
    },
    AvailableBalance({ dispatch, history }) {
      const acctId = sessionStorage.acctId;
      return history.listen(({ pathname, query = { accountId: acctId } }) => {
        if ((pathname === '/WePay/Balance/Recharge') || (pathname === '/MyAssets')) {
          dispatch({ type: 'AvailableBalanceDetail', payload: query });
        }
      });
    },
    EssentialiInformationForAssistant({ dispatch, history }) {
      const userId = sessionStorage.acctId;
      const isPortal = 1;
      return history.listen(({ pathname, query = { userId, isPortal } }) => {
        if ((pathname === '/EssentialiInformation') || (pathname === '/Subject')) {
          dispatch({ type: 'AssistantBaisInfo', payload: query });
        }
      });
    },

  },
};

