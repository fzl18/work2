import request from '../utils/request';
import { API_URL, PAGE_SIZE } from '../constants';

export function query(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.conversation.queryChatList}`, newParams);
}

export function generateChat(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.conversation.generateChat}`, newParams);
}

export function generateInfo(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.conversation.generateInfo}`, newParams);
}

export function deleteConversation(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.conversation.deleteConversation}`, newParams);
}

export function getHotChat(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.conversation.queryHotConversationDetailForWx}`, newParams);
}
