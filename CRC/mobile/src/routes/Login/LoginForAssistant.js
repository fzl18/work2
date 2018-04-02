import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { InputItem, Button, Toast } from 'antd-mobile';
import styles from './Login.less';


const pageTitle = '医助登录';


class LoginForAssistant extends React.Component {
  state = {
    userPassword: '',
    userMobile: '',
  }

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }
  Login=() => {
    const { userMobile, userPassword,
      } = this.state;
    if (userMobile == '' || (userMobile && userMobile.trim() == '')) {
      Toast.info('请输入手机号', 1, () => {}, false);
    }
    if (userPassword == '' || (userPassword && userPassword.trim() == '')) {
      Toast.info('请输入登录密码', 1, () => {}, false);
    }
    this.props.dispatch({ type: 'Login/LoginForAssistant',
      payload: { userMobile, userPassword },
      callback: (response) => {
        Toast.info('登录成功', 1, () => {}, false);
        sessionStorage.role = response.role;
        sessionStorage.acctId = response.acctId;
        sessionStorage.openId = response.openId;
        this.props.history.push('/Order/RobNewOrder');
      },
    });
  }
  // Register=() => {
  //   this.props.history.push('/Register/Register');
  // }
  // ForfetPassword=() => {
  //   this.props.history.push('/ForgetPassword');
  // }
  render() {
//     const {
//      htmlText,
//  } = this.props.info;

    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.head} />
        <InputItem
          clear
          placeholder="请输入登录账号"
          onChange={e => this.onStateChange(e, 'userMobile')}
        />
        <InputItem
          type="password"
          placeholder="请输入登录密码"
          clear
          onChange={e => this.onStateChange(e, 'userPassword')}
          // value={password}
          maxLength="20"
        />
        <div className={styles.LoginBotton} >
          <Button
            className={styles.Button}
            onClick={this.Login}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>登录</p></Button>
        </div>
        {/* <p className={styles.ButtonWords}>
            <span style={{ float: 'left', marginLeft: 20 }} onClick={this.Register}>
          <i className="icon iconfont icon-zhuce" />
        点我注册 </span><span style={{ float: 'right', marginRight: 20 }}
         onClick={this.ForfetPassword}><i className="icon iconfont icon-mima" />
        忘记密码</span></p> */}

      </div>

    );
  }

    }

function mapStateToProps(state) {
  const { info = {} } = state.Login || {};
  return {
    info,
  };
}

export default connect(mapStateToProps)(withRouter(LoginForAssistant));
