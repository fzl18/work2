const getJsSdkConfig_url = '../jssdk.do';
// 禁止分享
$.ajax({
  url: getJsSdkConfig_url,
  type: 'post',
  dataType: 'json',
  contentType: 'application/x-www-form-urlencoded; charset=utf-8',
  data: {
    url: location.href.split('#')[0],
  },
  success(data) {
    wx.config({
      debug: false,
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.noncestr,
      signature: data.signature,
      jsApiList: ['checkJsApi', 'onMenuShareTimeline',
        'onMenuShareAppMessage', 'onMenuShareQQ',
        'onMenuShareWeibo', 'hideMenuItems',
        'showMenuItems', 'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem', 'translateVoice',
        'startRecord', 'stopRecord', 'onRecordEnd',
        'playVoice', 'pauseVoice', 'stopVoice',
        'uploadVoice', 'downloadVoice', 'chooseImage',
        'previewImage', 'uploadImage', 'downloadImage',
        'getNetworkType', 'openLocation', 'getLocation',
        'hideOptionMenu', 'showOptionMenu', 'closeWindow',
        'scanQRCode', 'chooseWXPay',
        'openProductSpecificView', 'addCard', 'chooseCard',
        'openCard'],
    });
  },
});


wx.ready(() => {
  wx.hideOptionMenu();
});
