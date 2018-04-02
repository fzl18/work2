import React from 'react';
import { connect } from 'dva';
import { Modal, Toast, InputItem } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './DetailOrder.less';

class AddFeeModal extends React.Component {

  state={
    actualServiceHours: 0,
  }

  componentWillMount() {
    const { actualServiceHours } = this.props;
    this.setState({
      actualServiceHours,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { actualServiceHours } = nextProps;
    this.setState({
      actualServiceHours,
    });
  }

  submitChangeHour = () => {
    const { actualServiceHours } = this.state;
    this.props.dispatch({
      type: 'MyOrder/modifyWorkingHours',
      payload: {
        projectId: this.props.projectId,
        modifyServiceHours: actualServiceHours,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 2);
          const projectId = this.props.match.params.id;
          this.props.dispatch({ type: 'MyOrder/queryProjectContent', payload: { projectId } });
          this.props.closeChangeHour();
        }
      },
    });
  }

  render() {
    const { actualServiceHours } = this.state;
    return (
      <Modal
        visible={true}
        transparent
        maskClosable={false}
        onClose={() => { this.onClose('modal1'); }}
        title="工时修改"
        footer={[{ text: '取消', onPress: () => { this.props.closeChangeHour(); } }, { text: '确定', onPress: () => { this.submitChangeHour(); } }]}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        <div className={styles.editHour}>
          <InputItem
            value={actualServiceHours}
            extra="h"
            onChange={(val) => {
              if (val && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) {
                if (val === '.') {
                  return '0.';
                }
                return val;
              }
              this.setState({
                actualServiceHours: val,
              });
            }}
          >工时数</InputItem>
          <p style={{ fontSize: '12px' }}>*工时修改后，请重新提交申请支付</p>
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
