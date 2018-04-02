import { Toast } from 'antd-mobile';
import * as UnbindAccountService from '../../services/UnbindAccountService';


export default {
  namespace: 'UnbindAccount',
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
  },
  effects: {
    *UnBindAccount({ payload }, { call, put }) {
      const response = yield call(UnbindAccountService.unbindAccount, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        // Toast.info('解除绑定失败', 1);
        return;
      }
      Toast.info('解除绑定成功', 1);
      setTimeout(() => {
        location.href = '/BindAccount';
      }, 1500);

      yield put({
        type: 'save',
        payload,
      });
    },

  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { } }) => {
    //     if (pathname === '/MyPanel/PersonCentral') {
    //       dispatch({ type: 'UnBindAccount', payload: query });
    //     }
    //   });
    // },
  },
};
