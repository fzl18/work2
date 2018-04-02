import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Button, WingBlank, InputItem } from 'antd-mobile';
import styles from './BalanceWithdrawals.less';

const pageTitle = '余额提现';
class BalanceWithdrawals extends React.Component {


  state={

  }
  WithdrawalsDetail=() => {
    this.props.history.push('/WithdrawalsDetail');
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.head} onClick={this.handleClick}>
          <div className={styles.Withdrawals}>
            <p className={styles.Withdrawals1}>可提现金额</p>
            <p className={styles.Withdrawals2}>¥20.00</p>
            <p className={styles.Withdrawals3}>全部提现</p>
          </div>
          <InputItem
            clear
            placeholder=""
          >提现金额<span className={styles.Balance} >¥</span></InputItem>
        </div>
        <div className={styles.Recharge} >
          <WingBlank>
            <Button>提现</Button>
          </WingBlank>

        </div>
        <p className={styles.Agreement} >*提现成功后，提现金额将打入微信零钱账户</p>
        <p className={styles.WithdrawalsDetail} onClick={this.WithdrawalsDetail}>提现明细</p>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { Withdrawalsinfo = {} } = state.PersonalInfo || {};
  return {
    loading: state.loading,
    Withdrawalsinfo,
  };
}

export default connect(mapStateToProps)(withRouter(BalanceWithdrawals));
