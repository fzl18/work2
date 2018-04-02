// import { Toast } from 'antd-mobile';
import * as MyAssetsService from '../../services/MyAssetsService';
// import { PAGE_SIZE } from '../../constants';

export default {
  namespace: 'MyAssets',
  state: {

  },
  reducers: {

    myVouchers(state, { payload: { data: myVouchers } }) {
      return {
        ...state, myVouchers,
      };
    },


  },
  effects: {

    *queryMyVouchers({ payload }, { call, put }) {
      const newpayload = {
        ...payload,
        limit: 999,
      };
      const response = yield call(MyAssetsService.queryMyVouchers, newpayload);
      if (!response) {
        return;
      }
      const { datas = [] } = response;
      yield put({
        type: 'myVouchers',
        payload: {
          data: datas,
          // page: payload.page,
        },
      });
    },
  },
  subscriptions: {
    setupIndex({ dispatch, history }) {
      return history.listen(({ pathname, query = {} }) => {
        if (pathname === '/MyAssets/queryMyVouchers') {
          dispatch({ type: 'myVouchers', payload: query });
        }
      });
    },

  },
}
;
