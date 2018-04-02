import { Toast } from 'antd-mobile';
import * as ChatService from '../../services/ChatService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'Chat',
  state: {
    list: [],
    total: null,
    page: null,
    hasNewMsg: false,
  },
  reducers: {
    save(state, { payload: { data, total, page, searchType, noMore } }) {
      const updateData = {
        list: data,
      };
      const newData = {
        ...state[searchType],
        ...updateData,
        total,
        page,
        noMore,
      };
      return {
        ...state, [searchType]: { ...newData },
      };
    },
    saveCategory(state, { payload: { data: listCategory } }) {
      return {
        ...state, listCategory,
      };
    },
    saveInfo(state, { payload: { data: info = {} } }) {
      return {
        ...state, info,
      };
    },
    addList(state, { payload: { data: list, searchType, noMore } }) {
      const addList = [...state[searchType].list, ...list];
      const updateData = {
        list: addList,
        noMore,
      };
      const newData = {
        ...state[searchType],
        ...updateData,
      };
      return {
        ...state, [searchType]: { ...newData },
      };
    },
    saveSearch(state, { payload: { params } }) {
      const searchType = params.searchType;
      const newSearch = {
        ...state.searchParmas,
        ...params,
      };
      const updateData = {
        searchParmas: { ...newSearch },
      };
      const newData = {
        ...state[searchType],
        ...updateData,
      };
      return {
        ...state, [searchType]: { ...newData },
      };
    },
    tabIndex(state, { payload: { listIndex } }) {
      return {
        ...state, listIndex,
      };
    },
    saveChatCfg(state, { payload: { data: data = {} } }) {
      const { info = {}, infoDoctor = {}, infoPatient = {} } = data;
      return {
        ...state, info, infoDoctor, infoPatient,
      };
    },
    saveCommonCfg(state, { payload: { data: commonCfg = {} } }) {
      return {
        ...state, commonCfg,
      };
    },
    updateList(state, { payload: { list: list = [], searchType } }) {
      const typeState = state[searchType];
      const newTypeState = {
        ...typeState,
        list,
      };
      return {
        ...state, [searchType]: { ...newTypeState },
      };
    },
    createDefaultSearch(state, { payload: { keywords } }) {
      const category = ['ALL', 'COMPLETED', 'REPLIED', 'REPLYING'];
      const newState = state;
      category.map((key) => {
        if (newState[key]) {
          newState[key].searchParmas.keywords = keywords;
        } else {
          newState[key] = {};
          newState[key].searchParmas = {
            keywords,
          };
        }
      });
      return {
        ...state, ...newState,
      };
    },
    saveHasNewMsg(state, { payload: { hasNewMsg } }) {
      return {
        ...state, hasNewMsg,
      };
    },
    saveHotChat(state, { payload: { data: hotChat = {} } }) {
      return {
        ...state, hotChat,
      };
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const searchType = payload.searchType;
      const data = yield select(state => state.Chat);
      let { searchParmas = {} } = data[searchType] || {};// 根据id在state中取出相应的查询参数
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };// 查询时，应取出查询参数(refresh，paging)

      if (searchType == 'ALL') {
        newpayload.searchType = '';
      }
      const response = yield call(ChatService.query, newpayload);
      if (!payload.noParam) {
        const newParams = { ...searchParmas, ...payload };
        if (newParams.searchType == '' || !newParams.searchType) {
          newParams.searchType = 'ALL';
        }
        delete newParams.limit;// limit不存在查询参数中，需要删除，以免共用模块limit导致的错误查询条件
        yield put({
          type: 'saveSearch',
          payload: {
            params: newParams,
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
          searchType,
          noMore,
        },
      });
    },
    // *queryCategory({ payload }, { call, put }) {
    //   const newpayload = {
    //     ...payload,
    //     limit: 999,
    //   };
    //   const response = yield call(ChatService.queryCategory, newpayload);
    //   if (!response) {
    //     return;
    //   }
    //   const { datas = [] } = response;
    //   yield put({
    //     type: 'saveCategory',
    //     payload: {
    //       data: datas,
    //       page: payload.page,
    //     },
    //   });
    // },
    *nextPage({ payload }, { call, put }) {
      const newPayload = { ...payload };
      const searchType = payload.searchType;
      if (payload.searchType == 'ALL') {
        newPayload.searchType = '';
      }
      const response = yield call(ChatService.query, newPayload);
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
          searchType,
        },
      });
    },
    *getInfo({ payload }, { put, call }) {
      // const { data, headers } = yield call(ChatService.query, payload);
      const response = yield call(ChatService.query, payload);
      if (!response) {
        return;
      }
      const { conversationList = [] } = response;
      const info = conversationList[0];
      yield put({
        type: 'saveInfo',
        payload: {
          data: info,
        },
      });
    },
    *generateChat({ payload }, { put, call }) {
      const response = yield call(ChatService.generateChat, payload);
      const { conversation = {}, doctor = {}, patient = {} } = response || {};
      yield put({
        type: 'saveChatCfg',
        payload: {
          data: {
            info: conversation,
            infoDoctor: doctor,
            infoPatient: patient,
          },
        },
      });
    },
    *generateInfo({ payload }, { put, call }) {
      const response = yield call(ChatService.generateInfo, payload);
      const { room = {} } = response || {};
      yield put({
        type: 'saveCommonCfg',
        payload: {
          data: room,
        },
      });
    },
    *deleteConversation({ payload }, { put, call, select }) {
      const { conversationId, searchType } = payload;
      const response = yield call(ChatService.deleteConversation, payload);
      const { success } = response || {};
      if (success) {
        Toast.info(success, 1);
      }
      const state = yield select(allState => allState.Chat);

      if (state.ALL) {
        const AllList = (state.ALL.list || []).filter((val) => {
          return val.conversationId != conversationId;
        });
        yield put({
          type: 'updateList',
          payload: {
            list: AllList,
            searchType: 'ALL',
          },
        });
      }

      if (state[searchType]) {
        const typeList = (state[searchType].list || []).filter((val) => {
          return val.conversationId != conversationId;
        });
        yield put({
          type: 'updateList',
          payload: {
            list: typeList,
            searchType,
          },
        });
      }

      // yield put({
      //   type: 'saveChatCfg',
      //   payload: {
      //     data: conversation,
      //   },
      // });
    },
    *getHotChat({ payload, callback }, { put, call }) {
      const response = yield call(ChatService.getHotChat, payload);
      yield put({
        type: 'saveHotChat',
        payload: {
          data: response || {},
        },
        callback,
      });
    },
  },
  subscriptions: {
    // setupIndex({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { limit: 3, noParam: true } }) => {
    //     if (pathname === '/Department') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
    // setupDepartment({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/Chat/MyChat') {
    //       dispatch({ type: 'queryCategory', payload: query });
    //     }
    //   });
    // },
  },
};
