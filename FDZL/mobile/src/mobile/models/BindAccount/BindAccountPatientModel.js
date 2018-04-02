import { Toast } from 'antd-mobile';
import * as BindAccountPatientService from '../../services/BindAccountPatientService';


export default {
  namespace: 'BindAccountPatient',
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
    // saveInfo(state, { payload: { data: info = {} } }) {
    //   return {
    //     ...state, info,
    //   };
    // },
    // addList(state, { payload: { data: list, total, page } }) {
    //   const addList = [...state.list, ...list];
    //   return {
    //     ...state, list: addList, total, page,
    //   };
    // },
    // saveSearch(state, { payload: { params } }) {
    //   return {
    //     ...state, searchParmas: { ...params },
    //   };
    // },
  },
  effects: {
    *bindpatient({ payload }, { call, put }) {
      const response = yield call(BindAccountPatientService.query, payload);
      if (!response) {
        return;
      }
      if (response.error) {
        // Toast.info('绑定失败', 1);
        return;
      } else {
        Toast.info('绑定成功', 1);
        // 绑定判断
        // sessionStorage.userType = response.data.userType;
        // sessionStorage.userName = response.data.userName;
        // sessionStorage.userMobile = response.data.userMobile;
        // sessionStorage.userId = response.data.userId;
        sessionStorage.userCompellation = response.userCompellation;
        // sessionStorage.ydataAccountId = response.data.ydataAccountId;
        sessionStorage.role = response.role;
        sessionStorage.acctId = response.ydataAccountId;
        location.href = '/MyPanel';
      }
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },

  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { } }) => {
    //     if (pathname === '/BindAccount/BindAccountList') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
    // setupIndex({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { limit: 3, noParam: true } }) => {
    //     if (pathname === '/') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
    // setupDepartment({ dispatch, history }) {
    //   return history.listen(({ pathname, query = { limit: 6, noParam: true } }) => {
    //     if (pathname === '/Department') {
    //       dispatch({ type: 'query', payload: query });
    //     }
    //   });
    // },
  },
};
