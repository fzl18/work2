import { Toast } from 'antd-mobile';
import * as MyPanelService from '../../services/MyPanelService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'MyPanel',
  state: {
    detail: {},
  },
  reducers: {
    save(state, { payload: { data: detail } }) {
      return {
        ...state, ...detail,
      };
    },
    // getEmpower(state, { payload: { data: detail } }) {
    //   return {
    //     ...state, ...detail,
    //   };
    // },
    // authNoticeList(state, { payload: { data: list, total, page } }) {
    //   return {
    //     ...state, list, total, page,
    //   };
    // },
    authNoticeList(state, { payload: { data: list, total, page, noMore } }) {
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
    updatePwd(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
      };
    },
    // saveInfo(state, { payload: { data } }) {
    //   return {
    //     ...state, data,
    //   };
    // },
    empowerApply(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
      };
    },
    serviceInfo(state, { payload: { data: detail = {} } }) {
      return {
        ...state, detail,
      };
    },
    // applyOrRejectSave(state, { payload: { data: list, total, page } }) {
    //   return {
    //     ...state, list, total, page,
    //   };
    // }, //
    relieveAuthSave(state, { payload: { data: list, total, page } }) {
      return {
        ...state, list, total, page,
      };
    },


    deleteNoticeByIdSave(state, { payload: { data: list, total, page } }) {
      return {
        ...state, list, total, page,
      };
    },
    deleteAllNoticeSave(state, { payload: { data: list, total, page } }) {
      return {
        ...state, list, total, page,
      };
    },
    queryAccountSimple(state, { payload: { data: PersonCentral = {} } }) {
      return {
        ...state, PersonCentral,
      };
    },
    queryLength(state, { payload: { data: length } }) {
      return {
        ...state, length,
      };
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const { data } = yield call(MyPanelService.query, payload);
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
    },
    *notice({ payload }, { call, put }) {
      const response = yield call(MyPanelService.authNoticeList, payload);
      if (!response) {
        return;
      }
      const { datas = [], totalCount } = response;
      const noMore = payload.page * PAGE_SIZE >= totalCount;
      yield put({
        type: 'authNoticeList',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
        },
      });
    },
    *nextPage({ payload }, { call, put }) {
      const response = yield call(MyPanelService.authNoticeList, payload);
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
    *pwd({ payload }, { call, put }) {
      const response = yield call(MyPanelService.pwd, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      if (response.success == true) {
        Toast.info('修改密码成功', 1);
        setTimeout(() => {
          location.href = '/MyPanel/PersonCentral';
        }, 1500);
      }
      yield put({
        type: 'updatePwd',
        payload,
      });
    },
    *empowerApplyDetail({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(MyPanelService.empowerApply, payload);
      Toast.hide();
      const { assistantServiceAuthNotice = {} } = response || {};
      yield put({
        type: 'empowerApply',
        payload: {
          data: assistantServiceAuthNotice,
        },
      });
    },
    // 授权服务
    *serviceInfoDetail({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(MyPanelService.serviceInfo, payload);
      Toast.hide();
      const { assistantServiceAuth = {} } = response || {};
      yield put({
        type: 'serviceInfo',
        payload: {
          data: assistantServiceAuth,
        },
      });
    },
    *applyOrReject({ payload, callback }, { call, put }) {
      const response = yield call(MyPanelService.queryApplyOrReject, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        return;
      }
      if (callback) {
        callback();
      }
      Toast.info(response.success);

        // setTimeout(() => {
        //   location.href = '/MyPanel/PersonCentral/Notice';
        // }, 1500);
      yield put({
        type: 'empowerApplyDetail',
        // type: 'applyOrRejectSave',
        payload,
      });
    },
    *relieveAuth({ payload }, { call, put }) {
      const response = yield call(MyPanelService.queryRelieveAuth, payload);
      if (!response) {
        return;
      }

      Toast.info(response.success);
        // setTimeout(() => {
        //   location.href = '/MyPanel/PersonCentral/Notice';
        // }, 1500);
      yield put({
        type: 'serviceInfoDetail',
        payload,
      });
    },


    *deleteNoticeById({ payload }, { call, put }) {
      const response = yield call(MyPanelService.querydeleteNoticeById, payload);
      if (!response) {
        return;
      }
      Toast.info(response.datas);
      yield put({
        type: 'notice',
        payload: {},
      });
    },
    *deleteAllNotice({ payload }, { call, put }) {
      const response = yield call(MyPanelService.deleteAllNotice, payload);
      if (!response) {
        return;
      }
      Toast.info(response.datas);
      yield put({
        type: 'notice',
        payload: {},
      });
    },
    *queryAccountSimpleInfoById({ payload }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(MyPanelService.queryAccountSimpleInfoById, payload);
      Toast.hide();
      if (response.error) {
        Toast.info(response.error);
      }
      yield put({
        type: 'queryAccountSimple',
        payload: {
          data: response,
        },
      });
    },

    // *getInfo({ payload }, { put }) {
    //   // const { data, headers } = yield call(MyPanelService.query, payload);
    //   yield put({
    //     type: 'saveInfo',
    //     payload: {
    //       data: 'data',

    //     },
    //   });
    // },
    *noticeLength({ payload }, { call, put }) {
      const response = yield call(MyPanelService.authNoticeList, payload);
      let length = 0;
      {
        response.datas.map((value) => {
          if (value.status == 'UNREAD') {
            length++;
          }
        });
      }
      yield put({
        type: 'queryLength',
        payload: {
          data: length,
        },
      });
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/MyPanel/PersonCentral/Account') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
    queryNotice({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/MyPanel/PersonCentral/Notice') {
          dispatch({ type: 'notice', payload: query });
        }
      });
    },
    queryNoticeLength({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/MyPanel/PersonCentral') {
          dispatch({ type: 'noticeLength', payload: query });
        }
      });
    },
    // queryPwd({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/MyPanel/PersonCentral/Pwd') {
    //       dispatch({ type: 'pwd', payload: query });
    //     }
    //   });
    // },
    queryEmpowerApply({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/MyPanel/EmpowerApply') {
          dispatch({ type: 'empowerApplyDetail', payload: query });
        }
      });
    },
    // queryAuthInfo({ dispatch, history }) {
    //   return history.listen(({ pathname, query = {} }) => {
    //     if (pathname === '/MyPanel/PersonCentral/ServiceInfo') {
    //       dispatch({ type: 'serviceInfoDetail', payload: query });
    //     }
    //   });
    // },
    queryAccountSimpleInfo({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if ((pathname === '/MyPanel') || (pathname === '/MyPanel/PersonCentral/Account')) {
          dispatch({ type: 'queryAccountSimpleInfoById', payload: query });
        }
      });
    },
  },
};
