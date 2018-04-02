import React from 'react';
import { connect } from 'dva';
import { List, WhiteSpace } from 'antd-mobile';
import Helmet from 'react-helmet';
import ElementAuth from '../../components/ElementAuth';
import styles from './Account.less';

const pageTitle = '帐号信息';
const Item = List.Item;

// function Account({ detail }) {


class Account extends React.Component {

  render() {
  //   const { userName,
  // hospitalizationNumber,
  // userMobile,
  // email,
  // enterprise,
  // departmentName } = detail;
    const { role } = sessionStorage;
    // const { ydataAccountHospitalizationNumber } = this.props.acct.ydataAccount || {};
    const { userCompellation,
    userMobile, userEmail,
    hospitalName,
     departmentLocalName } = (this.props.userInfo.datas && this.props.userInfo.datas[0]) || {};
    const { ydataAccountCompellation,
      ydataAccountHospitalizationNumber,
       ydataAccountUserMobile } = this.props.acct.ydataAccount || {};
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style>
        </Helmet>
        <List className="my-list" style={{ paddingTop: '15px' }}>
          <ElementAuth auth="account">
            { (role == 'PATIENT') ?
              <Item extra={ydataAccountCompellation} auth="name">
                <i
                  className="iconfont icon-iconfontgerenzhongxin"
                  style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                />姓名</Item>
              : <Item extra={userCompellation} auth="name">
                <i
                  className="iconfont icon-iconfontgerenzhongxin"
                  style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                />姓名</Item>
               }
            <Item extra={ydataAccountHospitalizationNumber} auth="patientNo">
              <i
                className="iconfont icon-4shenfenzheng"
                style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
              />住院号</Item>
            { (role == 'PATIENT') ?
              <Item extra={ydataAccountUserMobile} auth="mobile">
                <i
                  className="iconfont icon-shouji"
                  style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                />手机号</Item>
              :
              <Item extra={userMobile} auth="mobile">
                <i
                  className="iconfont icon-shouji"
                  style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                />手机号</Item>
            }
            <Item extra={userEmail} auth="email">
              <i
                className="iconfont icon-youxiang"
                style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
              />邮箱</Item>
            <Item extra={hospitalName} auth="enterprise" className={styles.Account} >
              <i
                className="iconfont icon-iconfontyiyuan"
                style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
              />单位</Item>
            <Item extra={departmentLocalName} auth="department" className={styles.Account}>
              <i
                className="iconfont icon-keshishouyaohuizhen"
                style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
              />部门(科室)</Item>
          </ElementAuth>
        </List>
        <WhiteSpace />
        <WhiteSpace />
      </div>

    );
  }
}
Account.propTypes = {
};

function mapStateToProps(state) {
  const { PersonCentral = {} } = state.MyPanel || {};
  const { acct = {}, userInfo = {} } = PersonCentral;

  return {
    loading: state.loading.models.Account,
    acct,
    userInfo,
  };
}

export default connect(mapStateToProps)(Account);
