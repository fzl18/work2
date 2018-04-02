import request from '../utils/request';
import { API_URL, PAGE_SIZE } from '../constants';

export function queryInformList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.notice.queryInformList}`, newParams);
}

export function queryNoticeForPub(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.notice.queryNoticeForPub}`, newParams);
}

export function deleteInformByInformId(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.notice.deleteInformByInformId}`, newParams);
}

export function modifyIsReadByInformId(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.notice.modifyIsReadByInformId}`, newParams);
}

export function queryContent(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.notice.queryNoticeList}`, newParams);
}

// 查询是否存在未读的新信息
export function queryUnReadInformList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.notice.queryUnReadInformList}`, newParams);
}
