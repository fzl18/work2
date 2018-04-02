import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { Button, Radio, InputItem, List } from 'antd-mobile';
import styles from './SetSession.less';

const pageTitle = '设置session';
const RadioItem = Radio.RadioItem;

class SetSession extends React.Component {
  state = {
    role: '',
    checkedValue: '',
    acctId: '',
    openId: '',
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
    const { acctId, openId,
      checkedValue,
     } = this.state;
    sessionStorage.acctId = acctId;
    sessionStorage.openId = openId;
    sessionStorage.role = checkedValue;
    alert('设置成功');
  }

  backToIndex = () => {
    location.href = '/';
  }

  render() {
    // const { getFieldProps } = this.props.form;
    const { checkedValue, acctId, openId } = this.state;
    const data = [
      { value: 'DOCTOR', label: 'DOCTOR（医生）' },
      { value: 'NOTDOCTOR', label: 'NOTDOCTOR（非医生）' },
      { value: 'INSIDE_ASSISTANT', label: 'INSIDE_ASSISTANT（内部医助）' },
      { value: 'VISITOR', label: 'VISITOR（游客）' },
    ];
    return (

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
            value={openId}
            onChange={e => this.onStateChange(e, 'openId')}
          >OpenId</InputItem>
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
