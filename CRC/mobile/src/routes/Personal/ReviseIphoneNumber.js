import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { InputItem, Button, Toast } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './PersonalInfo.less';

const pageTitle = '修改手机号码';
const { ADMIN_URL } = window.configs;


class ReviseIphoneNumber extends React.Component {
  state = {
    userMobile: '',
    userPassword: '',
    disableValue: false,
    captchaUrl: `${ADMIN_URL}/user/captcha.do?`,
    _captcha_: '',
    _verifyCode_: '',
    seconds: 60,
    Sendidentifyingcode: '获取验证码',
  }

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }
  next=() => {
    const { userPassword, userMobile, _captcha_, _verifyCode_,
      } = this.state;
    const _mobile_ = userMobile;
    console.log(_mobile_);
    if (userPassword == '' || (userPassword && userPassword.trim() == '')) {
      Toast.info('请输入登录密码', 1, () => {}, false);
      return;
    }
    if (userMobile == '' || (userMobile && userMobile.trim() == '')) {
      Toast.info('请输入手机号', 1, () => {}, false);
      return;
    }
    if (_captcha_ == '' || _captcha_ == undefined || (_captcha_ && _captcha_.trim() == '')) {
      Toast.info('请输入图形码', 1, () => {}, false);
      return;
    }
    if (_verifyCode_ == '' || (_verifyCode_ && _verifyCode_.trim() == '')) {
      Toast.info('请输入验证码', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'PersonalInfo/modifyUserMobile',
      payload: { userPassword, userMobile, _verifyCode_ },
      callback: (response) => {
        Toast.info(response.success, 1, () => {}, false);
        // setTimeout(() => {
        this.props.history.push('/Login');
        // }, 1500);
      },
    });
  }
  captchaCode=() => {
    // const { ADMIN_URL } = window.configs;
    this.setState(State => ({
      captchaUrl: State.captchaUrl + Math.random(),
    }));
  }
  sendIdentify = () => {
    const { _captcha_, userMobile } = this.state;
    const username = userMobile;
    if (userMobile == '' || userMobile == undefined || (userMobile && userMobile.trim() == '')) {
      Toast.info('请先输入手机号', 1, () => {}, false);
      return;
    }
    if (_captcha_ == '' || _captcha_ == undefined || (_captcha_ && _captcha_.trim() == '')) {
      Toast.info('请先输入图形码', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'PersonalInfo/verifyCode',
      payload: { _captcha_, userMobile, username },
      callback: () => {
        const siv = setInterval(() => {
          this.setState(preState => ({
            seconds: preState.seconds - 1,
            Sendidentifyingcode: `重新发送(${preState.seconds - 1}s)`,
            disableValue: true,
            flag: 2,

          }), () => {
            if (this.state.seconds == 0) {
              this.setState({
                Sendidentifyingcode: '获取验证码',
                seconds: 60,
                disableValue: false,

              }, () => {
                clearInterval(siv);
              });
            }
          });
        }, 1000);
      } });
  }
  render() {
    const { disableValue, captchaUrl } = this.state;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.head} />
        <div className={styles.ReviseIphoneNumberbody} >
          <InputItem
            clear
            placeholder="请输入登录密码"
            type="phone"
            onChange={e => this.onStateChange(e, 'userPassword')}
          />
          <InputItem
            clear
            placeholder="请输入新的手机号"
            type="phone"
            onChange={e => this.onStateChange(e, 'userMobile')}
          />
          <InputItem
            placeholder="请输入图形码"
            onChange={e => this.onStateChange(e, '_captcha_')}
            maxLength="6"
          >
            <div className="col-sm-3" id="codeDiv">
              <img
                alt=""
                id="codeImage" style={{ height: 26, width: 95, position: 'absolute', top: 7, right: 15, border: '1px solid #e0d6d6' }}
                src={captchaUrl}
                onClick={this.captchaCode}
              />
            </div>
          </InputItem>
          <InputItem
            placeholder="请输入验证码"
            onChange={e => this.onStateChange(e, '_verifyCode_')}
            maxLength="6"
          >
            <button
              className={styles.identifyingcode}
              disabled={disableValue} onClick={this.sendIdentify}
            >
              {this.state.Sendidentifyingcode}</button>

          </InputItem>
        </div>
        <div className={styles.Nextbotton} >
          <Button
            className={styles.Button}
            onClick={this.next}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>确认</p></Button>
          <p style={{ color: 'rgb(201,201,201)', textAlign: 'center' }}>
            <i className="icon iconfont icon-jinggao" style={{ fontSize: 20, color: 'rgb(201,201,201)' }} />
            <span>修改手机号后,您需要使用新手机号重新登录</span></p>

        </div>
      </div>

    );
  }

    }
function mapStateToProps(state) {
  const { detail = {} } = state.PersonalInfo || {};
  return {
    detail,
  };
}


export default connect(mapStateToProps)(withRouter(ReviseIphoneNumber));
