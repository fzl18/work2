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

export function questionList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryQuestionType}`, newParams);
}
export function questionList2(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryQuestion}`, newParams);
}
export function feedback(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.addMessage}`, newParams);
}
export function MessageType(params) {
  const newParams = {
    // offset: params && params.page ? params.page : 1,
    // limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryMessageType}`, newParams);
}
// export function questionDetail(params) {
//   const newParams = {
//     ...params,
//   };
//   return request(`${API_URL.user.queryQuestion}`, newParams);
// }
export function queryMessageType(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryMessageType}`, newParams);
}
export function CallCustomerService(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.queryOnlineService}`, newParams);
}
export function NowAuditStatus(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.selectNowAuditStatus}`, newParams);
}
