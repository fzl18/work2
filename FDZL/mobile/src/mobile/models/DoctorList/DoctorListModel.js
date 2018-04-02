import { delay } from 'redux-saga';
import { Toast } from 'antd-mobile';
import * as DoctorListService from '../../services/DoctorListService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'DoctorList',
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
    saveInfo(state, { payload: { data: info = {} } }) {
      return {
        ...state, info,
      };
    },
    controlModal(state, { payload: { modal1 } }) {
      return {
        ...state, modal1,
      };
    },
    addList(state, { payload: { data: list, total, page } }) {
      const addList = [...state.list, ...list];
      return {
        ...state, list: addList, total, page,
      };
    },
    saveSearch(state, { payload: { params } }) {
      return {
        ...state, searchParmas: { ...params },
      };
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      let { searchParmas = {} } = yield select(state => state.DoctorList);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      Toast.loading('加载中...', 0);
      const response = yield call(DoctorListService.query, newpayload);
      Toast.hide();
      yield call(delay, 100, true);
      if (!payload.noParam) {
        yield put({
          type: 'saveSearch',
          payload: {
            params: newpayload,
          },
        });
      }
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = (payload.page || 1) * PAGE_SIZE >= totalCount;
      yield put({
        type: 'save',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *getInfo({ payload }, { put, call }) {
      Toast.loading('加载中...', 0);
      const response = yield call(DoctorListService.query, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      const { datas = [] } = response || {};
      const info = datas[0];
      if (response.count == 0) {
        Toast.info('页面不存在', 1);
        setTimeout(() => {
          location.href = '/';
        }, 1500);
      }
      yield put({
        type: 'saveInfo',
        payload: {
          data: info,
        },
      });
    },
    *clearSearch({ payload }, { put }) {
      yield put({
        type: 'saveSearch',
        payload: {
          params: {},
        },
      });
    },
    *sendApply({ payload }, { put, call }) {
      // const { data, headers } = yield call(DoctorListService.query, payload);
      const response = yield call(DoctorListService.sendApply, payload);
      if (response.success) {
        // sessionStorage.acctId = response.data.ydataAccountId;
        // sessionStorage.applicantAccountStatus = response.data.applicantAccountStatus;
        // sessionStorage.role = response.data.role;
        yield put({
          type: 'controlModal',
          payload: {
            modal1: true,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if ((pathname === '/Chat/DoctorList') || (pathname === '/Chat/DoctorListForVisitor')) {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = { limit: 12, noParam: true } }) => {
        if (pathname === '/Department') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
  },
};
