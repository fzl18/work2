import * as DepartmentService from '../../services/DepartmentService';
// import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'Department',
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
    saveInfo(state, { payload: { data: info = {} } }) {
      return {
        ...state, info,
      };
    },
    addList(state, { payload: { data: list, total, page } }) {
      const addList = [...state.list, ...list];
      return {
        ...state, list: addList, total, page,
      };
    },
    saveSearch(state, { payload: { params } }) {
      return {
        ...state, searchParmas: { ...params },
      };
    },
  },
  effects: {
    // *query({ payload }, { call, put, select }) {
    //   let { searchParmas = {} } = yield select(state => state.Department);
    //   if (payload.noParam) {
    //     searchParmas = {};
    //   }
    //   const newpayload = { ...searchParmas, ...payload };
    //   const response = yield call(DepartmentService.query, newpayload);
    //   if (!payload.noParam) {
    //     yield put({
    //       type: 'saveSearch',
    //       payload: {
    //         params: newpayload,
    //       },
    //     });
    //   }
    //   if (!response) {
    //     return;
    //   }
    //   const { datas = [], totalCount } = response;
    //   const noMore = payload.page * PAGE_SIZE > totalCount;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       data: datas,
    //       page: payload.page,
    //       noMore,
    //     },
    //   });
    // },
    // *nextPage({ payload }, { call, put }) {
    //   const response = yield call(DepartmentService.query, payload);
    //   if (!response) {
    //     return;
    //   }
    //   const { datas = [], totalCount } = response;
    //   const noMore = payload.page * PAGE_SIZE > totalCount;
    //   yield put({
    //     type: 'addList',
    //     payload: {
    //       data: datas,
    //       page: payload.page,
    //       noMore,
    //     },
    //   });
    // },
    *query({ payload }, { put, call }) {
      // const { data, headers } = yield call(DepartmentService.query, payload);
      const response = yield call(DepartmentService.query, payload);
      if (!response) {
        return;
      }
      const { department = {} } = response;
      yield put({
        type: 'saveInfo',
        payload: {
          data: department,
        },
      });
    },
    // *clearSearch({ payload }, { put }) {
    //   yield put({
    //     type: 'saveSearch',
    //     payload: {
    //       params: {},
    //     },
    //   });
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query = { } }) => {
        if (pathname === '/Department/Departmentintroduced') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
    // setupIndex({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { limit: 3, noParam: true } }) => {
    //     if (pathname === '/') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
    setupDepartment({ dispatch, history }) {
      return history.listen(({ pathname, query = { limit: 6, noParam: true } }) => {
        if (pathname === '/Department') {
          dispatch({ type: 'query', payload: query });
        }
      });
    },
  },
};
