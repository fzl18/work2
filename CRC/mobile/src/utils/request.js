import axios from 'axios';
import { Toast } from 'antd-mobile';
import qs from 'qs';
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const { acctId, openId } = sessionStorage;
  const postData = {
    ...options,
    acctId,
    openId,
    curYdataAccountId: acctId,
    ydataAcctId: acctId,
  };
  // add cookie support
  axios.defaults.withCredentials = true;
  // if noqs is true. do not use qs stringify
  const finalData = options.noqs ? options.form : qs.stringify(postData);
  return axios.post(url, finalData)
  .then((response) => {
    let ret = {};
    try {
      if (response.data) {
        if (response.data.error) {
          if (response.data.error == 'UnbindUser') {
            sessionStorage.role = 'VISITOR';
            sessionStorage.acctId = '';
            location.href = '/BindAccount';
          }
          Toast.info(response.data.error, 1.5);
        }
        ret = response.data;
        ret.headers = {};
        return ret;
      } else {
        return ret;
      }
    } catch (error) {
      console.error(error);
    }
  })
  .catch((error) => {
    if (error.message == 'Network Error') {
      Toast.info('网络连接失败', 1.5);
    } else {
      Toast.info(error.message, 1.5);
    }
    console.error(error);
  });
}

