import { Toast } from 'antd-mobile';
import * as InvSubjectService from '../../services/InvSubjectService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'InvSubject',
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
      let { searchParmas = {} } = yield select(state => state.InvSubject);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(InvSubjectService.query, newpayload);
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
          // total: parseInt(headers['x-total-count'], 10),
          page: payload.page,
          noMore,
        },
      });
    },
    *nextPage({ payload }, { call, put, select }) {
      let { searchParmas = {} } = yield select(state => state.InvSubject);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(InvSubjectService.query, newpayload);
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
      const response = yield call(InvSubjectService.query, payload);
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
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { } }) => {
    //     if (pathname === '/InvSubject/InvSubjectList') {
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
  },
};
