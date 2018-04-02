import request from '../utils/request';
import { API_URL, PAGE_SIZE } from '../constants';

export function queryProject(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.myOrder.queryProject}`, newParams);
}

export function queryProjectContent(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.order.queryProjectContent}`, newParams);
}
export function evaluationProject(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.order.evaluationProject}`, newParams);
}

export function robProject(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.order.robProject}`, newParams);
}
export function attackProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.attackProject}`, newParams);
}
export function wxPayComplete(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.pay.wxPayComplete}`, newParams);
}
export function preUseByProjectIdAndVoucherIds(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.preUseByProjectIdAndVoucherIds}`, newParams);
}
export function anotherProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.anotherProject}`, newParams);
}
export function completionProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.completionProject}`, newParams);
}
export function agreeCancelProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.agreeCancelProject}`, newParams);
}
export function submissionProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.submissionProject}`, newParams);
}
export function paymentProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.paymentProject}`, newParams);
}
export function balancePay(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.pay.balancePay}`, newParams);
}
export function publishEvaluation(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.publishEvaluation}`, newParams);
}
export function modifyWorkingHours(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.modifyWorkingHours}`, newParams);
}

export function addProjectTip(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.order.addProjectTip}`, newParams);
}
export function cancelNotRobProject(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.order.cancelNotRobProject}`, newParams);
}
export function cancelServiceProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.cancelServiceProject}`, newParams);
}

export function queryAmountParameter(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.project.queryAmountParameter}`, newParams);
}
export function queryProjectVouchers(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.order.queryProjectVouchers}`, newParams);
}

export function hintCancelProject(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.order.hintCancelProject}`, newParams);
}
export function generatePrepayId(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.pay.generatePrepayId}`, newParams);
}

export function queryOrderStatus(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.myOrder.queryHistoryState}`, newParams);
}
