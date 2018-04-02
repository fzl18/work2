import React from 'react';
import { connect } from 'dva';
import { List, InputItem, WingBlank, Button, WhiteSpace, Modal, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Helmet from 'react-helmet';
import ElementAuth from '../../components/ElementAuth';
import styles from './MyPanel.less';

const alert = Modal.alert;
const pageTitle = '修改密码';


class Pwd extends React.Component {

  state = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }


  updatePwd=() => {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    if (oldPassword == '' || oldPassword.trim() == '') {
      Toast.info('请输入密码');
      return;
    }
    if (newPassword == '' || newPassword.trim() == '') {
      Toast.info('请输入新密码');
      return;
    }
    if (newPassword.length < '6') {
      Toast.info('新密码过短,建议6~20位');
      return;
    }

    if (confirmPassword == '' || confirmPassword.trim() == '') {
      Toast.info('请输入确认密码');
      return;
    }
    if (confirmPassword != newPassword) {
      Toast.info('新密码和确认密码不一致');
      return;
    }
    if (oldPassword == newPassword) {
      Toast.info('旧密码和新密码不能相同');
      return;
    }
    this.props.dispatch({ type: 'MyPanel/pwd', payload: { oldPassword, newPassword } });
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
        <ElementAuth auth="pwd">
          <div className={styles.sub_title} style={{ color: '#535353;' }}>
            <i
              className="iconfont icon-tishi"
              style={{ color: '#535353', fontSize: 24, marginRight: '10px' }}
            />修改密码后,请使用新密码登陆</div>
          <List>
            <InputItem
              type="password"
              placeholder="旧密码"
              maxLength="20"
              clear
              onChange={e => this.onStateChange(e, 'oldPassword')}
            />
            <InputItem
              type="password"
              placeholder="新密码"
              maxLength="20"
              clear
              onChange={e => this.onStateChange(e, 'newPassword')}
            />
            <InputItem
              type="password"
              placeholder="确认密码"
              maxLength="20"
              clear
              onChange={e => this.onStateChange(e, 'confirmPassword')}
            />
          </List>
          <WhiteSpace />
          <WingBlank>
            <Button
              className="btn-config"
              // icon="check-circle-o"
              style={{ marginTop: 30 }}
              onClick={() => alert('提示', '确定修改密码?', [
          { text: '确定', onPress: () => { this.updatePwd(); } },
          { text: '取消', onPress: () => console.log('cancel') },
              ])}
            ><span style={{ marginRight: 20 }}>确</span>认</Button>
          </WingBlank>
        </ElementAuth>
      </div>

    );
  }
}

Pwd.propTypes = {
};

function mapStateToProps(state) {
  const { detail } = state.MyPanel;
  return {
    loading: state.loading.models.MyPanel,
    detail,
  };
}
const PwdWrapper = createForm()(Pwd);
export default connect(mapStateToProps)(PwdWrapper);
