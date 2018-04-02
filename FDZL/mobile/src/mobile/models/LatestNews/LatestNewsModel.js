import { Toast } from 'antd-mobile';
import * as LatestNewsService from '../../services/LatestNewsService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'LatestNews',
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
    setPrevious(state, { payload: { previous } }) {
      return {
        ...state, previous,
      };
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      let { searchParmas = {} } = yield select(state => state.LatestNews);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(LatestNewsService.query, newpayload);
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
      let { searchParmas = {} } = yield select(state => state.LatestNews);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(LatestNewsService.query, newpayload);
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
      const response = yield call(LatestNewsService.query, payload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      const info = datas[0];
      if (response.error == '该条动态已被删除') {
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
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { } }) => {
    //     if (pathname === '/LatestNews/LatestNewsList') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = { limit: 6, noParam: true } }) => {
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
