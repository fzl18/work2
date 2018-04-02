import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { List, WhiteSpace, WingBlank, Button, Toast, Modal, Popover } from 'antd-mobile';
import moment from 'moment';
import styles from './DataOrderDetail.less';
import AddFeeModal from './AddFeeModal';
import ChangeHourModal from './ChangeHour';
import ElementAuth from '../../components/ElementAuth';
import DataOrderHead from './DataOrderHead';
import MinuteTimer from '../../common/MinuteTimer';
import StarRate from '../../common/StarRate';
import BalancePayModal from './BalancePay';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
class DataOrderDetail extends React.Component {

  state={
    showAddFee: false,
    showChangeHour: false,
    showBalancePay: false,
    payWay: 'wePay',
  }


  componentDidMount() {
    const projectId = this.props.match.params.id;
    const { projectContent = {} } = this.props;
    const { payInfo = {} } = projectContent;
    if (Number(payInfo.actualPay) == 0) {
      this.setState({
        payWay: 'balancePay',
      });
    }
    if (this.props.history.location.pathname.startsWith('/MyOrder/DataOrder/fromVoucher') && this.props.projectContent.projectId) {
      return;
    }
    this.props.dispatch({ type: 'MyOrder/queryProjectContent', payload: { projectId } });

    // const { projectContent } = this.props;
    // this.setState({
    //   actualServiceHours: projectContent.actualServiceHours || 0,
    // });
  }

  componentWillReceiveProps(nextProps) {
    const { projectContent = {} } = nextProps;
    const { payInfo = {} } = projectContent;
    if (Number(payInfo.actualPay) == 0) {
      this.setState({
        payWay: 'balancePay',
      });
    }
  }

