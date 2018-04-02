import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Button, WhiteSpace, Toast, Modal } from 'antd-mobile';
import moment from 'moment';
import styles from './OperateOrder.less';
import AddFeeModal from './AddFeeModal';
import ElementAuth from '../../components/ElementAuth';
import MinuteTimer from '../../common/MinuteTimer';

const alert = Modal.alert;
class OperateOrder extends React.Component {

  state={
    showAddFee: false,

  }

  closeAddFee = () => {
    this.setState({
      showAddFee: false,
    });
  }

  copyOrder = (projectId) => {
    this.props.dispatch({
      type: 'MyOrder/anotherProject',
      payload: {
        projectId,
      },
      callback: () => {
        this.props.history.push('/Order/AddOrder');
      },
    });
  }


  agreeCancel = (projectId) => {
    this.props.dispatch({
      type: 'MyOrder/agreeCancelProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: this.props.type } });
        }
        // this.refreshAndShowOrderDetail(response);
      },
    });
  }

  RobOrder= (projectId) => {
    this.props.dispatch({
      type: 'MyOrder/robProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          this.props.history.push('/Order/WaitServiceOrder');
        } else if (response.error) {
          this.props.dispatch({
            type: 'Order/queryNewProject',
            payload: {
            },
          });
        }
      },
    });
  }

  beginWork = (projectId) => {
    this.props.dispatch({
      type: 'MyOrder/attackProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: this.props.type } });
          if (this.props.history.location.pathname == '/Order/WaitServiceOrder') {
            this.props.history.push('/Order/ServicingOrder');
          } else {
            this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: 'ATTACK' } });
            this.props.dispatch({
              type: 'MyOrder/tabIndex',
              payload: {
                listIndex: {
                  index: 2,
                  tab: {
                    icoTyle: 'icon-dingdan2',
                    nodatamsg: '没有服务中的信息',
                    searchType: 'ATTACK',
                    title: '服务中',
                  },
                },
              },
            });
          }
        }
      },
    });
  }

  completeWork = (projectId) => {
    this.props.dispatch({
      type: 'MyOrder/completionProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: this.props.type } });
          this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: 'COMPLETION' } });
          this.props.dispatch({
            type: 'MyOrder/tabIndex',
            payload: {
              listIndex: {
                index: 3,
                tab: {
                  icoTyle:
                  'icon-dingdan2',
                  nodatamsg:
                  '没有待提交的信息',
                  searchType:
                  'COMPLETION',
                  title:
                  '待提交',
                },
              },
            },
          });
          if (this.props.history.location.pathname == '/Order/ServicingOrder') {
            this.props.history.push('/MyOrder/AllOrder');
          }
        }
      },
    });
  }

  submitHour = (projectContent) => {
    alert(`确认提交工时数:${projectContent.modifyServiceHours || projectContent.actualServiceHours || 0}h?`, (<p style={{ fontSize: '12px' }}>*工时提交后，不能再修改</p>), [
      { text: '取消', onPress: () => {} },
      { text: '确定',
        onPress: () => {
          const { projectId } = projectContent;
          this.props.dispatch({
            type: 'MyOrder/submissionProject',
            payload: {
              projectId,
            },
            callback: (response = {}) => {
              if (response.success) {
                Toast.info(response.success, 1, () => {}, false);
                this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: this.props.type } });
                this.props.dispatch({ type: 'MyOrder/queryProject', payload: { searchType: 'SUBMISSION' } });
                this.props.dispatch({
                  type: 'MyOrder/tabIndex',
                  payload: {
                    listIndex: {
                      index: 4,
                      tab: {
                        icoTyle:
                        'icon-dingdan2',
                        nodatamsg:
                        '没有待支付的信息',
                        searchType:
                        'SUBMISSION',
                        title:
                        '待支付',
                      },
                    },
                  },
                });
              }
            },
          });
        } },
    ]);
  }

  render() {
    const operateOrderDatas = this.props.operateOrderDatas;
    const { showAddFee } = this.state;
    const { orderStatus, serviceStatus } = operateOrderDatas;

    const isAssistant = sessionStorage.role == 'INSIDE_ASSISTANT';
    const isDoctor = sessionStorage.role == 'DOCTOR' || sessionStorage.role == 'NOTDOCTOR';
    const BeginWorkBtnShow = isAssistant && serviceStatus == 'SERVICE';// 开始工作
    const completeWorkBtnShow = isAssistant && serviceStatus == 'ATTACK';// 完成工作
    const submitHour = isAssistant && orderStatus == 'COMPLETION';// 工时提交 显示实际
    const showActualInfo = orderStatus == 'SUBMISSION' || orderStatus == 'PAYMENT';// 待支付
    const showPayBtn = orderStatus == 'SUBMISSION' && isDoctor;// 待支付
    const showCopyOrder = (orderStatus == 'PAYMENT' || orderStatus == 'APPRAISAL') && isDoctor;// 再来一单
    const showCommentBtn = (orderStatus == 'PAYMENT' && isDoctor) || (serviceStatus == 'PAYMENT' && isAssistant);// 评价
    const showAgreeCancelBtn = orderStatus == 'CANCELLATION' && isDoctor;// 同意取消订单
    // const showActualPayMoney = (orderStatus == 'PAYMENT' && isDoctor)
    // || (serviceStatus == 'PAYMENT' && isAssistant);// 待评价实际支付金额
    const showTimer = orderStatus == 'ATTACK';// 待服务时间显示

    const { attackTime = null } = operateOrderDatas;
    const second = attackTime ? moment().diff(attackTime, 'seconds') : 0;
    return (
      <div className="clearPrefix">

        <div className={`${styles.operate} clearPrefix`} style={{ padding: '0px 10px 10px 10px' }}>
          <div className={styles.operateDiv}>
            {
                showTimer &&
                <div style={{ float: 'left', color: '#fd8261' }}>
                  <i className="icon iconfont icon-iconfont-daojishi" />&nbsp;
                  <MinuteTimer second={second} />
                </div>
              }
            {
              (submitHour || showActualInfo) &&
                <div style={{ float: 'left', color: '#fd8261', fontSize: '14px' }}>
                  <p>
                  实际{operateOrderDatas.actualServiceHours}小时,
                  &yen;{operateOrderDatas.actualServiceHours * operateOrderDatas.servicePrice}
                  </p>
                  {
                    operateOrderDatas.modifyServiceHours &&
                    operateOrderDatas.modifyServiceHours !== 0 &&
                    <p style={{ lineHeight: '13px' }}>
                      修改为{operateOrderDatas.modifyServiceHours}小时,
                      &yen;{operateOrderDatas.modifyServiceHours * operateOrderDatas.servicePrice}
                    </p>
                  }

                </div>
              }
            {
              operateOrderDatas.projectContract && operateOrderDatas.projectContract.tip ?
                <div style={{ float: 'left', height: '40px', fontSize: '14px' }}>
                  <i className="icon iconfont icon-xiaofei" style={{ marginLeft: '10px', marginRight: '10px', fontSize: '16px' }} />
                  &yen;{operateOrderDatas.projectContract.tip}
                </div>
              :
              null
            }
            {
              showActualInfo ?
                <div style={{ color: '#e70012', fontWeight: '700', fontSize: '18px', float: 'right' }}>
                  &yen;暂无
                </div>
              :
                <div style={{ float: 'right', fontSize: '14px' }}>预计{operateOrderDatas.planServiceHours}小时，&yen;
                {operateOrderDatas.planServiceHours * operateOrderDatas.servicePrice}</div>
            }
          </div>


          <ElementAuth auth="myOrder">
            {
                operateOrderDatas.orderStatus == 'GRAB' ?
                  <div className={styles.operateButton} auth="addFee">
                    <Button
                      className={styles.operateButtonDetail}
                      type="primary"
                      onClick={
                        () => {
                          this.setState({
                            showAddFee: true,
                          });
                        }
                      }
                    >
                      <i className="iconfont icon-xiaofei" style={{ marginRight: '10px' }} />
                加小费</Button>
                  </div>
              :
              null
              }
            {
                !operateOrderDatas.serviceStatus ?
                  <div className={styles.operateButton} auth="RobOrderBtn">
                    <Button
                      className={styles.operateButtonDetail}
                      style={{
                        backgroundColor: '#68bef1',
                        color: '#fff',
                      }}
                      onClick={() => {
                        this.RobOrder(operateOrderDatas.projectId);
                      }}
                    >
                      <i className="iconfont icon-xuqiuqiangdan" style={{ marginRight: '5px' }} />
                立即抢单</Button>
                  </div>
                :
                null
              }
          </ElementAuth>
          {
              BeginWorkBtnShow &&
              <div className={styles.operateButton} auth="RobOrderBtn">
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#89ddab',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.beginWork(operateOrderDatas.projectId);
                  }}
                >
                  <i className="iconfont icon-ai03" style={{ marginRight: '5px' }} />
                    开始工作</Button>
              </div>
            }
          {
              completeWorkBtnShow &&
              <div className={styles.operateButton}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#f49eb7',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.completeWork(operateOrderDatas.projectId);
                  }}
                >
                  <i className="iconfont icon-icon1" style={{ marginRight: '5px' }} />
                    完成工作</Button>
              </div>
            }
          {
              submitHour &&
              <div className={styles.operateButton}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#95a6eb',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.submitHour(operateOrderDatas);
                  }}
                >
                  <i className="iconfont icon-jsontijiao" style={{ marginRight: '5px' }} />
                    工时提交</Button>
              </div>
            }
          {
            showPayBtn &&
              <div className={styles.operateButton}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#f9b552',
                    color: '#fff',
                  }}
                  onClick={() => {
                    location.href = `/MyOrder/DataOrder/${operateOrderDatas.projectId}`;
                    // this.props.history.push(`/MyOrder/DataOrder/${operateOrderDatas.projectId}`);
                  }}
                >
                  <i className="iconfont icon-zhifu7" style={{ marginRight: '5px' }} />
                    &nbsp;去支付&nbsp;</Button>
              </div>
            }
          {
            showAgreeCancelBtn &&
              <div className={styles.operateButton}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#fe8260',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.agreeCancel(operateOrderDatas.projectId);
                  }}
                >
                  <i className="iconfont icon-quxiao" style={{ marginRight: '5px' }} />
                    同意取消</Button>
              </div>
            }
          {
            showCommentBtn &&
              <div className={styles.operateButton} style={{ marginLeft: '10px' }}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#f9b552',
                    color: '#fff',
                    border: '1px solid #e4e4e4',
                  }}
                  onClick={() => {
                    this.props.history.push(`/MyOrder/AddComment/${operateOrderDatas.projectId}`);
                  }}
                >
                  <i className="iconfont icon-xing1" style={{ marginLeft: '8px' }} />
                  &nbsp;&nbsp;&nbsp;评价&nbsp;&nbsp;&nbsp;</Button>
              </div>
            }
          {
            showCopyOrder &&
              <div className={styles.operateButton}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#fff',
                    color: '#f9b552',
                    border: '1px solid #e4e4e4',
                  }}
                  onClick={() => {
                    this.copyOrder(operateOrderDatas.projectId);
                  }}
                >
                  <i className="iconfont icon-zailaiyidan" style={{ marginRight: '5px' }} />
                    再来一单</Button>
              </div>
            }

        </div>


        <WhiteSpace size="lg" />
        {
          showAddFee &&
            <AddFeeModal closeAddFee={this.closeAddFee} projectId={operateOrderDatas.projectId} />
        }


      </div>
    );
  }
}

OperateOrder.propTypes = {
};

export default connect()(withRouter(OperateOrder));
