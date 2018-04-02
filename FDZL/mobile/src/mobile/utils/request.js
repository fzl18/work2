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
  const { acctId, openid } = sessionStorage;
  const postData = {
    ...options,
    acctId,
    openid,
    curYdataAccountId: acctId,
    ydataAcctId: acctId,
  };
  axios.defaults.withCredentials = true;
  return axios.post(url, qs.stringify(postData))
  .then((response) => {
    let ret = {};
    try {
      if (response.data) {
        if (response.data.error) {
          if (response.data.error == 'UnbindUser') {
            sessionStorage.role = 'VISITOR';
            sessionStorage.acctId = '';
            location.href = '/BindAccount';
          } else {
            Toast.info(response.data.error, 1.5);
          }
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
    Toast.info(error.message, 1.5);
    console.error(error);
  });
}
