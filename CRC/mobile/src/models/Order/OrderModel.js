import { Toast } from 'antd-mobile';
import * as OrderService from '../../services/OrderService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'Order',
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
    saveProjectType(state, { payload: { data: projectType } }) {
      return {
        ...state, projectType,
      };
    },
    saveJobType(state, { payload: { data: jobType } }) {
      return {
        ...state, jobType,
      };
    },
    saveStaffType(state, { payload: { data: staffType } }) {
      return {
        ...state, staffType,
      };
    },
    saveCommonPlace(state, { payload: { data: CommonPlace } }) {
      return {
        ...state, CommonPlace,
      };
    },
    saveRuleServicePrice(state, { payload: { data: RuleServicePrice } }) {
      return {
        ...state, RuleServicePrice,
      };
    },
    keepOrderFormFields(state, { payload: { data: changedFields } }) {
      const OrderFormFieldsOld = state.OrderFormFields || {};
      const OrderFormFields = { ...OrderFormFieldsOld, ...changedFields };
      return {
        ...state, OrderFormFields,
      };
    },
    clearOrderFormFields(state) {
      return {
        ...state, OrderFormFields: {},
      };
    },
    copyOrderFormFields(state, { payload: { data: OrderFormFields } }) {
      return {
        ...state, OrderFormFields,
      };
    },
    saveProjectTitle(state, { payload: { data: ProjectTitle } }) {
      return {
        ...state, ProjectTitle,
      };
    },
    saveNewProject(state, { payload: { data: list, total, page, noMore, error } }) {
      const newProjectList = {
        list,
        total,
        page,
        noMore,
        error,
      };
      return {
        ...state, newProjectList,
      };
    },
    saveViolation(state, { payload: { data: listViolation } }) {
      return {
        ...state, listViolation,
      };
    },
    AuditStatus(state, { payload: { data: AuditStatus = {} } }) {
      return {
        ...state, AuditStatus,
      };
    },

  },
  effects: {
    *queryProjectType({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(OrderService.queryProjectType, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveProjectType',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *queryJobType({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(OrderService.queryJobType, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveJobType',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *queryStaffType({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(OrderService.queryStaffType, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveStaffType',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *queryCommonPlace({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(OrderService.queryCommonPlace, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveCommonPlace',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *addProject({ payload, callback }, { call }) {
      const newpayload = {
        ...payload,
      };
      const response = yield call(OrderService.addProject, newpayload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
      // const { datas = [] } = response;
      // yield put({
      //   type: 'saveCommonPlace',
      //   payload: {
      //     data: datas,
      //     page: payload.page,
      //   },
      // });
    },
    *queryRuleServicePrice({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(OrderService.queryRuleServicePrice, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveRuleServicePrice',
        payload: {
          data: datas[0] && datas[0].servicePrice,
          page: payload.page,
        },
      });
    },
    *queryProjectTitle({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(OrderService.queryProjectTitle, newpayload);
      if (!response) {
        return;
      }
      // const projects = response.projects || [];
      const { projects = [] } = response;
      yield put({
        type: 'saveProjectTitle',
        payload: {
          data: projects,
          page: payload.page,
        },
      });
    },
    *queryNewProject({ payload, callback }, { call, put }) {
      const response = yield call(OrderService.queryNewProject, payload);
      if (!response) {
        return;
      }
      if (callback) {
        callback(response);
      }
      const { datas = [], totalCount, error = '' } = response;
      const noMore = (payload.page || 1) * PAGE_SIZE >= totalCount;

      yield put({
        type: 'saveNewProject',
        payload: {
          data: datas,
          page: payload.page,
          noMore,
          total: totalCount,
          error,
        },
      });
    },
    *listViolation({ payload }, { call, put }) {
      const response = yield call(OrderService.listViolation, payload);
      if (!response) {
        return;
      }
      yield put({
        type: 'saveViolation',
        payload: {
          data: response,
        },
      });
    },
    *NowAuditStatus({ payload, callback }, { call, put }) {
      Toast.loading('加载中...', 0);
      const response = yield call(OrderService.NowAuditStatus, payload);
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
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/Order/AddOrder') {
          dispatch({ type: 'queryProjectType', payload: query });
          dispatch({ type: 'queryJobType', payload: query });
          dispatch({ type: 'queryStaffType', payload: query });
          dispatch({ type: 'queryCommonPlace', payload: query });
        }
        if (pathname === '/Order/RobNewOrder') {
          dispatch({ type: 'queryNewProject', payload: query });
        }
        if (pathname === '/Order/IllegalDetail') {
          dispatch({ type: 'listViolation', payload: query });
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
