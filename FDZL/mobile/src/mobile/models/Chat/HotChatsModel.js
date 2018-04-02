import * as HotChatsService from '../../services/HotChatsService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'HotChatsList',
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
    saveInfo(state, { payload: { data } }) {
      return {
        ...state, data,
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
      let { searchParmas = {} } = yield select(state => state.HotChatsList);
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };
      const response = yield call(HotChatsService.query, newpayload);
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
    *nextPage({ payload }, { call, put }) {
      const response = yield call(HotChatsService.query, payload);
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
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/Chat/HotChats') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
  },
};
