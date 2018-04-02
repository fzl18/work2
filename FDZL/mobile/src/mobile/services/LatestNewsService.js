import request from '../utils/request';
import { PAGE_SIZE, API_URL } from '../constants';

export function query(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    isPortal: '1',
    ...params,
  };
  return request(`${API_URL.department.queryLastTendencyList}`, newParams);
}
