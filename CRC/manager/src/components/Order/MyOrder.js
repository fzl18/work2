import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,Checkbox,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config,uploadser} from '../common/config'

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
class FormBox extends React.Component {
    state={        
        submitting:false,
    }

    validateHtml=(rule, value, callback)=>{      
      if(value){
        let html = this.delHtmlTag(value)
        if (html) {
          callback();
          return;
        }
      }      
      callback('请输入内容！');
    }  
    
    componentDidMount(){

    }

    render(){
        const { getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
        const {submitting}=this.state
        const formItemLayout = config.formItemLayout    
        const submitFormLayout = config.submitFormLayout
        const questionTitle = getFieldValue('questionTitle')
        const questionAnswer = getFieldValue('questionAnswer')
        const questionType = getFieldValue('questionType')
        return(
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="问题分类"
              >
                {questionType && questionType.questionTypeName}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="适用对象"
              >
                {questionType && questionType.conductType == 'ORDER' ? '下单会员': questionType && questionType.conductType == 'SERVICE' ? '服务会员':'下单会员;服务会员'}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="问题标题"
              >
                {questionTitle}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="问题答案"
              >
                <div style={{width:330}} dangerouslySetInnerHTML={{__html: questionAnswer}} />
              </FormItem>

              <FormItem {...submitFormLayout}>
                <Button type="primary" onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>确定</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button>
              </FormItem>
            </Form>          
        )
    }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator,getFieldValue } = this.props.form
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="订单编号">
                {getFieldDecorator('projectCode')(
                    <Input placeholder="请输入订单编号" />
                )}
                </FormItem>
                <FormItem label="订单时间">
                {getFieldDecorator('month')(
                    <Select style={{width:120}} placeholder="请选择" allowClear>
                        <Option value='1'>近一个月</Option>
                        <Option value='3'>近三个月</Option>
                        <Option value=''>不限时间</Option>
                    </Select>                    
                )}
                </FormItem>
                <FormItem label="订单状态">
                {getFieldDecorator('orderStatus')(
                    <Select style={{width:120}} placeholder="请输入订单状态" allowClear>
                        <Option value='GRAB'>待抢单</Option>
                        <Option value='SERVICE'>待服务</Option>
                        <Option value='CANCEL'>已取消</Option>
                        <Option value='CANCELLATION'>请求取消中</Option>
                        <Option value='ATTACK'>服务中</Option>
                        <Option value='COMPLETION'>已完成服务</Option>
                        <Option value='SUBMISSION'>已提交工时</Option>
                        <Option value='PAYMENT'>已完成支付</Option>
                        <Option value='APPRAISAL'>已评价</Option>
                    </Select>                    
                )}
                </FormItem>
                <FormItem label="下单者手机号">
                {getFieldDecorator('orderMobile')(
                    <Input placeholder="请输入" />
                )}
                </FormItem>
                <FormItem label="服务者手机号">
                {getFieldDecorator('serviceMobile')(
                    <Input placeholder="请输入" />
                )}
                </FormItem>                
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>                
            </Form>
        );
    }
}

