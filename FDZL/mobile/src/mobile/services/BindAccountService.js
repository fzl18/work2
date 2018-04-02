import request from '../utils/request';
import { API_URL } from '../constants';

export function query(params) {
  const newParams = {
    // offset: params && params.page ? params.page : 1,
    // limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.doctorAndAssistantBind}`, newParams);
}
export function verifyCode(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.verifyCode}`, newParams);
}
