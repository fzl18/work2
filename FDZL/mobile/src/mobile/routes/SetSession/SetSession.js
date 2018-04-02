import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { Button, Radio, InputItem, List } from 'antd-mobile';
import styles from './SetSession.less';

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
const pageTitle = '设置session';
const RadioItem = Radio.RadioItem;

class SetSession extends React.Component {
  state = {
    role: 'patient',
    checkedValue: 'PATIENT',
    acctId: '',
    openid: '',
  }


  componentDidMount() {
  }
  onChange = (value) => {
    this.setState({
      checkedValue: value,
    });
  };

  onStateChange = (e, key) => {
    this.setState({
      [key]: e.replace(/ /g, ''),
    });
  }

  // handleClick = () => {
  //   this.customFocusInst.focus();
  // }

  submitBind = () => {
    const { acctId, openid, checkedValue, doctorAccountId, patientAccountId, ChatId } = this.state;
    sessionStorage.acctId = acctId;
    sessionStorage.openid = openid;
    sessionStorage.role = checkedValue;
    sessionStorage.doctorAccountId = doctorAccountId;
    sessionStorage.patientAccountId = patientAccountId;
    sessionStorage.ChatId = ChatId;
    alert('设置成功');
  }

  backToIndex = () => {
    location.href = '/';
  }
  toChat = () => {
    location.href = '/Chat/ChatBox/4';
  }

  render() {
    // const { getFieldProps } = this.props.form;
    const { checkedValue, acctId, openid, doctorAccountId, patientAccountId, ChatId } = this.state;
    const data = [
      { value: 'PATIENT', label: 'PATIENT' },
      { value: 'ASSISTANT', label: 'ASSISTANT' },
      { value: 'DOCTOR', label: 'DOCTOR' },
      { value: 'VISITOR', label: 'VISITOR' },
    ];
    return (
      window.configs.DEV &&
      <div style={{ height: '100%', width: '100%', position: 'absolute' }} >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div>
          <List renderHeader={() => 'SetSession For Developing'}>
            {data.map(i => (
              <RadioItem
                key={i.value} checked={checkedValue === i.value}
                onChange={() => this.onChange(i.value)}
              >
                {i.label}
              </RadioItem>
        ))}
          </List>
        </div>
        <div className={styles.Accountbody} >
          <InputItem
            clear
            placeholder=""
            value={acctId}
            onChange={e => this.onStateChange(e, 'acctId')}
          >AccountId</InputItem>
          <InputItem
            clear
            placeholder=""
            value={openid}
            onChange={e => this.onStateChange(e, 'openid')}
          >OpenId</InputItem>

          <InputItem
            clear
            placeholder=""
            value={doctorAccountId}
            onChange={e => this.onStateChange(e, 'doctorAccountId')}
          >doctorAccountId</InputItem>
          <InputItem
            clear
            placeholder=""
            value={patientAccountId}
            onChange={e => this.onStateChange(e, 'patientAccountId')}
          >patientAccountId</InputItem>
          <InputItem
            clear
            placeholder=""
            value={ChatId}
            onChange={e => this.onStateChange(e, 'ChatId')}
          >ChatId</InputItem>
        </div>

        <div >
          <Button
            className={styles.Button}
            onClick={this.submitBind}
          >
            <p style={{ color: 'white', fontSize: 13 }}>
              <span>设置Session</span></p></Button>
        </div>

        <div >
          <Button
            className={styles.Button}
            onClick={this.backToIndex}
          >
            <p style={{ color: 'white', fontSize: 13 }}>
              <span>回到首页</span></p></Button>
          <Button
            className={styles.Button}
            onClick={this.toChat}
          >
            <p style={{ color: 'white', fontSize: 13 }}>
              <span>到病人聊天</span></p></Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list = {} } = state.SetSession || {};
  return {
    loading: state.loading,
    list,
  };
}

export default connect(mapStateToProps)(SetSession);
