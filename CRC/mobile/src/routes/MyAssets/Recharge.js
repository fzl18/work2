import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Button, WingBlank, Modal } from 'antd-mobile';
import styles from './Recharge.less';

const pageTitle = '余额充值';
class Recharge extends React.Component {


  state={
    BalanceParameter: [],
    modal1: false,
    PayMoney: '',
  }

  componentWillMount() {
    const { BalanceParameter = [] } = this.props;
    BalanceParameter.map((value, index) => {
      if (index == 0) {
        BalanceParameter[index].checked = true;
      } else {
        BalanceParameter[index].checked = false;
      }
    });
    this.setState({
      BalanceParameter,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { BalanceParameter = [] } = nextProps;
    BalanceParameter.map((value, index) => {
      if (index == 0) {
        BalanceParameter[index].checked = true;
      } else {
        BalanceParameter[index].checked = false;
      }
    });
    this.setState({
      BalanceParameter,
    });
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  AgreementDetail=() => {
    this.props.history.push('/RechargeAgreement');
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
    const { BalanceParameter = [] } = this.state;
    let PayMoney = 0;
    BalanceParameter.map((value) => {
      if (value.checked) {
        PayMoney = value.amount;
      }
    });
    this.setState({
      PayMoney,
    });
  }
  checkSpan = (amountParameterId) => {
    const { BalanceParameter = [] } = this.state;
    BalanceParameter.map((value, index) => {
      if (value.amountParameterId == amountParameterId) {
        BalanceParameter[index].checked = true;
      } else {
        BalanceParameter[index].checked = false;
      }
    });
    this.setState({
      BalanceParameter,
    });
  }
  RechargeDetail =() => {
    this.props.history.push('/RechargeDetail');
  }

  submitCharge = () => {
    const { BalanceParameter = [] } = this.state;
    let amount = 0;
    BalanceParameter.map((value) => {
      if (value.checked) {
        amount = value.amount;
      }
    });
    if (!amount) {
      return;
    }
    this.props.dispatch({
      type: 'MyOrder/generatePrepayId',
      payload: {
        amount,
        channel: 'WEIXIN',
        type: 'DEPOSIT',
      },
      callback: (response = {}) => {
        const requestParams = response.request;
        if (typeof window.WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.callWxPay(requestParams), false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.callWxPay(requestParams));
            document.attachEvent('onWeixinJSBridgeReady', this.callWxPay(requestParams));
          }
        } else {
          this.callWxPay(requestParams);
        }
      },
    });
  }

  callWxPay = (requestParams) => {
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        ...requestParams,
      },
      (res) => {
        // console.log(res);
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          console.log(res);
          // this.props.dispatch({ type: 'MyOrder/wxPayComplete',
          //   payload: {
          //     projectId,
          //   },
          //   callback: (response = {}) => {
          //     this.refreshAndShowOrderDetail(response);
          //   },
          // });
        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      },
  );
  }

  render() {
    const { BalanceParameter } = this.props;
    const { PayMoney } = this.state;
    const { usableBalance } = this.props.AvailableBalance.account || {};
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.head}>
          <div className={styles.Balance}>
            <p className={styles.Balance1}>可用余额</p>
            <p className={styles.Balance2}>¥{usableBalance}</p>
          </div>
          <div style={{ height: 100, textAlign: 'center', width: 325, margin: '0 auto', marginTop: 15, fontSize: 19 }}>
            {
            BalanceParameter.map((value, index) => {
              return (<span
                key={index} onClick={() => {
                  this.checkSpan(value.amountParameterId);
                }} className={value.checked ? styles.fee_spanchecked : styles.fee_span}
              >¥{value.amount}
                {
                value.checked ?
                  <i className="icon iconfont icon-jiaobiao" />
                :
                null
              }
              </span>);
            })
          }
          </div>
        </div>
        <div className={styles.Recharge} >
          <WingBlank>
            <Button onClick={() => { this.submitCharge(); }}>立即充值</Button>
          </WingBlank>
          <Modal
            visible={this.state.modal1}
            transparent
            maskClosable={false}
            className={styles.Pay}
            onClose={this.onClose('modal1')}
            title="支付"
            footer={[{ text: '确认支付', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
          >
            <div style={{ height: 100, color: '#000', fontSize: 15, fontWeight: 600 }}>
              <p>
             药名康德新药开发有限公司
           </p>
              <p className={styles.PayMoney}>¥{PayMoney}</p>
            </div>
          </Modal>
        </div>
        <p className={styles.Agreement} >*点击立即充值，表示您已经同意CRC随心呼平台
          <span className={styles.AgreementDetail} onClick={this.AgreementDetail} >《充值协议》</span></p>
        <p className={styles.RechargeDetail} onClick={this.RechargeDetail}>充值明细</p>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { BalanceParameter = [], AvailableBalance = {} } = state.PersonalInfo || {};
  return {
    BalanceParameter,
    AvailableBalance,
  };
}

export default connect(mapStateToProps)(withRouter(Recharge));
