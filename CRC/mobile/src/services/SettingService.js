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

export function SetOrderList(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.queryOrderRegion}`, newParams);
}
export function OrderAddress(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.addOrderRegion}`, newParams);
}
export function CommonAddressList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryCommonPlace}`, newParams);
}
export function CommonAddressList2(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryCommonPlace}`, newParams);
}
export function querydeleteAddressById(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.deleteCommonPlace}`, newParams);
}
export function queryProvince(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryProvince}`, newParams);
}
export function queryPlaceList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryPlaceList}`, newParams);
}
export function queryCity(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryCity}`, newParams);
}
export function queryDistrict(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryDistrict}`, newParams);
}
export function CommonPlace(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.modifyCommonPlace}`, newParams);
}
export function addCommonPlace(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.addCommonPlace}`, newParams);
}
export function modifyUserPassword(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.modifyUserPassword}`, newParams);
}
export function unbindUser(params) {
  const newParams = {

    ...params,
  };

  return request(`${API_URL.user.unbindUser}`, newParams);
}
export function NowAuditStatus(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.selectNowAuditStatus}`, newParams);
}
