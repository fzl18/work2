import { Toast } from 'antd-mobile';
import * as LatestNewsService from '../../services/LatestNewsService';

export default {
  namespace: 'MyChatList',
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
    saveInfo(state, { payload: { data } }) {
      return {
        ...state, data,
      };
    },
    addList(state, { payload: { data: list, total, page } }) {
      const addList = [...state.list, ...list];
      return {
        ...state, list: addList, total, page,
      };
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(LatestNewsService.query, payload);
      if (!response) {
        return;
      }
      const { data = [] } = response;
      yield put({
        type: 'save',
        payload: {
          data,
          // total: parseInt(headers['x-total-count'], 10),
          page: payload.page,
        },
      });
    },
    *nextPage({ payload }, { call, put }) {
      const response = yield call(LatestNewsService.query, payload);
      if (!response) {
        return;
      }
      const { data = [] } = response;
      if (!data.length) {
        Toast.info('沒有更多数据了');// @todo use hasMore
        return;
      }
      yield put({
        type: 'addList',
        payload: {
          data,
          // total: parseInt(headers['x-total-count'], 10),
          page: payload.page,
          noMore: !data.length,
        },
      });
    },
    *getInfo({ payload }, { put }) {
      // const { data, headers } = yield call(LatestNewsService.query, payload);
      yield put({
        type: 'saveInfo',
        payload: {
          data: 'data',
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/Chat/MyChat') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
  },
};
