import React from 'react';
import { connect } from 'dva';
import { Modal, Toast } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './DetailOrder.less';

class AddFeeModal extends React.Component {

  state={
    FeeParameter: [],
  }

  componentWillMount() {
    const { FeeParameter = [] } = this.props;
    FeeParameter.map((value, index) => {
      if (index == 0) {
        FeeParameter[index].checked = true;
      } else {
        FeeParameter[index].checked = false;
      }
    });
    this.setState({
      FeeParameter,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { FeeParameter = [] } = nextProps;
    FeeParameter.map((value, index) => {
      if (index == 0) {
        FeeParameter[index].checked = true;
      } else {
        FeeParameter[index].checked = false;
      }
    });
    this.setState({
      FeeParameter,
    });
  }

  checkSpan = (amountParameterId) => {
    const { FeeParameter = [] } = this.state;
    FeeParameter.map((value, index) => {
      if (value.amountParameterId == amountParameterId) {
        FeeParameter[index].checked = true;
      } else {
        FeeParameter[index].checked = false;
      }
    });
    this.setState({
      FeeParameter,
    });
  }

  submitAddFee = () => {
    const { FeeParameter = [] } = this.state;
    let tipMoney = 0;
    FeeParameter.map((value) => {
      if (value.checked) {
        tipMoney = value.amount;
      }
    });
    if (!tipMoney) {
      this.props.closeAddFee();
      return;
    }
    this.props.dispatch({
      type: 'MyOrder/addProjectTip',
      payload: {
        projectId: this.props.projectId,
        tipMoney,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          if (this.props.page == 'OrderDetail') {
            const projectId = this.props.match.params.id;
            this.props.dispatch({ type: 'MyOrder/queryProjectContent', payload: { projectId } });
          } else {
            console.log(this.props.history);
            this.props.dispatch({
              type: 'MyOrder/queryProject',
              payload: {
                projectId: this.props.projectId,
                tipMoney,
                searchType: this.props.history.location.pathname == '/Order/WaitRobOrder' ? 'GRAB' : '',
              },
            });
          }
          this.props.closeAddFee();
        } else if (response.more) {
          Modal.alert(
            '', <span className={styles.reset_alert}>{response.more}</span>,
            [{ text: <span className={styles.reset_alert_button}>知道啦</span>,
              onPress: () => {
              } }],
          );
        }
      },
    });
  }

  render() {
    const { FeeParameter } = this.props;
    return (
      <Modal
        visible={true}
        transparent
        maskClosable={false}
        onClose={() => { this.onClose('modal1'); }}
        title="加小费"
        footer={[{ text: '取消', onPress: () => { console.log('ok'); this.props.closeAddFee(); } }, { text: '确定', onPress: () => { this.submitAddFee(); } }]}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        <div style={{ height: 100, overflow: 'scroll' }}>
          {
            FeeParameter.map((value, index) => {
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
