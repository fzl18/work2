
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { InputItem, Button, Toast } from 'antd-mobile';
import styles from './SetPassword.less';

const pageTitle = '密码设置';


class SetPassword extends React.Component {
  state = {
    newPassword: '',
    SurePassword: '',
    oldPassword: '',
  }

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }


  Sure=() => {
    const { newPassword, SurePassword, oldPassword,
      } = this.state;
    if (oldPassword == '' || (oldPassword && oldPassword.trim() == '')) {
      Toast.info('请输入旧密码', 1, () => {}, false);
      return;
    }
    if (newPassword == '' || (newPassword && newPassword.trim() == '')) {
      Toast.info('请输入新密码', 1, () => {}, false);
      return;
    }
    if (SurePassword == '' || SurePassword == undefined || (SurePassword && SurePassword.trim() == '')) {
      Toast.info('请输入确认密码', 1, () => {}, false);
      return;
    }
    if (newPassword.length < '6') {
      Toast.info('密码过短,建议6~20位', 1, () => {}, false);
      return;
    }
    if (newPassword != SurePassword) {
      Toast.info('新密码和确认密码不一致', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'Setting/modifyUserPassword',
      payload: { newPassword, oldPassword },
      callback: (response) => {
        Toast.info(response.success);
      //   // setTimeout(() => {
        this.props.history.push('/Login');
      //   // }, 1500);
      },
    });
  }


  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                #root{
                  background-color: #f6f6f6;
                 
                }
            `}</style>
        </Helmet>
        <div className={styles.SetPasswordBody}>
          <InputItem
            clear
            placeholder="请输入旧密码"
            type="password"
            maxLength="20"
            onChange={e => this.onStateChange(e, 'oldPassword')}
          />
          <InputItem
            clear
            placeholder="请输入新密码"
            type="password"
            maxLength="20"
            onChange={e => this.onStateChange(e, 'newPassword')}
          />
          <InputItem
            clear
            placeholder="请确认新密码"
            type="password"
            maxLength="20"
            onChange={e => this.onStateChange(e, 'SurePassword')}
          />
        </div>
        <div className={styles.TrueBotton} >
          <Button
            className={styles.Button}
            onClick={this.Sure}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>确认</p></Button>
          <p style={{ color: 'rgb(201,201,201)', textAlign: 'center' }}>
            <i className="icon iconfont icon-jinggao" style={{ color: 'rgb(201,201,201)', fontSize: 20, marginRight: 5 }} />
            修改密码后,您需要使用新密码重新登录</p>

        </div>

      </div>
    );
  }
}
function mapStateToProps(state) {
  const { detail } = state.Setting;
  return {
    detail,
  };
}

export default connect(mapStateToProps)(withRouter(SetPassword));
