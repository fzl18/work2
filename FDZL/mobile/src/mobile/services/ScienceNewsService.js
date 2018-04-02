import request from '../utils/request';
import { API_URL, PAGE_SIZE } from '../constants';

export function query(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    isPortal: '1',
    ...params,
  };
  return request(`${API_URL.department.queryPopularScienceList}`, newParams);
}
export function queryCategory(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.department.queryPopularScienceCategoryList}`, newParams);
}
