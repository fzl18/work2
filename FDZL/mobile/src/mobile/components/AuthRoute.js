import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import axios from 'axios';
import qs from 'qs';
import { AUTH } from '../constants';


const { role = 'VISITOR' } = sessionStorage;
const curAuth = AUTH[role];

class AuthRoute extends React.Component {

  componentWillMount() {
    if (!window.configs.DEV) {
      if (!sessionStorage.role) {
        const url = encodeURIComponent(location.href);
        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.configs.APPID}&redirect_uri=${window.configs.JSP_URL}/oauth.do?url=${url}&response_type=code&scope=snsapi_userinfo&state=HDWX#wechat_redirect`;
      }
    }
  }


  componentDidMount() {
    this.setWxSdk();
  }

  componentWillReceiveProps() {
      // 分享给朋友
    this.setWxSdk();
    // setTimeout(() => {
    //   window.wx.onMenuShareAppMessage({
    //     title: document.title, //
    //     desc: document.title, //
    //     link: location.href, //
    //     imgUrl: `${location.origin}/images/logo.png`, // 分享的图标
    //     fail(res) {
    //       console.log(JSON.stringify(res));
    //     },
    //   });

    //     // 分享到朋友圈
    //   window.wx.onMenuShareTimeline({
    //     title: document.title, //
    //     desc: document.title, //
    //     link: location.href, //
    //     imgUrl: `${location.origin}/images/logo.png`, // 分享的图标
    //     fail(res) {
    //       console.log(JSON.stringify(res));
    //     },
    //   });
    // }, 500);
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.location.pathname !== prevProps.location.pathname) {
  //     this.onRouteChanged();
  //   }
  // }

  setWxSdk = () => { // @todo jssdk  url configuation
    axios.post(`${window.configs.ADMIN_URL}/jssdk.do`, qs.stringify({ url: location.href }))
    .then((response) => {
      const ret = response.data;
      const { appId, noncestr, timestamp, signature } = ret || {};
      window.wx.config({
        debug: window.configs.SDKDEBUG, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，
        // 若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId,
        nonceStr: noncestr,
        timestamp,
        signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
        ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    })
    .catch((error) => {
      console.error(error);
    });

    window.wx.ready(() => {
      // 分享给朋友
      window.wx.onMenuShareAppMessage({
        title: document.title, //
        desc: document.title, //
        link: location.href, //
        imgUrl: `${location.origin}/images/logo.png`, // 分享的图标
        fail(res) {
          alert(JSON.stringify(res));
        },
      });

      // 分享到朋友圈
      window.wx.onMenuShareTimeline({
        title: document.title, //
        desc: document.title, //
        link: location.href, //
        imgUrl: `${location.origin}/images/logo.png`, // 分享的图标
        fail(res) {
          alert(JSON.stringify(res));
        },
      });
    });
  }

// function AuthRoute({ children, history }) {
  render() {
    const { children } = this.props;
    return (
      <div>
        {React.Children.map(children, (child) => {
          const routeAuth = child.props.auth;
          if (routeAuth) {
            if (curAuth[routeAuth]) {
              if (curAuth[routeAuth].access) {
                return child;
              } else {
                return (<Route
                  path={child.props.path}
                  render={
                            () => {
                              location.href = '/BindAccount';
                            }
                        }
                />);
              }
            } else {
              return child;
            }
          } else {
            return child;
          }
        })}
      </div>
    );
  }


}


export default connect()(AuthRoute);
