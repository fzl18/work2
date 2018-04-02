 import { Toast } from 'antd-mobile';
 import * as CustomerServiceCenterService from '../../services/CustomerServiceCenterService';
 import { PAGE_SIZE } from '../../constants';

 export default {
   namespace: 'CustomerServiceCenter',
   state: {
     detail: {},
   },
   reducers: {
     save(state, { payload: { data: detail } }) {
       return {
         ...state, ...detail,
       };
     },
     saveInfo(state, { payload: { data: info = {} } }) {
       return {
         ...state, info,
       };
     },
     updateFeedback(state, { payload: { data: detail = {} } }) {
       return {
         ...state, detail,
       };
     },
     questionList(state, { payload: { data: list, total, page, noMore } }) {
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
    //  questionDetail(state, { payload: { data: detail = {} } }) {
    //    return {
    //      ...state, detail,
    //    };
    //  },
     saveMessageType(state, { payload: { data: listmessageType = [] || 0 } }) {
       return {
         ...state, listmessageType,
       };
     },
     saveCallNumber(state, { payload: { data: CallNumber = {} } }) {
       return {
         ...state, CallNumber,
       };
     },
     AuditStatus(state, { payload: { data: AuditStatus = {} } }) {
       return {
         ...state, AuditStatus,
       };
     },
   },
   effects: {
     *query({ payload }, { call, put }) {
       const { data } = yield call(CustomerServiceCenterService.query, payload);
       yield put({
         type: 'save',
         payload: {
           data,
         },
       });
     },
     *question({ payload }, { call, put }) {
       Toast.loading('加载中...', 0);
       const response = yield call(CustomerServiceCenterService.questionList, payload);
       Toast.hide();
       if (!response) {
         return;
       }
       const { datas = [], totalCount } = response;
       const noMore = payload.page * PAGE_SIZE >= totalCount;
       yield put({
         type: 'questionList',
         payload: {
           data: datas,
           page: payload.page,
           noMore,
         },
       });
     },
     *typeQuestion({ payload }, { call, put }) {
       Toast.loading('加载中...', 0);
       const response = yield call(CustomerServiceCenterService.questionList2, payload);
       Toast.hide();
       if (!response) {
         return;
       }
       const { datas = [], totalCount } = response;
       const noMore = payload.page * PAGE_SIZE >= totalCount;
       yield put({
         type: 'questionList',
         payload: {
           data: datas,
           page: payload.page,
           noMore,
         },
       });
     },
    //  *questionDetail({ payload }, { call, put }) {
    //    const response = yield call(CustomerServiceCenterService.questionDetail, payload);
    //    const { question = {} } = response || {};
    //    yield put({
    //      type: 'questionDetail',
    //      payload: {
    //        data: question,
    //      },
    //    });
    //  },
     *getInfo({ payload }, { put, call }) {
       Toast.loading('加载中...', 0);
       const response = yield call(CustomerServiceCenterService.questionList2, payload);
       Toast.hide();
       if (!response) {
         return;
       }
       const { datas = [] } = response || {};
       const info = datas[0];
       if (response.count == 0) {
         Toast.info('页面不存在', 1);
        //  setTimeout(() => {
        //    location.href = '/';
        //  }, 1500);
       }
       yield put({
         type: 'saveInfo',
         payload: {
           data: info,
         },
       });
     },
     *nextPage({ payload }, { call, put }) {
       const response = yield call(CustomerServiceCenterService.questionList, payload);
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
     *feedback({ payload, callback }, { call, put }) {
       const response = yield call(CustomerServiceCenterService.feedback, payload);
       if (!response) {
         return;
       }
       if (response.error) {
         Toast.info(response.error);
         return;
       }
      //  Toast.info(response.success);
      //  setTimeout(() => {
      //    location.href = '/CustomerServiceCenter';
      //  }, 1500);
       if (callback) {
         callback(response);
       }
       yield put({
         type: 'updateFeedback',
         payload,
       });
     },
     *MessageType({ payload }, { call, put }) {
       const response = yield call(CustomerServiceCenterService.MessageType, payload);
       if (!response) {
         return;
       }
      //  if (response.error) {
      //    return;
      //  }
       const { datas = [] } = response;
       const detail = datas;
       yield put({
         type: 'updateFeedback',
         payload: {
           data: detail,
         },
       });
     },
     *queryMessageType({ payload }, { call, put }) {
       const newpayload = {
         ...payload,
         limit: 999,
       };
       const response = yield call(CustomerServiceCenterService.queryMessageType, newpayload);
       if (!response) {
         return;
       }
       const { datas = [] } = response;
       yield put({
         type: 'saveMessageType',
         payload: {
           data: datas,
           page: payload.page,
         },
       });
     },
     *CallCustomerService({ payload }, { call, put }) {
       const response = yield call(CustomerServiceCenterService.CallCustomerService, payload);
       if (!response) {
         return;
       }
      // Toast.info(response.success);
       yield put({
         type: 'saveCallNumber',
         payload: {
           data: response,
         },
       });
     },
     *NowAuditStatus({ payload, callback }, { call, put }) {
       Toast.loading('加载中...', 0);
       const response = yield call(CustomerServiceCenterService.NowAuditStatus, payload);
       Toast.hide();
       if (!response) {
         return;
       }
       sessionStorage.auditStatus = response.success.auditStatus;
       if ((response.success && response.success.auditStatus == 'audit_pending') || (response.success && response.success.auditStatus == 'audit_failed')) {
         if (callback) {
           callback();
         }
       }
       yield put({
         type: 'AuditStatus',
         payload: {
           data: response,
         },
       });
     },


   },
   subscriptions: {
     queryQuestion({ dispatch, history }) {
       return history.listen(({ pathname, query = { } }) => {
         if (pathname === '/CustomerServiceCenter') {
           dispatch({ type: 'question', payload: query });
         }
       });
     },
    //  queryQuestionType({ dispatch, history }) {
    //    return history.listen(({ pathname, query = {} }) => {
    //      if (pathname === '/Problem') {
    //        dispatch({ type: 'typeQuestion', payload: query });
    //      }
    //    });
    //  },
    //  queryMessageType({ dispatch, history }) {
    //    return history.listen(({ pathname, query = { } }) => {
    //      if (pathname === '/Feedback') {
    //        dispatch({ type: 'MessageType', payload: query });
    //      }
    //    });
    //  },
     setupMessageType({ dispatch, history }) {
       return history.listen(({ pathname, query = {} }) => {
         if (pathname === '/Feedback') {
           dispatch({ type: 'queryMessageType', payload: query });
         }
       });
     },
   },
 };
