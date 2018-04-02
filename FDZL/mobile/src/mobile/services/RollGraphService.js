import request from '../utils/request';
import { API_URL } from '../constants';

export function query(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.department.queryCarrouselImgList}`, newParams);
}
