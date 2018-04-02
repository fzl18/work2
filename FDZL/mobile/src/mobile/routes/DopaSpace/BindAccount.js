import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Button, SegmentedControl, InputItem, Toast } from 'antd-mobile';
import styles from './BindAccount.less';

// let countdown = 60;
// function settime(obj) {
//   if (countdown == 0) {
//       obj.removeAttribute('disabled');
//       obj.value = '免费获取验证码';
//       countdown = 60;
//       return;
//     } else {
//       obj.setAttribute('disabled', true);
//       obj.value = '重新发送(' + countdown + ')';
//       countdown--;
//     }
//   setTimeout(() => {
//   settime(obj);
// }
//     , 1000);
// }
const pageTitle = '账号绑定';
const { ADMIN_URL } = window.configs;

class BindAccount extends React.Component {
  state = {
    role: 'patient',
    Sendidentifyingcode: '获取验证码',
    seconds: 60,
    selectedIndex: 0,
    disableValue: false,
    username: '',
    password: '',
    hospitalizationNumber: '',
    patientName: '',
    captchaUrl: `${ADMIN_URL}/user/captcha.do?`,
    _captcha_: '',
    _verifyCode_: '',
  }


  componentDidMount() {
    const _this = this;
    window.history.pushState({
      title: '账号绑定',
      url: '#',
    }, 'title', '#');
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.addEventListener('popstate', () => {
          const pathname = _this.props.history.location.pathname;
          if (pathname.startsWith('/BindAccount')) {
            _this.props.history.push('/');
          }
        });
      }, false);
    });
    // window.addEventListener('popstate', (evt) => {  // popstate监听返回按钮
    //   // window.WeixinJSBridge.call('closeWindow');    // 执行 && document.readyState == 'complete'
    //   if (blockPopstateEvent) {
    //     evt.preventDefault();
    //     evt.stopImmediatePropagation();
    //     return;
    //   }
    //   const pathname = this.props.history.location.pathname;
    //   if (pathname.startsWith('/BindAccount')) {
    //     this.props.history.push('/');
    //   }
    // }, false);
  }

  // componentWillUnmount() {
  //   this.props.history.push('/');
  // }

  onChange = (e) => {
    if (e.nativeEvent.value == '患者用户') {
      this.setState({
        role: 'patient',
        selectedIndex: 0,
      });
    } else if (e.nativeEvent.value == '医生用户') {
      this.setState({
        role: 'doctor',
        selectedIndex: 1,
      });
    }
  }

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }

  // onValueChange = (value) => {
  //   console.log(value);
  // }


  sendIdentify = () => {
    const { _captcha_, username } = this.state;
    if (_captcha_ == '' || _captcha_ == undefined || _captcha_.trim() == '') {
      Toast.info('请先输入图形码');
      return;
    }
    if (username == '' || username == undefined || username.trim() == '') {
      Toast.info('请先输入手机号');
      return;
    }
    this.props.dispatch({ type: 'BindAccount/verifyCode',
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
      },
    });
  }

  captchaCode=() => {
    // const { ADMIN_URL } = window.configs;
    this.setState(State => ({
      captchaUrl: State.captchaUrl + Math.random(),
    }));
  }

  // handleClick = () => {
  //   this.customFocusInst.focus();
  // }

  submitBind = () => {
    const { username, password, selectedIndex, patientName,
       hospitalizationNumber, _verifyCode_, _captcha_ } = this.state;
    const _mobile_ = username;
    console.log(_mobile_);
    if (username == '' || username.trim() == '') {
      Toast.info('请输入手机号');
      return;
    }
    if (_captcha_ == '' || _captcha_ == undefined || _captcha_.trim() == '') {
      Toast.info('请输入图形码');
      return;
    }
    if (_verifyCode_ == '' || _verifyCode_.trim() == '') {
      Toast.info('请输入验证码');
      return;
    }
    if ((password == '' || password.trim() == '') && (selectedIndex == 1)) {
      Toast.info('请输入密码');
      return;
    }
    if ((patientName == '' || patientName.trim() == '') && (selectedIndex == 0)) {
      Toast.info('请输入姓名');
      return;
    }
    if ((hospitalizationNumber == '' || hospitalizationNumber.trim() == '') && (selectedIndex == 0)) {
      Toast.info('请输入住院号');
      return;
    }
    if (selectedIndex == 1) {
      this.props.dispatch({ type: 'BindAccount/bindDoctor',
        payload: { username, password, openid: sessionStorage.getItem('openid'), _verifyCode_, _mobile_ } });
    }
    if (selectedIndex == 0) {
      this.props.dispatch({ type: 'BindAccountPatient/bindpatient',
        payload: { username, patientName, hospitalizationNumber, openid: sessionStorage.getItem('openid'), _verifyCode_, _mobile_ } });
    }
  }

  render() {
    // const { getFieldProps } = this.props.form;
    const { disableValue, selectedIndex, password, captchaUrl } = this.state;
    // const { url } = `${window.configs.ADMIN_URL}/user/captcha.do`;
    return (

      <div style={{ height: '100%', width: '100%', position: 'absolute', maxWidth: 800 }} >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.Accounthead} >
          <SegmentedControl
            onChange={this.onChange}
            selectedIndex={selectedIndex}
            values={['患者用户', '医生用户']}
          />
        </div>

        <div className={styles.Accountbody} >
          <InputItem
            clear
            placeholder=""
            type="phone"
            onChange={e => this.onStateChange(e, 'username')}
          >手机号：</InputItem>
          <InputItem
            placeholder=""
            onChange={e => this.onStateChange(e, '_captcha_')}
            maxLength="6"
          ><span style={{ marginTop: 5, left: 20, position: 'absolute' }}>图形码：</span>
            {/* <p className={styles.identifyingcode2}>图形码</p> */}
            <div className="col-sm-3" id="codeDiv">
              <img
                alt=""
                id="codeImage" style={{ height: 26, width: 95, position: 'absolute', top: 7, right: 15, border: '1px solid #e0d6d6' }}
                src={captchaUrl}
                onClick={this.captchaCode}// url加一个随机数
                // src="http://192.168.10.202:12003/user/captcha.do"
              />
            </div>
            <div className="col-sm-2" style={{ height: 32 }}>
              <label id="captcha-error" style={{ color: 'red', marginTop: 5 }} />
            </div>
          </InputItem>
          <InputItem
            placeholder=""
            onChange={e => this.onStateChange(e, '_verifyCode_')}
            maxLength="6"
          >验证码：<button
            className={styles.identifyingcode}
            disabled={disableValue} onClick={this.sendIdentify}
          >
            {this.state.Sendidentifyingcode}</button>
          </InputItem>
          {
            this.state.role == 'doctor' ?
              <InputItem
                type="password"
                placeholder=""
                clear
                onChange={e => this.onStateChange(e, 'password')}
                value={password}
                maxLength="20"
              >密码：</InputItem>
           :
            null
          }
          {/* TODO: 增加‘姓名’、‘住院号’ InputItem的value属性 */}
          {
            this.state.role == 'patient' ?
              <InputItem
                type="name"
                clear
                placeholder=""
                onChange={e => this.onStateChange(e, 'patientName')}
              > 姓名：</InputItem>
           :
            null
          }
          {
            this.state.role == 'patient' ?
              <InputItem

                clear
                placeholder=""
                onChange={e => this.onStateChange(e, 'hospitalizationNumber')}
              >住院号：</InputItem>
            :
            null
          }

        </div>

        <div className={styles.Accountbotton} >
          <Button
            className={styles.Button}
            onClick={this.submitBind}
          >
            <p style={{ color: 'white', fontSize: 17 }}>绑 <span style={{ marginLeft: '15%' }}> 定</span></p></Button>


        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list = {} } = state.BindAccount || {};
  return {
    loading: state.loading,
    list,
  };
}

export default connect(mapStateToProps)(withRouter(BindAccount));
