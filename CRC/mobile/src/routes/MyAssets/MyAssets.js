import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { List, Modal } from 'antd-mobile';
import styles from './MyAssets.less';

const Item = List.Item;
const Brief = Item.Brief;
const pageTitle = '我的资产';
const { role } = sessionStorage;
const alert = Modal.alert;
class MyAssets extends React.Component {
  state = {
  }

  componentDidMount() {
    if ((!sessionStorage.acctId) || (role == 'INSIDE_ASSISTANT')) {
      return;
    }
    this.props.dispatch({ type: 'Register/NowAuditStatus', // 判断审核状态
      payload: {},
      callback: (response) => {
        if (response.success && response.success.auditStatus == 'no_audit') {
          this.props.history.push('/Register/RegisterNext');
          return;
        }
        if ((response.success && response.success.auditStatus == 'audit_pending') || (response.success && response.success.auditStatus == 'audit_failed')) {
          alert('很抱歉', '您的信息还未通过审核，此栏目还无法浏览',
            [{ text: '好的',
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        }
      },
    });
  }
  Recharge=() => {
    location.href = '/WePay/Balance/Recharge';
    // this.props.history.push('/Recharge');
  }
  Withdrawals=() => {
    this.props.history.push('/BalanceWithdrawals');
  }

  render() {
    const { usableBalance, frozenBalance } = this.props.AvailableBalance.account || {};
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.head}>
          <div className={styles.AvailableBalance}>
            <p className={styles.AvailableBalance2}>¥{ usableBalance }</p>
            <span className={styles.font}>可用余额</span></div>
          <div className={styles.FrozenFunds}>
            <p className={styles.FrozenFunds2}>¥{frozenBalance}</p>
            <span className={styles.font}>冻结资金</span></div>
        </div>
        <div style={{ backgroundColor: '#fff', marginTop: 15 }}>
          <List className="my-list">
            <Item className={styles.Action} arrow="horizontal" onClick={this.Recharge}><Brief>余额充值</Brief></Item>
          </List>
          <List className="my-list">
            <Item className={styles.Action} arrow="horizontal" onClick={this.Withdrawals}><Brief>余额提现</Brief></Item>
          </List>
          <List className="my-list">
            <Item
              className={styles.Action}
              arrow="horizontal"
              onClick={() => {
                this.props.history.push('/MyAssets/QueryMyVouchers');
              }}
            ><Brief>我的代金券</Brief></Item>
          </List>
        </div>
      </div>

    );
  }
}


function mapStateToProps(state) {
  const { list = {}, AvailableBalance = {} } = state.PersonalInfo || {};
  return {
    loading: state.loading,
    list,
    AvailableBalance,
  };
}

export default connect(mapStateToProps)(withRouter(MyAssets));
