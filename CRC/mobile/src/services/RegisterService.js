import request from '../utils/request';
import { PAGE_SIZE, API_URL } from '../constants';

export function query(params) {
  const newParams = {
    // offset: params && params.page ? params.page : 1,
    // limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.doctorRegister}`, newParams);
}
export function querynonDoctorRegister(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.nonDoctorRegister}`, newParams);
}

export function queryNext(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.checkRegist}`, newParams);
}

export function verifyCode(params) {
  const newParams = {
    ...params,
  };
  return request(`${API_URL.user.verifyCode}`, newParams);
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
export function NowAuditStatus(params) {
  const newParams = {

    ...params,
  };
  return request(`${API_URL.user.selectNowAuditStatus}`, newParams);
}
export function uploadImg(params) {
  return request(`${API_URL.multimedia.uploadImg}`, params);
}
export function queryhospitalName(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.listHospitalsAutoComplete}`, newParams);
}
export function queryhospitalDepName(params) {
  const newParams = {
    offset: params && params.page ? params.page : 1,
    limit: params && params.limit ? params.limit : PAGE_SIZE,
    ...params,
  };
  return request(`${API_URL.user.listDepartmentsAutoComplete}`, newParams);
}
