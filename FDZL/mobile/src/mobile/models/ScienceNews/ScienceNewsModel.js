import { Toast } from 'antd-mobile';
import * as ScienceNewsService from '../../services/ScienceNewsService';
import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'ScienceNews',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data, total, page, popularScienceCategoryId, noMore } }) {
      const updateData = {
        list: data,
      };
      const newData = {
        ...state[popularScienceCategoryId],
        ...updateData,
        total,
        page,
        noMore,
      };
      return {
        ...state, [popularScienceCategoryId]: { ...newData },
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
    addList(state, { payload: { data: list, popularScienceCategoryId, noMore } }) {
      const addList = [...state[popularScienceCategoryId].list, ...list];
      const updateData = {
        list: addList,
        noMore,
      };
      const newData = {
        ...state[popularScienceCategoryId],
        ...updateData,
      };
      return {
        ...state, [popularScienceCategoryId]: { ...newData },
      };
    },
    saveSearch(state, { payload: { params } }) {
      const popularScienceCategoryId = params.popularScienceCategoryId;
      const newSearch = {
        ...state.searchParmas,
        ...params,
      };
      const updateData = {
        searchParmas: { ...newSearch },
      };
      const newData = {
        ...state[popularScienceCategoryId],
        ...updateData,
      };
      return {
        ...state, [popularScienceCategoryId]: { ...newData },
      };
    },
    tabIndex(state, { payload: { listIndex } }) {
      return {
        ...state, listIndex,
      };
    },
    departmentTabIndex(state, { payload: { departmentTabIndex } }) {
      return {
        ...state, departmentTabIndex,
      };
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const popularScienceCategoryId = payload.popularScienceCategoryId;
      const data = yield select(state => state.ScienceNews);
      let { searchParmas = {} } = data[popularScienceCategoryId] || {};// 根据id在state中取出相应的查询参数
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };// 查询时，应取出查询参数(refresh，paging)

      if (popularScienceCategoryId == 'ALL') {
        newpayload.popularScienceCategoryId = '';
      }
      const response = yield call(ScienceNewsService.query, newpayload);
      if (!payload.noParam) {
        const newParams = { ...searchParmas, ...payload };
        if (newParams.popularScienceCategoryId == '' || !newParams.popularScienceCategoryId) {
          newParams.popularScienceCategoryId = 'ALL';
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
          popularScienceCategoryId,
          noMore,
        },
      });
    },
    *queryCategory({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(ScienceNewsService.queryCategory, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'saveCategory',
        payload: {
          data: datas,
          page: payload.page,
        },
      });
    },
    *nextPage({ payload }, { call, put, select }) {
      const popularScienceCategoryId = payload.popularScienceCategoryId;
      const data = yield select(state => state.ScienceNews);
      let { searchParmas = {} } = data[popularScienceCategoryId] || {};// 根据id在state中取出相应的查询参数
      if (payload.noParam) {
        searchParmas = {};
      }
      const newpayload = { ...searchParmas, ...payload };// 查询时，应取出查询参数(refresh，paging)

      if (popularScienceCategoryId == 'ALL') {
        newpayload.popularScienceCategoryId = '';
      }
      const response = yield call(ScienceNewsService.query, newpayload);
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
          popularScienceCategoryId,
        },
      });
    },
    *getInfo({ payload }, { put, call }) {
      // const { data, headers } = yield call(ScienceNewsService.query, payload);
      const response = yield call(ScienceNewsService.query, payload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      const info = datas[0];
      if (response.count == 0) {
        Toast.info('页面不存在', 1);
        setTimeout(() => {
          location.href = '/';
        }, 1500);
      }
      yield put({
        type: 'saveInfo',
        payload: {
          data: info,
        },
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
    setupDepartment({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/Department' || pathname === '/ScienceNews/ScienceNewsList') {
          dispatch({ type: 'queryCategory', payload: query });
        }
      });
    },
  },
};
