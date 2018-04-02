import React from 'react';
import { connect } from 'dva';
import { Modal, Button, InputItem, Toast } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './DetailOrder.less';

class AddFeeModal extends React.Component {

  state={
    secret: '',
  }

  componentWillMount() {
    // const { FeeParameter = [] } = this.props;
    // FeeParameter.map((value, index) => {
    //   if (index == 0) {
    //     FeeParameter[index].checked = true;
    //   } else {
    //     FeeParameter[index].checked = false;
    //   }
    // });
    // this.setState({
    //   FeeParameter,
    // });
  }

  componentWillReceiveProps() {
    // const { FeeParameter = [] } = nextProps;
    // FeeParameter.map((value, index) => {
    //   if (index == 0) {
    //     FeeParameter[index].checked = true;
    //   } else {
    //     FeeParameter[index].checked = false;
    //   }
    // });
    // this.setState({
    //   FeeParameter,
    // });
  }

  handleSecretChange = (secret) => {
    this.setState({
      secret,
    });
  }

  submitPay = () => {
    const projectId = this.props.match.params.id;
    const { secret } = this.state;
    this.props.dispatch({
      type: 'MyOrder/balancePay',
      payload: {
        projectId,
        password: secret,
      },
      callback: (response = {}) => {
        if (response.result == 'OK') {
          Toast.info('余额支付成功', 1, () => {}, false);
          this.props.history.push(`/MyOrder/PaySuccess/${projectId}`);
          // this.props.closeSubmitPay();
        }
      },
    });
  }

  render() {
    const { secret } = this.state;
    const { price, showBalancePay } = this.props;
    return (
      <Modal
        visible={showBalancePay}
        transparent
        maskClosable={false}
        // onClose={() => { this.onClose('modal1'); }}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        <div>
          <div className={styles.payTitle}>
            <div
              className={styles.closeWrap}
              onClick={() => { this.props.changeShowBalancePay(); }}
            >
              <span className={styles.close} />
            </div>
            余额支付
          </div>
          <div className={styles.payMoney}>
          &yen;{price}
          </div>
          <div className={styles.password}>
            <InputItem
              type="password"
              placeholder="请输入登录密码验证"
              onChange={value => this.handleSecretChange(value)}
              style={{ textAlign: 'center' }}
            />
          </div>
          <Button
            style={{
              backgroundColor: secret == '' ? '#ccc' : '#68bef1',
              color: '#fff',
            }}
            onClick={() => {
              this.submitPay();
            }}
            disabled={secret == ''}
          >
          确认支付
          </Button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { FeeParameter = [] } = state.MyOrder || {};
  return {
    FeeParameter,
  };
}

export default connect(mapStateToProps)(withRouter(AddFeeModal));
