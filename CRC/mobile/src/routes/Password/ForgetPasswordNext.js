import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { InputItem, Button, Toast } from 'antd-mobile';
import styles from './ForgetPassword.less';

const pageTitle = '设置密码';
const { userMobile } = sessionStorage;
class ForgetPasswordNext extends React.Component {
  state={
    newPassword: '',
    surePassword: '',
  }

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }
  Sure=() => {
    const { newPassword, surePassword,
      } = this.state;
    if (newPassword == '' || (newPassword && newPassword.trim() == '')) {
      Toast.info('请输入新密码', 1, () => {}, false);
      return;
    }
    if (surePassword == '' || (surePassword && surePassword.trim() == '')) {
      Toast.info('请输入确认密码', 1, () => {}, false);
      return;
    }
    if (newPassword.length < '6') {
      Toast.info('新密码过短,建议6~20位', 1, () => {}, false);
      return;
    }
    if (newPassword != surePassword) {
      Toast.info('新密码和确认密码不一致', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'ForgetPassword/ForgetPasswordNext',
      payload: { newPassword, userMobile },
      callback: (response) => {
        Toast.info(response.success);
        this.props.history.push('/Login');
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
                body,#root{
                    background-color: rgb(240,239,245);
                }
          `}</style>
        </Helmet>
        <div style={{ marginTop: 20 }} >
          <InputItem
            clear
            placeholder="新密码"
            maxLength="20"
            type="password"
            onChange={e => this.onStateChange(e, 'newPassword')}
          />
          <InputItem
            clear
            placeholder="确认密码"
            maxLength="20"
            type="password"
            onChange={e => this.onStateChange(e, 'surePassword')}
          />
        </div>
        <div className={styles.Nextbotton} >
          <Button
            className={styles.Button}
            onClick={this.Sure}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>确定</p></Button>
        </div>

      </div>
    );
  }

     }

function mapStateToProps(state) {
  const { list = {} } = state.ForgetPassword;
  return {
    list,
  };
}

export default connect(mapStateToProps)(withRouter(ForgetPasswordNext));
