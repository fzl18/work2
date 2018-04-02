import request from '../utils/request';
import { PAGE_SIZE, API_URL } from '../constants';

export function query(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  const page = params && params.page ? params.page : 1;
  const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`/mock/userDetails?_page=${page}&_limit=${limit}`, newParams);
}

export function authNoticeList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryPersonalNotice}`, newParams);
}
export function pwd(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.modifyUserPassword}`, newParams);
}
export function empowerApply(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.queryNoticeInfo}`, newParams);
}
export function serviceInfo(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.queryAuthInfo}`, newParams);
}
export function queryApplyOrReject(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.applyOrReject}`, newParams);
}
// 解除绑定
export function queryRelieveAuth(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.relieveAuthInfo}`, newParams);
}
export function querydeleteNoticeById(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.deleteNoticeById}`, newParams);
}
export function deleteAllNotice(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.deleteAllNotice}`, newParams);
}
export function queryAccountSimpleInfoById(params) {
  const newParams = {
    // method: 'post',
    ...params,
  };
  // const page = params && params.page ? params.page : 1;
  // const limit = params && params.limit ? params.limit : PAGE_SIZE;
  return request(`${API_URL.user.queryAccountSimpleInfoById}`, newParams);
}
