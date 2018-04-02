import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { Prompt } from 'react-router-dom';
import API_URL from '../../common/url';
import { Steps, Row, Col, Popconfirm, Checkbox, Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config,uploadser} from '../common/config'
import './style.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD HH:mm'


export default class Detail extends React.Component {
    state={
        isEdit:false,
        editId:'',
        isSaved:false,
        orderStep:0,
        orderStepType:'a',
        stateTime:{},
        orderInfo:{},
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.questionConductType ? values.questionConductType = values.questionConductType.join(';') : values.questionConductType
            this.save(values)
          }
        });
      }

      queryHistoryState=(id)=>{
        const options ={
            method: 'POST',
            url: API_URL.serive.queryHistoryState,
            data: {
                projectId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const {stateTime} = this.state
                    const d = data && data.project || {}
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
                    this.setState({
                        stateTime
                    });
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
                    this.setState({
                        orderStepType: type,
                    });

                    if(d.serviceEvaluationTime){
                        step = 7
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.orderEvaluationTime){
                        step = 6
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.confirmPaymentTime){
                        step = 5
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.submissionTime){
                        step = 4
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.completionTime){
                        step = 3
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.attackTime){
                        step = 2
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.orderSuccessTime){
                        step = 1
                        this.setState({
                            orderStep:step
                        });
                        return
                    }else if(d.orderCreateTime){
                        step = 0
                        this.setState({
                            orderStep:step
                        });
                        return
                    }
                    
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)    
      }

      loadInfo = (id) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url:API_URL.serive.queryProjectContent,
            data: {
                projectId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    this.setState({orderInfo:data.project || {}})
                } else {
                    Modal.error({ title: data.error});
                }            
            }
        }
        $.sendRequest(options)
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.serive.modifyQuestion :  API_URL.serive.addQuestion,
            data: {
                ...params,
                questionId:isEdit ? editId : null,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
                    this.setState({isSaved:true})
                    this.props.history.goBack()
                } else {
                    Modal.error({ title: data.error});
                }            
            }
        }
        $.sendRequest(options)
      }
    
      edit=(id)=>{
        const options ={
            method: 'POST',
            url: API_URL.serive.queryQuestion,
            data: {
                offset: 1,
                limit: 1,
                questionId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const detail = data.datas[0] || data.data[0];
                    this.setState({
                        isEdit:true,
                        detail,
                        editId:id,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
      }
    
    
      del = (id) => {
        const options ={
            method: 'POST',
            url: API_URL.question.deleteLastTendency,
            data: {
                offset: 1,
                limit: 1,
                questionId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
                    this.loadListData()
                } else {
                    Modal.error({ title: data.error });
                }            
            }
        }
        $.sendRequest(options)
      }

    
    componentDidMount(){        
        const { id } = this.props.match ? this.props.match.params : ''        
        this.queryHistoryState(id)
        this.loadInfo(id)
    }

    orderState = () => {
        const {orderStep, orderStepType, stateTime} = this.state
        console.log(orderStep, orderStepType, stateTime)
        let html
        switch (orderStepType) {
            case 'a':
                html = <Row style={{margin:'30px 0'}} className='orderstep'>
                <Col className="NO1" span={18}>
                    <Steps current={orderStep} progressDot >
                        <Step title="订单创建" description={stateTime.orderCreateTime || ''}/>
                        <Step title="抢单成功" description={stateTime.orderSuccessTime || ''}/>
                        <Step title="开始工作" description={stateTime.attackTime || ''}/>
                        <Step title="完成工作" description={stateTime.completionTime || ''}/>
                        <Step title="工时提交" description={stateTime.submissionTime || ''}/>
                        <Step title="确认支付" description={stateTime.confirmPaymentTime || ''}/>
                    </Steps>
                </Col>
                <Col className="hline" span={2}>
                    <div className="kkk"></div>
                </Col>
                <Col className="NO2" span={4}>
                    <Steps direction="vertical" current={1} progressDot >
                        <Step className='kkk' title="评价医生" status={!stateTime.orderEvaluationTime ? 'wait' : ''} description={stateTime.orderEvaluationTime || ''}/>
                        <Step className='kkk' title="评价医助" status={!stateTime.serviceEvaluationTime ? 'wait' : ''} description={stateTime.serviceEvaluationTime || ''}/>
                    </Steps>
                </Col>
            </Row>
                break;
            case 'b':
                html=<Row style={{margin:'30px 0'}} className='orderstep'>
                <Col className="NO1" span={18}>
                    <Steps current={1} progressDot >
                        <Step title="订单创建" status={!stateTime.orderCreateTime ? 'wait' : ''} description={stateTime.orderCreateTime || ''}/>
                        <Step title="订单已取消" status={!stateTime.projectCancelTime ? 'wait' : ''} description={stateTime.projectCancelTime || ''}/>
                    </Steps>
                </Col>
            </Row>
                break;
            case 'c':
                html=<Row style={{margin:'30px 0'}} className='orderstep'>
                <Col className="NO1" span={18}>
                    <Steps current={3} progressDot >
                        <Step title="订单创建" status={!stateTime.orderCreateTime ? 'wait' : ''} description={stateTime.orderCreateTime || ''}/>
                        <Step title="抢单成功" status={!stateTime.orderSuccessTime ? 'wait' : ''} description={stateTime.orderSuccessTime || ''}/>
                        <Step title="请求取消订单" status={!stateTime.projectCancellationTime ? 'wait' : ''} description={stateTime.projectCancellationTime || ''}/>
                        <Step title="订单已取消" status={!stateTime.projectCancelTime ? 'wait' : ''} description={stateTime.projectCancelTime || ''}/>
                    </Steps>
                </Col>
            </Row>
                break;
            case 'd':
                html=<Row style={{margin:'30px 0'}} className='orderstep'>
                <Col className="NO1" span={18}>
                    <Steps current={2} progressDot >
                        <Step title="订单创建" status={!stateTime.orderCreateTime ? 'wait' : ''} description={stateTime.orderCreateTime || ''}/>
                        <Step title="抢单成功" status={!stateTime.orderSuccessTime ? 'wait' : ''} description={stateTime.orderSuccessTime || ''}/>
                        <Step title="订单已取消" status={!stateTime.projectCancelTime ? 'wait' : ''} description={stateTime.projectCancelTime || ''}/>
                    </Steps>
                </Col>
            </Row>
                break;
            default:
                html='数据出错！'
        }
        return html
    }

    render(){
        const {isEdit, detail, isSaved,questionType,orderInfo}=this.state        
        return( 
        <div>            
            {this.orderState()}
            { Object.keys(orderInfo).length > 0 ?
            <Row>
                <Col span={12}>
                    <Row style={{minHeight:20}}><Col style={{marginLeft:30}}>1.基本信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>订单编号：</dt><dd>{orderInfo.projectCode}</dd></dl>
                        <dl><dt>项目类型：</dt><dd>{orderInfo.projectContract.projectTypeName}</dd></dl>
                        <dl><dt>项目概述：</dt><dd>{orderInfo.projectTitle}</dd></dl>
                        <dl><dt>授权工作类型：</dt><dd>{orderInfo.projectContract.jobTypeNames}</dd></dl>
                        <dl><dt>人员要求：</dt><dd>{orderInfo.projectContract.serviceStaffTypeName}</dd></dl>
                        <dl><dt>上门服务时间：</dt><dd>{orderInfo.serviceTime  } - {moment(orderInfo.serviceTime).add({hours:orderInfo.planServiceHours}).format("YYYY-MM-DD HH:mm")}</dd></dl>
                        <dl><dt>联系人\ 联系方式：</dt><dd>{orderInfo.projectContract.contactPerson} \ {orderInfo.projectContract.contactPhone}</dd></dl>
                        <dl><dt>服务地点：</dt><dd>{orderInfo.projectContract.detailAddress}</dd></dl>
                        <dl><dt>服务单价：</dt><dd>￥{orderInfo.servicePrice} / 小时</dd></dl>
                        </Col>
                    </Row>
                    <Row style={{minHeight:20,marginTop:40}}><Col style={{marginLeft:30}}>2.下单者信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>下单者姓名：</dt><dd>{orderInfo.orderCompellation}</dd></dl>
                        <dl><dt>下单者手机号：</dt><dd>{orderInfo.orderMobile}</dd></dl>
                        <dl><dt>下单时会员等级：</dt><dd>{orderInfo.projectContract.orderLevel} 钻</dd></dl>
                        </Col>
                    </Row>
                    <Row style={{minHeight:20,marginTop:40}}><Col style={{marginLeft:30}}>3.服务者信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>服务者姓名：</dt><dd>{orderInfo.serviceCompellation}</dd></dl>
                        <dl><dt>服务者手机号：</dt><dd>{orderInfo.serviceMobile}</dd></dl>
                        <dl><dt>接单时会员等级：</dt><dd>{orderInfo.projectContract.serviceLevel} 钻</dd></dl>
                        </Col>
                    </Row>
                </Col>
                <Col className='line' span={12}>
                    <Row style={{minHeight:20}}><Col style={{marginLeft:30}}>4.工时信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>预计：</dt><dd>{orderInfo.planServiceHours}小时，￥{orderInfo.servicePrice * orderInfo.planServiceHours}</dd></dl>
                        <dl><dt>实际：</dt><dd>{orderInfo.actualServiceHours}小时，￥{orderInfo.servicePrice * orderInfo.actualServiceHours}</dd></dl>
                        <dl><dt>修改为：</dt><dd>{orderInfo.modifyServiceHours}小时，￥{orderInfo.servicePrice * orderInfo.modifyServiceHours}</dd></dl>
                        </Col>
                    </Row>
                    <Row style={{minHeight:20,marginTop:40}}><Col style={{marginLeft:30}}>5.支付信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>支付方式：</dt><dd>{orderInfo.paymentsDocument.channel =='BALANCE' ? '账户余额支付' : orderInfo.paymentsDocument.channel =='WEIXIN' ? '微信支付' : '未知' }  </dd></dl>
                        <dl><dt>支付单号：</dt><dd>{orderInfo.paymentsDocument.paymentsDocumentNumber}</dd></dl>
                        <dl><dt>代金券：</dt><dd>{orderInfo.is_voucher ? '已使用代金券' : '未使用代金券'}</dd></dl>
                        <dl><dt>优惠金额：</dt><dd>{!orderInfo.is_voucher ? `-￥ ${orderInfo.couponMoney || 0}` :null}</dd></dl>
                        <dl><dt>抵扣金额：</dt><dd>{orderInfo.is_voucher ?　`-￥ ${orderInfo.couponMoney || 0}` :null}</dd></dl>
                        <dl><dt>小费：</dt><dd>￥{orderInfo.projectContract.tip}</dd></dl>
                        <dl><dt>实付金额：</dt><dd>￥{orderInfo.paymentsDocument.actualPay / 100}</dd></dl>
                        </Col>
                    </Row>
                    <Row style={{minHeight:20,marginTop:40}}><Col style={{marginLeft:30}}>6.收款信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>补贴金额：</dt><dd>￥{orderInfo.allowanceMoney}</dd></dl>
                        <dl><dt>平台服务费：</dt><dd>-￥{orderInfo.serviceChangeMoney}</dd></dl>
                        <dl><dt>小费：</dt><dd>￥{orderInfo.projectContract.tip}</dd></dl>
                        <dl><dt>实收金额：</dt><dd>￥{orderInfo.paymentsDocument.actualReceive / 100}</dd></dl>
                        </Col>
                    </Row>
                    <Row style={{minHeight:20,marginTop:40}}><Col style={{marginLeft:30}}>7.评价信息</Col></Row>
                    <Row>
                        <Col className='orderlist'>
                        <dl><dt>下单者得分：</dt><dd>{orderInfo.orderEvaluationScore && orderInfo.orderEvaluationScore + '分'}</dd></dl>
                        <dl><dt>服务者得分：</dt><dd>{orderInfo.serviceEvaluationScore && orderInfo.serviceEvaluationScore  + '分'}</dd></dl>
                        </Col>
                    </Row>
                </Col>
            </Row>
            :null
            }
        </div>)
    }
}