import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import moment from 'moment';
import { List, WhiteSpace, Steps, Toast, Flex} from 'antd-mobile';
import styles from './OrderStatus.less';
const Item = List.Item;
const Step = Steps.Step;
const dayFormat = 'YYYY-MM-DD HH:mm'
class OrderStatus extends React.Component {
  state = {

  }

  componentWillMount(){
    const projectId = this.props.match.params.id;
    this.props.dispatch({ type: 'MyOrder/queryOrderStatus', payload: { projectId } }); 
 }

  render() {
    let stateTime = {}
    const {OrderStatus}=this.props
    const d = OrderStatus
    stateTime.confirmPaymentTime = d.confirmPaymentTime && moment(d.confirmPaymentTime).format(dayFormat) 
    stateTime.submissionTime = d.submissionTime && moment(d.submissionTime).format(dayFormat)
    stateTime.completionTime = d.completionTime && moment(d.completionTime).format(dayFormat)
    stateTime.attackTime = d.attackTime && moment(d.attackTime).format(dayFormat)
    stateTime.orderSuccessTime = d.orderSuccessTime && moment(d.orderSuccessTime).format(dayFormat)
    stateTime.orderCreateTime = d.orderCreateTime && moment(d.orderCreateTime).format(dayFormat)
    stateTime.projectCancellationTime = d.projectCancellationTime && moment(d.projectCancellationTime).format(dayFormat)
    stateTime.projectCancelTime = d.projectCancelTime && moment(d.projectCancelTime).format(dayFormat)
    stateTime.orderEvaluationTime = d.orderEvaluationTime && moment(d.orderEvaluationTime).format(dayFormat)
    stateTime.serviceEvaluationTime = d.serviceEvaluationTime && moment(d.serviceEvaluationTime).format(dayFormat)
    let paymentType
    switch (d.projectContract && d.projectContract.paymentType) {
      case 'ACCOUNT':
      paymentType = '账户支付'
        break;
      case 'WX':
      paymentType = '微信支付'
        break;
      default:
      paymentType = ''
        break;
    }
    let type,step
    switch (d.processState) {
      case 'CANCEL_NOT_ROB':
          type = 'b'
          break;
      case 'CANCEL_OVER_TIME':
          type = 'c'
          break;
      case 'CANCEL_NORMAL_TIME':
          type = 'd'
          break;
      default :
          type = 'a'
    }    
    if(d && d.orderCreateTime){step = 1}
    if(d && d.orderSuccessTime){step = 2}
    if(d && d.attackTime){step = 3}
    if(d && d.completionTime){step = 4}
    if(d && d.submissionTime){step = 5}
    if(d && d.confirmPaymentTime){step = 6}
    if(d && d.orderEvaluationTime){step = 7}
    if(d && d.serviceEvaluationTime){step = 7}
    let html
    switch (type) {
      case 'a':
      html= d.conductType =="ORDER" ?
      <Steps current={step}>
        <Step icon={<i className='iconfont icon-dian' />} title="订单创建" description={stateTime.orderCreateTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="抢单成功" description={stateTime.orderSuccessTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="开始工作" description={stateTime.attackTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="完成工作" description={stateTime.completionTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="工时提交" description={stateTime.submissionTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="确认支付" description={stateTime.confirmPaymentTime || ''}/>
        <Step status={stateTime.orderEvaluationTime ? '':'wait'} icon={<i className='iconfont icon-dian' />} title="评价医助" description={stateTime.orderEvaluationTime || ''}/> 
      </Steps>
      :<Steps current={step}>
      <Step icon={<i className='iconfont icon-dian' />} title="订单创建" description={stateTime.orderCreateTime || ''}/>
      <Step icon={<i className='iconfont icon-dian' />} title="抢单成功" description={stateTime.orderSuccessTime || ''}/>
      <Step icon={<i className='iconfont icon-dian' />} title="开始工作" description={stateTime.attackTime || ''}/>
      <Step icon={<i className='iconfont icon-dian' />} title="完成工作" description={stateTime.completionTime || ''}/>
      <Step icon={<i className='iconfont icon-dian' />} title="工时提交" description={stateTime.submissionTime || ''}/>
      <Step icon={<i className='iconfont icon-dian' />} title="确认支付" description={stateTime.confirmPaymentTime || ''}/>
      <Step status={stateTime.serviceEvaluationTime ? '':'wait'} icon={<i className='iconfont icon-dian' />} title="评价医助" description={stateTime.serviceEvaluationTime || ''}/>
    </Steps>
    
        break;
      case 'b':
      html=
      <Steps current={2}>
        <Step icon={<i className='iconfont icon-dian' />} title="订单创建" status={!stateTime.orderCreateTime ? 'wait' : ''} description={stateTime.orderCreateTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="订单已取消" status={!stateTime.projectCancelTime ? 'wait' : ''} description={stateTime.projectCancelTime || ''}/>
      </Steps>
        break;
      case 'c':
      html=
      <Steps current={4}>
        <Step icon={<i className='iconfont icon-dian' />} title="订单创建" status={!stateTime.orderCreateTime ? 'wait' : ''} description={stateTime.orderCreateTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="抢单成功" status={!stateTime.orderSuccessTime ? 'wait' : ''} description={stateTime.orderSuccessTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="请求取消订单" status={!stateTime.projectCancellationTime ? 'wait' : ''} description={stateTime.projectCancellationTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="订单已取消" status={!stateTime.projectCancelTime ? 'wait' : ''} description={stateTime.projectCancelTime || ''}/>
      </Steps>
        break;
      case 'd':
      html=
      <Steps current={3}>
        <Step icon={<i className='iconfont icon-dian' />} title="订单创建" status={!stateTime.orderCreateTime ? 'wait' : ''} description={stateTime.orderCreateTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="抢单成功" status={!stateTime.orderSuccessTime ? 'wait' : ''} description={stateTime.orderSuccessTime || ''}/>
        <Step icon={<i className='iconfont icon-dian' />} title="订单已取消" status={!stateTime.projectCancelTime ? 'wait' : ''} description={stateTime.projectCancelTime || ''}/>
      </Steps>
        break;    
      default:
        break;
    }

    console.log(d,type,step)
    return (
    <div className={styles.body}>
      <div className={styles.head}>
        <List className="my-list">
          <Item thumb={<i className="iconfont icon-dingdan " />}>
            订单编号：{OrderStatus.projectCode}<br/>支付方式：{paymentType}
          </Item>
        </List>
      </div>
      <WhiteSpace size="lg" />
      <div className={styles.status}>
        {html}				
      </div>
    </div>
    );
  }
}

function mapStateToProps(state) {
    const { OrderStatus = {} } = state.MyOrder || {};
    return {
      OrderStatus,
    };
  }

export default connect(mapStateToProps)(withRouter(OrderStatus));
