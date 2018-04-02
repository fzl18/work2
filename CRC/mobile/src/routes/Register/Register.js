import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Button, SegmentedControl, InputItem, Toast, Checkbox, Flex } from 'antd-mobile';
// import ElementAuth from '../../components/ElementAuth';
import styles from './Register.less';

const pageTitle = '注册';
const { ADMIN_URL } = window.configs;
const AgreeItem = Checkbox.AgreeItem;

class Register extends React.Component {
  state = {
    Sendidentifyingcode: '获取验证码',
    seconds: 60,
    selectedIndex: 0,
    disableValue: false,
    userMobile: '',
    userPassword: '',
    captchaUrl: `${ADMIN_URL}/user/captcha.do?`,
    _captcha_: '',
    _verifyCode_: '',
    proclaimed: 'password',
    role: 'DOCTOR',
    check: 'false',
    disabled: true,
  }

  onChange = (e) => {
    if (e.nativeEvent.value == '我是医生用户') {
      this.setState({
        role: 'DOCTOR',
        selectedIndex: 0,
      });
    } else if (e.nativeEvent.value == '我是非医生用户') {
      this.setState({
        role: 'NOTDOCTOR',
        selectedIndex: 1,
      });
    }
  }
  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }

  next = () => {
    const { userMobile, userPassword, selectedIndex,
     _verifyCode_, _captcha_, role } = this.state;
    const _mobile_ = userMobile;
    console.log(_mobile_);
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
    if ((userPassword == '' || (userPassword && userPassword.trim() == '')) && (selectedIndex == 1)) {
      Toast.info('请输入密码', 1, () => {}, false);
      return;
    }
    if (userPassword.length < '6') {
      Toast.info('密码过短,建议6~20位', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'Register/checkDoctorRegist',
      payload: { userMobile, userPassword, _verifyCode_, _mobile_, role },
      callback: (response) => {
        sessionStorage.acctId = response && response.ydataAccount.ydataAccountId;
        this.props.history.push('/Register/RegisterNext');
      },
    });
    // sessionStorage.userMobile = userMobile;
    sessionStorage.role = role;
    sessionStorage.selectedIndex = selectedIndex;
    sessionStorage._captcha_ = _captcha_;
    sessionStorage._verifyCode_ = _verifyCode_;
  }
  sendIdentify = () => {
    const { _captcha_, userMobile } = this.state;
    const username = userMobile;
    if (userMobile == '' || userMobile == undefined || (userMobile && userMobile.trim() == '')) {
      Toast.info('请先输入手机号', 1, () => {}, false);
      return;
    }
    if (userMobile.length < '11') {
      Toast.info('请输入正确手机号', 1, () => {}, false);
      return;
    }
    if (_captcha_ == '' || _captcha_ == undefined || (_captcha_ && _captcha_.trim() == '')) {
      Toast.info('请先输入图形码', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'Register/verifyCode',
      payload: { _captcha_, username },
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
  captchaCode=() => {
    // const { ADMIN_URL } = window.configs;
    this.setState(State => ({
      captchaUrl: State.captchaUrl + Math.random(),
    }));
  }
  proclaimed=() => {
    if (this.state.proclaimed == 'password') {
      this.setState({
        proclaimed: '',
      });
    }
    if (this.state.proclaimed == '') {
      this.setState({
        proclaimed: 'password',
      });
    }
  }
  Agreement=() => {
    this.props.history.push('/Register/Agreement');
  }

  render() {
    const { disableValue, selectedIndex,
         captchaUrl, proclaimed, check, disabled } = this.state;
    return (


      <div style={{ height: '100%', width: '100%', position: 'absolute', maxWidth: 800 }} >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.Registerhead} >
          <SegmentedControl
            onChange={this.onChange}
            className={styles.ChooseUser}
            selectedIndex={selectedIndex}
            values={['我是医生用户', '我是非医生用户']}
          />
        </div>
        <div className={styles.Registerbody} >
          <InputItem
            clear
            placeholder="请输入手机号"
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
          <InputItem
            type={proclaimed}
            placeholder="请输入密码"
            clear
            onChange={e => this.onStateChange(e, 'userPassword')}
            // value={password}
            maxLength="20"
          ><a
            className={styles.proclaimed}
            onClick={this.proclaimed}
          ><i className="icon iconfont icon--" style={{ fontSize: 35 }} /></a>
          </InputItem>
        </div>
        <div className={styles.Registerbotton} >
          <Button
            className={styles.Button}
            onClick={this.next}
            disabled={disabled}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>注册</p></Button>
        </div>
        <div className={styles.Agreement}>
          <Flex>
            <Flex.Item>
              <AgreeItem
                data-seed="logId" onClick={() => {
                  if (check == 'true') {
                    this.setState({
                      check: 'false',
                      disabled: true,
                    }); console.log('false');
                  }
                  if (check == 'false') {
                    this.setState({
                      check: 'true',
                      disabled: false,
                    }); console.log('true');
                  }
                }}
              >
            我已阅读并接受 <span style={{ color: 'rgb(254,130,96)', fontSize: 14 }} onClick={this.Agreement}>《CRC随心呼平台服务协议条款》</span>
              </AgreeItem>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { list = {} } = state.Register || {};
  return {
    loading: state.loading,
    list,
  };
}

export default connect(mapStateToProps)(withRouter(Register));
