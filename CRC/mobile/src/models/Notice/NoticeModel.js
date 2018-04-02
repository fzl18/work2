import * as NoticeService from '../../services/NoticeService';

export default {
  namespace: 'Notice',
  state: {
    list: [],
    total: null,
    page: null,
    isRead: true,
  },
  reducers: {
    saveMessage(state, { payload: { data: message } }) {
      return {
        ...state, message,
      };
    },
    saveNotice(state, { payload: { data: notice } }) {
      return {
        ...state, notice,
      };
    },
    saveIsRead(state, { payload: { data: isRead } }) {
      return {
        ...state, isRead,
      };
    },
    saveMarkRead(state, { payload: { data: markRead } }) {
      return {
        ...state, markRead,
      };
    },
    saveContent(state, { payload: { data: content } }) {
      return {
        ...state, content,
      };
    },
    saveTabIndex(state, { payload: { data: tabIndex } }) {
      return {
        ...state, tabIndex,
      };
    },
  },
  effects: {
    *queryInformList({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(NoticeService.queryInformList, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveMessage',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *queryNoticeForPub({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(NoticeService.queryNoticeForPub, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveNotice',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *deleteInformByInformId({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 1,
      };
      const response = yield call(NoticeService.deleteInformByInformId, newpayload);
      if (!response) {
        return;
      }
      const List = yield call(NoticeService.queryInformList);
      if (!List) {
        return;
      }
      const { datas = [] } = List;
      yield put({
        type: 'saveMessage',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *modifyIsReadByInformId({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 1,
      };
      const response = yield call(NoticeService.modifyIsReadByInformId, newpayload);
      if (!response) {
        return;
      }
      const List = yield call(NoticeService.queryInformList);
      if (!List) {
        return;
      }
      const { datas = [] } = List;
      yield put({
        type: 'saveMessage',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *noRead({ payload }, { put }) {
      yield put({
        type: 'saveIsRead',
        payload: {
          isRead: false,
        },
      });
    },
    *queryContent({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 1,
      };
      const response = yield call(NoticeService.queryContent, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveContent',
        payload: {
          data: datas,
        },
      });
    },
    *changeTabIndex({ payload }, { put }) {
      yield put({
        type: 'saveTabIndex',
        payload: {
          data: payload,
        },
      });
    },
    // 是否存在未读的新信息
    *queryUnReadInformList({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(NoticeService.queryUnReadInformList, newpayload);
      if (!response) {
        return;
      }
      const { markRead } = response;
      yield put({
        type: 'saveMarkRead',
        payload: {
          data: markRead,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/Notice') {
          dispatch({ type: 'queryInformList', payload: query });
        }
      });
    },
    // setupDepartment({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { limit: 6, noParam: true } }) => {
    //     if (pathname === '/Department') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
  },
};
