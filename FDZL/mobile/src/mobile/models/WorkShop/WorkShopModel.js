import { Toast } from 'antd-mobile';
import { delay } from 'redux-saga';
import * as WorkShopService from '../../services/WorkShopService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'WorkShop',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page, noMore } }) {
      return {
        ...state, list, total, page, noMore,
      };
    },
    saveInfo(state, { payload: { data: info = {} } }) {
      return {
        ...state, info,
      };
    },
    addList(state, { payload: { data: list, total, page, noMore } }) {
      const addList = [...state.list, ...list];
      return {
        ...state, list: addList, total, page, noMore,
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
      let { searchParmas = {} } = yield select(state => state.WorkShop);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(WorkShopService.query, newpayload);
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
    *nextPage({ payload }, { call, put, select }) {
      let { searchParmas = {} } = yield select(state => state.WorkShop);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(WorkShopService.query, newpayload);
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = (payload.page || 1) * PAGE_SIZE >= totalCount;
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
      const response = yield call(WorkShopService.query, payload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
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
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/WorkShop/WorkShopList') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = { limit: 3, noParam: true } }) => {
        if (pathname === '/') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
    setupDepartment({ dispatch, history }) {
      return history.listen(({ pathname, query = { limit: 6, noParam: true } }) => {
        if (pathname === '/Department') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
  },
};
