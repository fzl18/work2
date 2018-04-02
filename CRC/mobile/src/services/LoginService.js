import request from '../utils/request';
import { API_URL } from '../constants';

export function query(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.loginUser}`, newParams);
}
export function LoginForAssistant(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.loginAssistant}`, newParams);
}