  callWxPay = (requestParams) => {
    const projectId = this.props.match.params.id;
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        ...requestParams,
      },
      (res) => {
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          this.props.dispatch({ type: 'MyOrder/wxPayComplete',
            payload: {
              projectId,
            },
            callback: (response = {}) => {
              this.refreshAndShowOrderDetail(response);
            },
          });
        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      },
  );
  }

  /**
 * 使用微信内置地图查看位置
 * 1、latitude：     纬度，范围为-90~90，负数表示南纬 必填
 * 2、longitude：    经度，范围为-180~180，负数表示西经 必填
 * 3、scale：        缩放比例，范围1~28，默认为28 选填
 * 4、name：         位置名 选填
 * 5、address：      地址的详细说明 选填
 * 6、cbSuccessFun： 接口调用成功的回调函数 选填
 * 7、cbFailFun：    接口调用失败的回调函数 选填
 * 8、cbCompleteFun：接口调用结束的回调函数（调用成功、失败都会执行） 选填
 */
  openWxMap = (latitude, longitude, scale, name,
  address, cbSuccessFun, cbFailFun, cbCompleteFun) => {
    Toast.loading('地图加载中', 0);
    const openObj = {};
    openObj.latitude = latitude;
    openObj.longitude = longitude;
    openObj.scale = 15;
    if (scale > 0 && scale < 29) {
      openObj.scale = scale;
    }
    if (name) {
      openObj.name = name;
    }
    if (address) {
      openObj.address = address;
    }
    openObj.success = function () {
      if (cbSuccessFun) {
        cbSuccessFun();
      }
      Toast.hide();
    };
    openObj.fail = function (res) {
      if (cbFailFun) {
        cbFailFun();
      } else {
        console.log(`openLocation fail:${res.errMsg}`);
      }
      Toast.hide();
    };
    openObj.complete = function () {
      if (cbCompleteFun) {
        cbCompleteFun();
      }
      Toast.hide();
    };
    window.wx.openLocation(openObj);
  }

  refreshAndShowOrderDetail=(response = {}) => {
    const projectId = this.props.match.params.id;
    if (response.success) {
      Toast.info(response.success, 1, () => {}, false);
      this.props.dispatch({ type: 'MyOrder/queryProjectContent', payload: { projectId } });
    } else if (response.error) {
      this.props.dispatch({ type: 'MyOrder/queryProjectContent', payload: { projectId } });
    }
  }

  closeAddFee = () => {
    this.setState({
      showAddFee: false,
    });
  }


  CancelOrderRob = () => {
    const projectId = this.props.match.params.id;

    alert('确定取消该订单？', null, [
      { text: '取消', onPress: () => {} },
      { text: '确定',
        onPress: () => {
          this.props.dispatch({
            type: 'MyOrder/cancelNotRobProject',
            payload: {
              projectId,
              date: '',
            },
            callback: (response = {}) => {
              this.refreshAndShowOrderDetail(response);
            },
          });
        } },
    ]);
  }

  CancelOrderService = () => {
    this.cancelWaitingService();
  }

  cancelWaitingService = () => {
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/hintCancelProject',
      payload: { projectId },
      callback: (response) => {
        if (response.success) {
          alert(response.success, '', [
            { text: '取消', onPress: () => {} },
            { text: '确定',
              onPress: () => {
                this.props.dispatch({
                  type: 'MyOrder/cancelServiceProject',
                  payload: {
                    projectId,
                    date: response.date,
                  },
                  callback: (response1 = {}) => {
                    this.refreshAndShowOrderDetail(response1);
                  },
                });
              } },
          ]);
        } else if (response.error) {
          Toast.info(response.error, 2);
        }
      },
    });
  }

  // 医助操作

  RobOrder= () => {
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/robProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          this.refreshAndShowOrderDetail(response);
        } else if (response.error) {
          this.props.history.push('/Order/RobNewOrder');
        }
      },
    });
  }

  beginWork = () => {
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/attackProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        this.refreshAndShowOrderDetail(response);
      },
    });
  }

  completeWork = () => {
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/completionProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        this.refreshAndShowOrderDetail(response);
      },
    });
  }

  submitHour = () => {
    const { projectContent } = this.props;
    alert(`确认提交工时数:${projectContent.modifyServiceHours || projectContent.actualServiceHours || 0}h?`, (<p style={{ fontSize: '12px' }}>*工时提交后，不能再修改</p>), [
      { text: '取消', onPress: () => {} },
      { text: '确定',
        onPress: () => {
          const projectId = this.props.match.params.id;
          this.props.dispatch({
            type: 'MyOrder/submissionProject',
            payload: {
              projectId,
            },
            callback: (response = {}) => {
              this.refreshAndShowOrderDetail(response);
            },
          });
        } },
    ]);
  }

  agreeCancel = () => {
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/agreeCancelProject',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        this.refreshAndShowOrderDetail(response);
      },
    });
  }


  submitPay = () => {
    const projectId = this.props.match.params.id;
    const { payWay } = this.state;
    if (payWay == 'balancePay') {
      this.setState({
        showBalancePay: true,
      });
    }
    if (payWay == 'wePay') {
      this.props.dispatch({
        type: 'MyOrder/generatePrepayId',
        payload: {
          projectId,
          channel: 'WEIXIN',
          type: 'PAY',
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
    // this.props.dispatch({
    //   type: 'MyOrder/paymentProject',
    //   payload: {
    //     projectId,
    //   },
    //   callback: (response = {}) => {
    //     this.refreshAndShowOrderDetail(response);
    //   },
    // });
  }

  assCancelService = () => {
    this.cancelWaitingService();
  }

  changeManHour = () => {
    this.setState({
      showChangeHour: true,
    });
  }

  closeChangeManHour = () => {
    this.setState({
      showChangeHour: false,
    });
  }

  selectPayWay = (payWay) => {
    this.setState({
      payWay,
    });
  }

  changeShowBalancePay = () => {
    this.setState({
      showBalancePay: !this.state.showBalancePay,
    });
  }

  render() {
    const { projectContent } = this.props;
    const { payInfo } = projectContent;
    const { showAddFee, showChangeHour, showBalancePay, payWay } = this.state;
    const { role } = sessionStorage;
    const { orderStatus, serviceStatus, projectAppraisals = [] } = projectContent;
    const isAssistant = sessionStorage.role == 'INSIDE_ASSISTANT';
    const isDoctor = sessionStorage.role == 'DOCTOR' || sessionStorage.role == 'NOTDOCTOR';
    const AddFeeBtnShow = (role == 'DOCTOR' || role == 'NOTDOCTOR') && orderStatus == 'GRAB';// 加小费按钮
    const CancelOrderBtnShow = (role == 'DOCTOR' || role == 'NOTDOCTOR') && orderStatus == 'GRAB';// 待抢单取消按钮
    const WaitingServerCancelBtn = (role == 'DOCTOR' || role == 'NOTDOCTOR') && orderStatus == 'SERVICE';// 待服务取消按钮
    const showActualInfo = orderStatus == 'SUBMISSION';
    const showPayBtn = orderStatus == 'SUBMISSION' && isDoctor;

    const showTimer = orderStatus == 'ATTACK';
    const showCommentBtn = (orderStatus == 'PAYMENT' && isDoctor) || (serviceStatus == 'PAYMENT' && isAssistant);// 评价
    const showCommentDetail = (orderStatus == 'APPRAISAL' && isDoctor) || (serviceStatus == 'APPRAISAL' && isAssistant);// 显示评价
    const showAgreeCancelBtn = orderStatus == 'CANCELLATION' && isDoctor;// 同意取消订单

    const BeginWorkBtnShow = isAssistant && serviceStatus == 'SERVICE';// 开始工作,待服务订单取消
    const completeWorkBtnShow = isAssistant && serviceStatus == 'ATTACK';// 完成工作
    const submitHour = isAssistant && orderStatus == 'COMPLETION';// 工时提交 显示实际

    const { attackTime = moment() } = projectContent;
    const second = moment().diff(attackTime, 'seconds');
    return (
      <div style={{ paddingBottom: showPayBtn ? '44px' : '0px', display: projectContent.projectId ? 'block' : 'none' }}>
        <DataOrderHead value={projectContent} />
        {
          showTimer &&
          <div className={styles.timer}>
            <MinuteTimer second={second} />
          </div>
        }
        {
          (submitHour || showActualInfo) &&
          <div className={styles.submit_hour}>
            <p className={styles.actual_data}>实际
              {(projectContent.modifyServiceHours && projectContent.modifyServiceHours.toString())
              || projectContent.actualServiceHours}
              小时,
              &yen;
              {((projectContent.modifyServiceHours && projectContent.modifyServiceHours.toString())
              || projectContent.actualServiceHours)
              * projectContent.servicePrice}
            </p>
            <p className={styles.time_range}>
              {moment(projectContent.attackTime).format('YYYY-MM-DD HH:mm')}~{moment(projectContent.completionTime).format('YYYY-MM-DD HH:mm')}
            </p>
            {
              orderStatus != 'SUBMISSION' &&
              <i className="iconfont icon-xiugai07" />
            }
            {
              orderStatus != 'SUBMISSION' &&
              <div
                className={styles.edit} onClick={() => {
                  this.changeManHour();
                }}
              />
            }

          </div>
        }
        <div className={styles.detailOrder} style={{ marginTop: showTimer ? '0px' : '15px' }}>
          <List className="my-list">
            <Item
              wrap
              className={styles.detailOrderTitle}
              multipleLine
              style={{ wordBreak: 'break-word' }}
            >
              <i className="iconfont icon-project" style={{ marginRight: '10px' }} />
              {projectContent.projectTitle}
              {
                <Popover
                  visible={this.state.visible}
                  placement="bottomRight"
                  overlay={[
                        (<Item wrap>{projectContent.projectTypeName}</Item>),
                  ]}
                >
                  <i className={`icon iconfont icon-jinggao ${styles.reset_ico_size}`} />
                </Popover>
              }
            </Item>
            <Item
              wrap
              extra={`¥${projectContent.servicePrice || ''}/小时`}
              className={styles.detailName}
            >
              <i className="icon iconfont icon-wenjian" style={{ marginRight: '10px' }} />
              {projectContent.projectContract && projectContent.projectContract.jobTypeNames}</Item>
            <Item
              wrap
              className={styles.detailName}
            >
              <i className="iconfont icon-ren" style={{ marginRight: '10px' }} />
            人员要求：{projectContent.serviceStaffType
            && projectContent.serviceStaffType.serviceStaffTypeName}</Item>
            <Item
              wrap
              className={styles.detailName}
            >
              <i className="iconfont icon-shalou" style={{ marginRight: '10px' }} />
              {moment(projectContent.serviceTime).format('YYYY-MM-DD HH:mm')}~
                  {moment(projectContent.serviceTime).add('hours', projectContent.planServiceHours).format('YYYY-MM-DD HH:mm')}</Item>
            <Item
              wrap
              className={styles.detailName}
              arrow="horizontal"
              onClick={() => {
                if (projectContent.commonPlace && projectContent.commonPlace.latitude
                && projectContent.commonPlace.longitude) {
                  // 打开微信地图
                  this.openWxMap(
                    projectContent.commonPlace.latitude,
                    projectContent.commonPlace.longitude,
                    28,
                    projectContent.commonPlace.detailAddress,
                  );
                }
              }}
            >
              <i className="iconfont icon-weizhi" style={{ marginRight: '10px' }} />
              {projectContent.commonPlace && (projectContent.commonPlace.provinceName || '') + (projectContent.commonPlace.cityName || '') + (projectContent.commonPlace.districtName || '') + (projectContent.commonPlace.detailAddress || '')}
            </Item>
            <Item
              wrap
              className={styles.detailName}
              arrow="horizontal"
              onClick={() => {
                if (projectContent.commonPlace && projectContent.commonPlace.contactPhone) {
                  window.location.href = `tel:${projectContent.commonPlace.contactPhone}`;
                }
              }}
            >
              <i className="iconfont icon-dianhuaben-kongxin" style={{ marginRight: '10px' }} />
              {projectContent.commonPlace && projectContent.commonPlace.contactPerson}
              ({projectContent.commonPlace && projectContent.commonPlace.contactPhone})</Item>
          </List>
          {/* <div className={styles.operate} style={{ height: '80px' }}>
          <Item
            wrap
            className={styles.detailName}
            arrow="horizontal"
            onClick={() => {
              if (projectContent.commonPlace &&
              projectContent.commonPlace.latitude && projectContent.commonPlace.longitude) {
                //打开微信地图
                this.openWxMap(
                  projectContent.commonPlace.latitude,
                  projectContent.commonPlace.longitude,
                  28,
                  projectContent.commonPlace.detailAddress
                )
              }
            }}
          >
            <i className="iconfont icon-weizhi" style={{ marginRight: '10px' }} />
            {projectContent.commonPlace &&
            (projectContent.commonPlace.provinceName || '') +
            (projectContent.commonPlace.cityName || '') +
            (projectContent.commonPlace.districtName || '') +
            (projectContent.commonPlace.detailAddress || '')}
          </Item>
          <Item
            wrap
            className={styles.detailName}
            arrow="horizontal"
            onClick={() => {
              if (projectContent.commonPlace && projectContent.commonPlace.contactPhone) {
                window.location.href = `tel:${projectContent.commonPlace.contactPhone}`;
              }
            }}
          >
            <i className="iconfont icon-dianhuaben-kongxin" style={{ marginRight: '10px' }} />
            {projectContent.commonPlace && projectContent.commonPlace.contactPerson}</Item>
        </List>
        {/* <div className={styles.operate} style={{ height: '80px' }}>
          <div className={styles.operateDiv}>
            <div style={{ textAlign: 'center' }}>预计2小时，&yen;400</div>
            <div style={{ textAlign: 'center' }}>
              <i className="icon iconfont icon-xiaofei" style={{ marginLeft: '10px' }} />
                &yen;400
            </div>
          </div>
        </div> */}

          <div className={styles.operate} style={{ height: '80px' }}>
            <div className={styles.operateDiv}>
              <div style={{ textAlign: 'center', lineHeight: projectContent.projectContract && projectContent.projectContract.tip ? '30px' : '60px' }}>预计{projectContent.planServiceHours}小时，&yen;{(projectContent.planServiceHours * projectContent.servicePrice).toFixed(2)}</div>
              {
                projectContent.projectContract && projectContent.projectContract.tip &&
                <div style={{ textAlign: 'center', lineHeight: '30px' }}><i className="icon iconfont icon-xiaofei" />&yen;{projectContent.projectContract.tip}</div>
              }
            </div>
          </div>
          <WhiteSpace size="lg" />
          {
            showPayBtn &&
            <div>
              <List className={styles.daijinquan}>
                <Item
                  extra={(<span style={{ color: '#a0a0a0', fontSize: '14px' }}>{!payInfo.hasUsableVoucher && '暂无可用代金券'}{payInfo.reserveVoucher}</span>)} arrow="horizontal" onClick={() => {
                  // if(){}//@todo如果有代金券
                    if (payInfo.hasUsableVoucher) {
                      this.props.history.push(`/MyOrder/SelectVoucher/${projectContent.projectId}`);
                    }
                  }}
                >代金券</Item>
                <Item className={styles.noBorderItem} style={{ minHeight: '32px' }} extra={(<span style={{ color: '#535353' }}>&yen;{payInfo.projectAmount}</span>)}>订单金额</Item>
                <Item className={styles.noBorderItem} style={{ minHeight: '32px' }} extra={(<span style={{ color: '#535353' }}>-&yen;{payInfo.preferentialAmount}</span>)}>优惠金额</Item>
                <Item className={styles.noBorderItem} style={{ minHeight: '32px' }} extra={(<span style={{ color: '#535353' }}>-&yen;{payInfo.deductionAmount}</span>)}>抵扣金额</Item>
                <Item className={styles.noBorderItem} style={{ minHeight: '32px' }} extra={(<span style={{ color: '#535353' }}>+&yen;{payInfo.tip}</span>)}>小费</Item>
                <Item extra={(<span style={{ color: '#000', fontWeight: 'bold' }}>&yen;{payInfo.actualPay}</span>)}><span style={{ fontWeight: 'bold' }}>应付金额</span></Item>
              </List>
              <WhiteSpace size="lg" />
            </div>
          }
          {
            showPayBtn &&
            <div>
              <List>
                <Item>选择支付方式</Item>
                <Item
                  onClick={() => {
                    if (Number(payInfo.actualPay) == 0) {
                      return;
                    }
                    this.selectPayWay('wePay');
                  }} extra={Number(payInfo.actualPay) != 0 && (<span><i className="iconfont icon-gou" style={{ color: payWay == 'wePay' ? '#2784e1' : '#8a8a8a', fontSize: '20px' }} /></span>)}
                ><span><i className="iconfont icon-weixinzhifu" style={{ color: '#25af42', marginLeft: '2px' }} /> 微信支付</span></Item>
                <Item
                  className={styles.selectBalancePay} onClick={() => {
                    if (Number(payInfo.actualPay) > Number(payInfo.balance)) {
                      return;
                    }
                    this.selectPayWay('balancePay');
                  }} extra={Number(payInfo.actualPay) <= Number(payInfo.balance) && (<span><i className="iconfont icon-gou" style={{ color: payWay == 'balancePay' ? '#2784e1' : '#8a8a8a', fontSize: '20px' }} /></span>)}
                ><span><i className="iconfont icon-yue1-copy" style={{ color: '#25af42', fontSize: '18px' }} /> 余额支付<span style={{ color: '#a0a0a0', fontSize: '12px' }}>(可用余额&yen;{payInfo.balance})</span></span></Item>
              </List>
              <WhiteSpace size="lg" />
            </div>
          }

          {
            isAssistant &&
            <div>
              <List>
                <Item
                  wrap
                  multipleLine
                  className={styles.doctorContact}
                  thumb={(<i className="iconfont icon-yisheng" />)}
                  extra={(<i className="iconfont icon-dianhua" style={{ marginRight: '15px' }} />)}
                  onClick={() => {
                    if (projectContent.orderMobile) {
                      window.location.href = `tel:${projectContent.orderMobile}`;
                    }
                  }}
                >
                  {projectContent.orderCompellation}
                  <Brief>{projectContent.orderPosition}</Brief>
                </Item>
              </List>
            </div>
          }
          {
            isDoctor && projectContent.orderStatus != 'GRAB' && projectContent.serviceCompellation != null &&
            <div>
              <List>
                <Item
                  wrap
                  multipleLine
                  className={styles.doctorContact}
                  thumb={(<i className="iconfont icon-kefu" />)}
                  extra={(<i className="iconfont icon-dianhua" style={{ marginRight: '15px' }} />)}
                  onClick={() => {
                    if (projectContent.orderMobile) {
                      window.location.href = `tel:${projectContent.serviceMobile}`;
                    }
                  }}
                >
                  {projectContent.serviceCompellation}
                </Item>
              </List>

            </div>
          }
          {
            showCommentDetail &&
            <div style={{ backgroundColor: '#fff', padding: '15px 0px' }}>
              {projectAppraisals.map(type =>
                <div className={styles.starDiv} key={type.evaluationTypeId}>
                  <p className={styles.starInfo}>
                    {type.evaluationTypeName}
                  </p>
                  <p className={styles.stars}>
                    <StarRate
                      count={5} value={type.evaluationScore}
                      disabled={true}
                    />
                  </p>
                </div>,
            )
            }
            </div>
          }
          <WhiteSpace auth="doctorContact" size="lg" />
          {/* <ElementAuth auth="myOrder">

            <WhiteSpace auth="doctorContact" size="lg" />
          </ElementAuth> */}
          <WingBlank size="lg">
            {
              !projectContent.projectTypeName ||
              (projectContent.serviceAccountId == sessionStorage.acctId) || !isAssistant || projectContent.orderStatus != 'GRAB' ?
              null
              :
              <ElementAuth auth="myOrder">
                <span>

                  <Button
                    auth="RobOrder"
                    style={{
                      backgroundColor: '#68bef1',
                      color: '#fff',
                    }}
                    onClick={() => {
                      this.RobOrder();
                    }}
                    disabled={projectContent.serviceStatus}
                  >
                    {
                projectContent.serviceStatus ?
                '下手太慢，该任务已被抢走啦'
                :
                '立即抢单'
              }
                  </Button>
                </span>
              </ElementAuth>
            }

            {
            AddFeeBtnShow &&
            <Button
              style={{
                backgroundColor: '#fe8260',
                color: '#fff',
              }}
              onClick={
                () => {
                  this.setState({
                    showAddFee: true,
                  });
                }
              }
            >
              加小费
            </Button>
          }
            {
              CancelOrderBtnShow && <WhiteSpace size="lg" />
            }
            {
            CancelOrderBtnShow &&
            <Button
              style={{
                backgroundColor: '#d1c7c6',
                color: '#fff',
              }}
              onClick={() => {
                this.CancelOrderRob();
              }}
            >
              取消订单
            </Button>
          }
            {
            WaitingServerCancelBtn &&
            <Button
              style={{
                backgroundColor: '#f05c68',
                color: '#fff',
              }}
              onClick={() => {
                this.CancelOrderService();
              }}
            >
              取消订单
            </Button>
          }


            {/* 医助操作按钮 */}
            {
              BeginWorkBtnShow &&
              <span>
                <Button
                  style={{
                    backgroundColor: '#89ddab',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.beginWork();
                  }}
                >
                开始工作
              </Button>
                <WhiteSpace />
                <Button
                  style={{
                    backgroundColor: '#f05c68',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.assCancelService();
                  }}
                >
                取消订单
              </Button>
              </span>
            }
            {
              completeWorkBtnShow &&
                <Button
                  style={{
                    backgroundColor: '#f49eb7',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.completeWork();
                  }}
                >
                完成工作
              </Button>
            }
            {
              submitHour &&
                <Button
                  style={{
                    backgroundColor: '#95a6eb',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.submitHour();
                  }}
                >
                工时提交申请支付
              </Button>
            }
            {
              showCommentBtn &&
                <Button
                  style={{
                    backgroundColor: '#f9b552',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.props.history.push(`/MyOrder/AddComment/${projectContent.projectId}`);
                  }}
                >
                评价
              </Button>
            }
            {
              showAgreeCancelBtn &&
                <Button
                  style={{
                    backgroundColor: '#fe8260',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.agreeCancel();
                  }}
                >
                同意取消
              </Button>
            }

          </WingBlank>
        </div>
        {
          showAddFee ?
            <AddFeeModal page="OrderDetail" closeAddFee={this.closeAddFee} projectId={projectContent.projectId} />
          :
          null
        }
        {
          showChangeHour ?
            <ChangeHourModal page="OrderDetail" closeChangeHour={this.closeChangeManHour} actualServiceHours={projectContent.modifyServiceHours || projectContent.actualServiceHours || 0} projectId={projectContent.projectId} />
          :
          null
        }
        {
          showPayBtn ?
            <div className={styles.pay_bar}>
              <span style={{ color: '#e70012', fontWeight: '700', fontSize: '18px', lineHeight: '60px', marginLeft: '15px' }}>¥{payInfo.actualPay}</span>
              <div className={styles.operateButton} style={{ width: '90px', float: 'right', marginTop: '14px', marginRight: '15px' }}>
                <Button
                  className={styles.operateButtonDetail}
                  style={{
                    backgroundColor: '#f9b552',
                    color: '#fff',
                  }}
                  onClick={() => {
                    this.submitPay();
                  }}
                >
                  <i className="iconfont icon-zhifu7" style={{ marginRight: '5px' }} />
                  确认支付</Button>
              </div>
            </div>
          :
          null
        }
        <WhiteSpace />
        {
          showBalancePay ?
            <BalancePayModal
              price={payInfo.actualPay}
              showBalancePay={showBalancePay}
              changeShowBalancePay={this.changeShowBalancePay}
            />
          :
          null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectContent = {} } = state.MyOrder || {};
  return {
    projectContent,
  };
}

export default connect(mapStateToProps)(withRouter(DataOrderDetail));
