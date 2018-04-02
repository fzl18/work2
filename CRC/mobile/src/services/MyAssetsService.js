import request from '../utils/request';
import { API_URL, PAGE_SIZE } from '../constants';


// 获得我的代金券
export function queryMyVouchers(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.myAssets.queryMyVouchers}`, newParams);
}
