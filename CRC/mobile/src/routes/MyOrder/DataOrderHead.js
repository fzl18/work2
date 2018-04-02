import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { List } from 'antd-mobile';
import styles from './DataOrderHead.less';

const Item = List.Item;
class DataOrderHead extends React.Component {

  getOrderStatus = (value) => {
    const DoctorMap = {
      GRAB: '等待抢单',
      SERVICE: '等待服务',
      CANCEL: '已取消',
      CANCELLATION: '请求取消中',
      ATTACK: '服务进行中',
      COMPLETION: '服务完成，待提交',
      SUBMISSION: '等待支付',
      PAYMENT: '订单完成，待评价',
      APPRAISAL: '订单完成，已评价',
    };
    const AssistantMap = {
      SERVICE: '等待服务',
      CANCEL: '已取消',
      CANCELLATION: '请求取消中',
      ATTACK: '服务进行中',
      COMPLETION: '服务完成，待提交',
      SUBMISSION: '等待支付',
      PAYMENT: '订单完成，待评价',
      APPRAISAL: '订单完成，已评价',
    };
    const { role } = sessionStorage;
    if (role == 'DOCTOR' || role == 'NOTDOCTOR') {
      return DoctorMap[value.orderStatus];
    } else if (role == 'INSIDE_ASSISTANT' && this.props.type == 'newProjectList') {
      return '等待抢单';
    } else if (role == 'INSIDE_ASSISTANT') {
      if (value.serviceStatus) {
        return AssistantMap[value.serviceStatus];
      } else {
        return '等待抢单';
      }
    }
  }
  getOrderStatusIco= (value) => {
    const DoctorMapIco = {
      GRAB: 'icon-dengdai', // '等待抢单',
      SERVICE: 'icon-cy1', // 等待服务',
      CANCEL: 'icon-quxiaodingdan', // 已取消',
      CANCELLATION: 'icon-dengdai1', // '请求取消中',
      ATTACK: 'icon-jinxingzhong', // 服务进行中',
      COMPLETION: 'icon-wancheng', // 服务完成，待提交',
      SUBMISSION: 'icon-zhifu', // 等待支付',
      PAYMENT: 'icon-xing1', // 订单完成，待评价',
      APPRAISAL: 'icon-xing', // 订单完成，已评价',
    };
    const AssistantMapIco = {
      SERVICE: 'icon-cy1', // '等待服务',
      CANCEL: 'icon-quxiaodingdan', // '服务进行中',
      CANCELLATION: 'icon-dengdai1', // '请求取消中',
      ATTACK: 'icon-jinxingzhong', // '服务进行中',
      COMPLETION: 'icon-wancheng', // '服务完成，待提交',
      SUBMISSION: 'icon-zhifu', // '等待支付',
      PAYMENT: 'icon-xing1', // '订单完成，待评价',
      APPRAISAL: 'icon-xing', // '订单完成，已评价',
    };
    const { role } = sessionStorage;
    if (role == 'DOCTOR' || role == 'NOTDOCTOR') {
      return DoctorMapIco[value.orderStatus];
    } else if (role == 'INSIDE_ASSISTANT' && this.props.type == 'newProjectList') {
      return 'icon-dengdai';// '等待抢单';
    } else if (role == 'INSIDE_ASSISTANT') {
      if (value.serviceStatus) {
        return AssistantMapIco[value.serviceStatus];
      } else {
        return 'icon-dengdai';// '等待抢单';
      }
    }
  }

  render() {
    const { value, history, match } = this.props;
    return (
      <div className={styles.dataOrderHead}>
        <List>
          <Item extra="历史状态" arrow="horizontal" onClick={() => { history.push(`/MyOrder/OrderStatus/${match.params.id}`); }}>
            <i className={`iconfont ${this.getOrderStatusIco(value)}`} style={{ marginRight: '10px' }} />
            {this.getOrderStatus(value)}</Item>
        </List>
      </div>
    );
  }
}

DataOrderHead.propTypes = {

};

export default connect()(withRouter(DataOrderHead));