export default class MyOrder extends Component {
state = {
    loading:false,
    pagination:{
        pageSize: config.pageSize,
        current: 1,
    },
    listData:[],
    detail:'',
    addInputValue: '',
    modalVisible: false,
    selectedRows: [],
    searchFormValues: {},
    isEdit:false,
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  loadListData = (params) => {
    const {pagination,searchFormValues}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.serive.queryProject,
        data: {
            offset: pagination.current || 1,
            limit: pagination.pageSize,
            ...searchFormValues,
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const listData = data.datas || data.data;
                pagination.total = data.totalCount;
                this.setState({
                    loading: false,
                    listData,
                    pagination,
                });
            } else {
                Modal.error({ title: data.error });
            }
            this.setState({loading:false})
        }
    }
    $.sendRequest(options)
  }

  queryMessageType=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryQuestionType,
        data: {

        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  questionType: data.datas || data.data,
                });
            } else {
                Modal.error({ title: data.error });
            }
        }
    }
    $.sendRequest(options)    
  }

  componentDidMount() {
    this.loadListData()
    // this.queryMessageType()
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    this.handleSelectRows(selectedRows);
    this.setState({ selectedRowKeys, totalCallNo });    
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { searchFormValues,} = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...searchFormValues,
      ...filters,
      offset:pagination.current,
    };
    if (sorter.field) {
      params.sort = sorter.field;
      params.direction = sorter.order == "descend" ? "DESC" :  "ASC";

    }
    
    this.setState({pagination},()=>{
      this.loadListData(params)
    })
  } 

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

  }


  handleMenuClick = (e) => {

    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    const arr=[]
    rows.map(d => {
      arr.push(d.id)
    })
    this.setState({
      selectedRows: arr,
    });
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.searchFormRef.validateFields((err, fieldsValue) => {
      if (err) return;
      const {pagination}=this.state
      pagination.current = 1
      fieldsValue.questionTypeName = fieldsValue.questionTypeName && fieldsValue.questionTypeName.trim()
      this.setState({
        searchFormValues: fieldsValue,
        pagination
      },()=>{this.loadListData(fieldsValue)});
    });
  }


  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }


  renderSearchForm() {
    const { selectedRows, searchFormValues,questionType } = this.state;
    const mapPropsToFields = () => ({ 
            projectCode:{value:searchFormValues.projectCode},
            month:{value:searchFormValues.month},
            orderStatus:{value:searchFormValues.orderStatus},
            orderMobile:{value:searchFormValues.orderMobile},
            serviceMobile:{value:searchFormValues.serviceMobile},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm create={()=>{this.changeModalView('modalVisible','open','new')}} handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={2} sm={8} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                
            </Col>
        </Row>
    );
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        values.conductType = values.conductType.join(';')
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.serive.modifyQuestion :  API_URL.serive.addQuestionType,
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
                this.changeModalView('modalVisible','close')
                this.loadListData()
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
        url: API_URL.serive.deleteQuestion,
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

  changeModalView = (modalName,isShow,type,callback=()=>{}) => {    
    this.setState({
      [modalName]: isShow==='open' ? true : isShow==='close' ? false : false,
    })
    if(type=='new'){
      this.setState({
        isEdit:false,
      })
    }
    if(type=='edit'){
      this.setState({
        isEdit:true,
      })
    }    
    callback && callback()
    }
    



  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
        fixed:true
      },
      {
        title: '订单编号',
        width:140,
        dataIndex:'projectCode',
        sorter:true,
        fixed:true,
        render:(text,record)=>
        <a href={`/#/OrderDetail/${record.id}`} target='_blank'>{record.projectCode}</a>
      },
      {
        title: '订单状态',
        width:100,
        render:(text,record)=>{
          let status
          switch (record.orderStatus) {
            case 'GRAB':
            status = '待抢单'
              break;
            case 'SERVICE':
            status = '待服务'
              break;
            case 'CANCEL':
            status = '已取消'
              break;
            case 'CANCELLATION':
            status = '请求取消中'
              break;
            case 'ATTACK':
            status = '服务中'
              break;
            case 'COMPLETION':
            status = '已完成服务'
              break;
            case 'SUBMISSION':
            status = '已提交工时'
              break;
            case 'PAYMENT':
            status = '已完成支付'
              break;
            case 'APPRAISAL':
            status = '已评价'
              break;
          
            default:
              break;
          }
          return status
        }        
      },
      {
        title: '下单者姓名',
        dataIndex: 'orderCompellation',
        width:100,
      },
      {
        title: '下单者手机号',
        dataIndex: 'orderMobile',
        width:150,
      },
      {
        title: '创建时间',
        dataIndex: 'orderCreateTime',
        width:150,
        sorter:true,
      },
      {
        title: '服务者姓名',
        dataIndex: 'serviceCompellation',
        width:80,
      },
      {
        title: '服务者手机号',
        dataIndex: 'serviceMobile',
        width:150,
      },
      {
        title: '订单金额（元）',
        dataIndex: 'orderMoney',
        width:150,
        sorter:true,
      },
      {
        title: '实付金额（元）',
        dataIndex: 'd2',
        width:150,
        sorter:true,
      },
      {
        title: '实收金额（元）',
        dataIndex: 'd3',
        width:150,
        sorter:true,
      },
      {
        title: '平台服务费（元）',
        dataIndex: 'ddddxx',
        width:150,
        sorter:true,
      },
      {
        title: '小费（元）',
        dataIndex: 'tip',
        width:150,
        sorter:true,
        render:(text,record)=> record.projectContract.tip > 0 ? record.projectContract.tip : null
      },
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.projectId,
            ...d,
        }
        lists.push(list)
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:config.pageSizeOptions,
      ...pagination,
    };

    const mapPropsToFields = () => (        
      isEdit ?        
        { 
          questionTitle:{value:detail.questionTitle},
          questionAnswer:{value:detail.questionAnswer},
          questionType:{value:detail.questionType},
        } : null
      ) 
    FormBox=Form.create({mapPropsToFields})(FormBox)
    return (
      <div>
            <div>
              {this.renderSearchForm()}
            </div>
            <Table
              loading={loading}
              rowKey={record => record.id}
            //   rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{x:1680,y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={'查看问题记录'}
                visible={modalVisible}
                width={550}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
            </Modal>
      </div>
    );
  }
}
