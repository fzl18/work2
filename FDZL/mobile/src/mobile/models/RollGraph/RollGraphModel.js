import * as RollGraphService from '../../services/RollGraphService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'RollGraph',
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
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(RollGraphService.query, payload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'save',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *nextPage({ payload }, { call, put }) {
      const response = yield call(RollGraphService.query, payload);
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      // if (!data.length) {
      //   Toast.info('沒有更多数据了');// @todo use hasMore
      //   return;
      // }
      const noMore = (payload.page || 1) * PAGE_SIZE >= totalCount;
      yield put({
        type: 'addList',
        payload: {
          data: datas,
          // total: parseInt(headers['x-total-count'], 10),
          page: payload.page,
          noMore,
        },
      });
    },
    *getInfo({ payload }, { put }) {
      yield put({
        type: 'saveInfo',
        payload: {
          data: 'data',
        },
      });
    },
  },
  subscriptions: {
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
  },
};
