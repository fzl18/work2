import { Toast } from 'antd-mobile';
import * as SettingService from '../../services/SettingService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'Setting',
  state: {
    detail: {},
  },
  reducers: {
    save(state, { payload: { data: detail } }) {
      return {
        ...state, ...detail,
      };
    },
    saveInfo(state, { payload: { data: info = {} } }) {
      return {
        ...state, info,
      };
    },
    SetOrderList(state, { payload: { data: OrderList = {} } }) {
      return {
        ...state, OrderList,
      };
    },
    OrderAddress(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
      };
    },
    saveProvince(state, { payload: { data: listProvince = [] || 0 } }) {
      return {
        ...state, listProvince,
      };
    },
    saveCity(state, { payload: { data: listCity = [] || 0 } }) {
      return {
        ...state, listCity,
      };
    },
    saveDistrict(state, { payload: { data: listDistrict = [] || 0 } }) {
      return {
        ...state, listDistrict,
      };
    },
    savePlaceList(state, { payload: { data: placeList = [] || 0 } }) {
      return {
        ...state, placeList,
      };
    },
    CommonAddressList(state, { payload: { data: list, total, page, noMore } }) {
      return {
        ...state, list, total, page, noMore,
      };
    },
    addList(state, { payload: { data: list, total, page, noMore } }) {
      const addList = [...state.list, ...list];
      return {
        ...state, list: addList, total, page, noMore,
      };
    },
    updateCommonPlace(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
      };
    },
    updateUserPassword(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
      };
    },
    AuditStatus(state, { payload: { data: AuditStatus = {} } }) {
      return {
        ...state, AuditStatus,
      };
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const { data } = yield call(SettingService.query, payload);
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
    },
    *OrderList({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(SettingService.SetOrderList, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      // const { datas = [] } = response;
      yield put({
        type: 'SetOrderList',
        payload: {
          data: response,
        },
      });
    },
    *saveOrderAddress({ payload }, { call, put }) {
      const response = yield call(SettingService.OrderAddress, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        Toast.info(response.error);
        return;
      }
      Toast.info(response.success);
      yield put({
        type: 'OrderAddress',
        payload,
      });
    },
    *CommonAddress({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(SettingService.CommonAddressList, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = payload.page * PAGE_SIZE >= totalCount;
      yield put({
        type: 'CommonAddressList',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *nextPage({ payload }, { call, put }) {
      const response = yield call(SettingService.CommonAddressList, payload);
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = payload.page * PAGE_SIZE >= totalCount;
      yield put({
        type: 'addList',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *getInfo({ payload }, { put, call }) {
      Toast.loading('加载中...', 0);
      const response = yield call(SettingService.CommonAddressList2, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      const { datas = [] } = response || {};
      const info = datas[0];
      if (response.count == 0) {
        Toast.info('页面不存在', 1);
      }
      yield put({
        type: 'saveInfo',
        payload: {
          data: info,
        },
      });
    },
    *queryProvince({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(SettingService.queryProvince, newpayload);
      if (!response) {
        return;
      }
      yield put({
        type: 'saveProvince',
        payload: {
          data: response,
          page: payload.page,
        },
      });
    },
    *queryPlaceList({ payload, callback }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 9999,
      };
      const response = yield call(SettingService.queryPlaceList, newpayload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'savePlaceList',
        payload: {
          data: response,
        },
      });
    },
    *queryCity({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(SettingService.queryCity, newpayload);
      if (!response) {
        return;
      }
      yield put({
        type: 'saveCity',
        payload: {
          data: response,
          page: payload.page,
        },
      });
    },
    *queryDistrict({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(SettingService.queryDistrict, newpayload);
      if (!response) {
        return;
      }
      yield put({
        type: 'saveDistrict',
        payload: {
          data: response,
          page: payload.page,
        },
      });
    },
    *deleteAddressById({ payload }, { call, put }) {
      const response = yield call(SettingService.querydeleteAddressById, payload);
      if (!response) {
        return;
      }
      Toast.info(response.datas);
      yield put({
        type: 'CommonAddress',
        payload: {},
      });
    },
    *modifyCommonPlace({ payload, callback }, { call, put }) {
      const response = yield call(SettingService.CommonPlace, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        Toast.info(response.error);
        return;
      }
      // if (response.success) {
      //   Toast.info(response.success);
      //   location.href = '/SetCommonAddress';
      // }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'updateCommonPlace',
        payload,
      });
    },
    *addCommonPlace({ payload, callback }, { call, put }) {
      const response = yield call(SettingService.addCommonPlace, payload);
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
        type: 'updateCommonPlace',
        payload,
      });
    },
    *modifyUserPassword({ payload, callback }, { call, put }) {
      const response = yield call(SettingService.modifyUserPassword, payload);
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
        type: 'updateUserPassword',
        payload,
      });
    },
    *unbindUser({ payload, callback }, { call, put }) {
      const response = yield call(SettingService.unbindUser, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      if (callback) {
        callback();
      }
      // Toast.info('退出成功', 1);
      // setTimeout(() => {
      //   location.href = '/Login';
      // }, 1500);
      yield put({
        type: 'save',
        payload,
      });
    },
    *NowAuditStatus({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(SettingService.NowAuditStatus, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      sessionStorage.auditStatus = response.success.auditStatus;
      if ((response.success && response.success.auditStatus == 'audit_pending') || (response.success && response.success.auditStatus == 'audit_failed')) {
        if (callback) {
          callback();
        }
      }
      yield put({
        type: 'AuditStatus',
        payload: {
          data: response,
        },
      });
    },

  },
  subscriptions: {
    // SetOrder({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { } }) => {
    //     if (pathname === '/SetOrder') {
    //       dispatch({ type: 'OrderList', payload: query });
    //     }
    //   });
    // },
    SetCommmonAddress({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/SetCommonAddress') {
          dispatch({ type: 'CommonAddress', payload: query });
        }
      });
    },
  },
};
