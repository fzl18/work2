import { Toast } from 'antd-mobile';
import * as MyOrderService from '../../services/MyOrderService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'MyOrder',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    // queryProjectData(state, { payload: { data: allOrder = [] } }) {
    //   return {
    //     ...state, allOrder,
    //   };
    // },
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
    addList(state, { payload: { data: list, searchType, noMore, total, page } }) {
      const addList = [...state[searchType].list, ...list];
      const updateData = {
        list: addList,
        noMore,
        total,
        page,
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
      const searchType = params.searchType || 'ALL';
      const oldparmas = state[searchType] ? state[searchType].searchParmas : {};
      const newSearch = {
        ...oldparmas,
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
      sessionStorage.ChatTabIndex = listIndex.index || 0;
      return {
        ...state, listIndex,
      };
    },
    saveProjectContent(state, { payload: { data: projectContent = {} } }) {
      return {
        ...state, projectContent,
      };
    },
    saveEvaluationProject(state, { payload: { data: evaluationTypes = {} } }) {
      return {
        ...state, evaluationTypes,
      };
    },
    saveFeeParameter(state, { payload: { data: FeeParameter = {} } }) {
      return {
        ...state, FeeParameter,
      };
    },
    saveHintCancel(state, { payload: { data: HintCancelMsg = {} } }) {
      return {
        ...state, HintCancelMsg,
      };
    },
    saveOrderStatus(state, { payload: { data: OrderStatus = {} } }) {
      return {
        ...state, OrderStatus,
      };
    },
  },
  effects: {
    // *queryProject({ payload }, { call, put }) {
    //   const newpayload = {
    //     ...payload,
    //     limit: 999,
    //   };
    //   const response = yield call(MyOrderService.queryProject, newpayload);
    //   if (!response) {
    //     return;
    //   }
    //   const { datas = [] } = response;
    //   yield put({
    //     type: 'queryProjectData',
    //     payload: {
    //       data: datas,
    //     },
    //   });
    // },
    *queryProject({ payload, callback }, { call, put, select }) {
      const data = yield select(state => state.MyOrder);
      const { listIndex = {} } = data;
      const curSearchType = (listIndex.tab && listIndex.tab.searchType) || 'ALL';
      const searchType = payload.searchType || curSearchType;
      let { searchParmas = {} } = data[searchType] || {};// 根据id在state中取出相应的查询参数
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas,
        ...payload,
        orderStatus: searchType,
        serviceStatus: searchType };
      // 查询时，应取出查询参数(refresh，paging)

      if (searchType == 'ALL') {
        newpayload.searchType = '';
        newpayload.orderStatus = '';
        newpayload.serviceStatus = '';
      }
      const isAssistant = sessionStorage.role == 'INSIDE_ASSISTANT';
      if (isAssistant) {
        newpayload.orderStatus = '';
      } else {
        newpayload.serviceStatus = '';
      }
      const response = yield call(MyOrderService.queryProject, newpayload);
      if (!payload.noParam) {
        const newParams = { ...searchParmas, ...payload };
        if (newParams.searchType == '' || !newParams.searchType) {
          newParams.searchType = 'ALL';
          newParams.orderStatus = 'ALL';
          newpayload.serviceStatus = 'ALL';
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
      if (callback) {
        callback(response);
      }
    },
    *nextPage({ payload }, { call, put }) {
      const newPayload = { ...payload };
      const searchType = payload.searchType;
      if (payload.searchType == 'ALL') {
        newPayload.searchType = '';
        newPayload.orderStatus = '';
      }
      const response = yield call(MyOrderService.queryProject, newPayload);
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
          total: totalCount,
        },
      });
    },
    *queryProjectContent({ payload, callback }, { put, call }) {
      const response = yield call(MyOrderService.queryProjectContent, payload);
      if (!response) {
        return;
      }
      const { project = {}, payInfo = {} } = response || {};
      project.payInfo = payInfo;
      yield put({
        type: 'saveProjectContent',
        payload: {
          data: project,
        },
      });
      if (callback) {
        callback(response);
      }
    },
    *evaluationProject({ payload, callback }, { put, call }) { // 获取评论项
      const response = yield call(MyOrderService.evaluationProject, payload);
      if (!response) {
        return;
      }
      const { evaluationTypes = {} } = response || {};
      yield put({
        type: 'saveEvaluationProject',
        payload: {
          data: evaluationTypes,
        },
      });
      if (callback) {
        callback(response);
      }
    },
    *robProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.robProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *attackProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.attackProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *anotherProject({ payload, callback }, { call, put }) {
      const response = yield call(MyOrderService.anotherProject, payload);
      if (!response) {
        return;
      }
      const { project } = response;
      const OrderFormFields = {};
      const convertArray = (array = []) => {
        return array.map((x) => {
          return parseInt(x, 10);
        });
      };
      OrderFormFields.jobTypeIdsChked = convertArray((`${project.jobTypeIds}`).split(','));
      OrderFormFields.jobTypeLabelsChked = (`${(project.projectContract && project.projectContract.jobTypeNames) || ''}`).split('|');
      OrderFormFields.projectTitle = { value: project.projectTitle };
      OrderFormFields.projectTypeId = { value: convertArray((`${project.projectTypeId}`).split(',')) };
      OrderFormFields.serviceStaffTypeId = { value: convertArray((`${project.serviceStaffTypeId}`).split(',')) };
      OrderFormFields.selectedPlace = project.commonPlace;

      // OrderFormFields.selectedPlace = {
      //   districtId:
      // };
      yield put({
        type: 'Order/copyOrderFormFields',
        payload: {
          data: OrderFormFields,
        },
      });
      yield put({
        type: 'Order/saveRuleServicePrice',
        payload: {
          data: project.servicePrice,
        },
      });
      if (callback) {
        callback(response);
      }
    },
    *modifyWorkingHours({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.modifyWorkingHours, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *completionProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.completionProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *queryProjectVouchers({ payload, callback }, { call }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(MyOrderService.queryProjectVouchers, newpayload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *agreeCancelProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.agreeCancelProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *preUseByProjectIdAndVoucherIds({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.preUseByProjectIdAndVoucherIds, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *generatePrepayId({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.generatePrepayId, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *wxPayComplete({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.wxPayComplete, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *submissionProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.submissionProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *publishEvaluation({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.publishEvaluation, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *paymentProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.paymentProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *balancePay({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.balancePay, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *addProjectTip({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.addProjectTip, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *cancelNotRobProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.cancelNotRobProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *cancelServiceProject({ payload, callback }, { call }) {
      const response = yield call(MyOrderService.cancelServiceProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *queryFeeParameter({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
        amountParameterType: 'TIP',
      };
      const response = yield call(MyOrderService.queryAmountParameter, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveFeeParameter',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *hintCancelProject({ payload, callback }, { call }) {
      Toast.loading('加载中...', 0);
      const response = yield call(MyOrderService.hintCancelProject, payload);
      Toast.hide();
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
    },
    *queryOrderStatus({ payload }, { put, call }) {
      const response = yield call(MyOrderService.queryOrderStatus, payload);
      if (!response) {
        return;
      }
      const { project = {} } = response || {};
      yield put({
        type: 'saveOrderStatus',
        payload: {
          data: project,
        },
      });
    },
  },
  subscriptions: {
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/MyOrder/AllOrder' || pathname.startsWith('/MyOrder/DataOrder') || pathname.startsWith('/Order/WaitRobOrder')) {
          // dispatch({ type: 'queryProject', payload: query });
          dispatch({ type: 'queryFeeParameter', payload: query });
        }
      });
    },
  },
};
