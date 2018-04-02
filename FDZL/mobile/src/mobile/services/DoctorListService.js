import request from '../utils/request';
import { API_URL } from '../constants';

export function query(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: 1000,
    ...params,
  };
  return request(`${API_URL.department.queryDepartmentDoctor}`, newParams);
}

export function sendApply(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.initiateApplicationByDocAss}`, newParams);
}
