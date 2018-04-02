import request from '../utils/request';
import { API_URL, PAGE_SIZE } from '../constants';

// export function query(params) {
//   const newParams = {
//     // offset: params && params.page ? params.page : 1,
//     // limit: params && params.limit ? params.limit : PAGE_SIZE,
//     ...params,
//   };
//   return request(`${API_URL.user.doctorRegister.do}`, newParams);
// }
export function verifyCode(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.verifyCode}`, newParams);
}
export function queryPersonalInfo(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.project.queryIntegralDetail}`, newParams);
}
export function BaisInfo(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.queryBasicInformation}`, newParams);
}
export function modifyUserMobile(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.modifyUserMobile}`, newParams);
}
export function queryhospitalType(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.listHospitalsByEnterpriseId}`, newParams);
}
export function queryDepHospitalEnterpriseType(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.queryDepHospitalEnterpriseByHospitalId}`, newParams);
}
export function AuditFailedToPass(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.queryBasicInformation}`, newParams);
}
export function AuditInfomation(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.queryApproveInformation}`, newParams);
}
export function reviseAuditInfomation(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.ydataAccountInformation}`, newParams);
}
export function AuditFailReason(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.selectNowAuditStatus}`, newParams);
}
export function queryAmountParameter(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.project.queryAmountParameter}`, newParams);
}
export function AvailableBalanceDetail(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.pay.balanceQuery}`, newParams);
}
export function RechargeDetailList(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.pay.queryDepositList}`, newParams);
}
export function AssistantBaisInfo(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.project.queryCrcs}`, newParams);
}
export function AssistantInfo(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.project.modifyCrcs}`, newParams);
}
