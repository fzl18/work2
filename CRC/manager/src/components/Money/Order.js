import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,Checkbox,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config,uploadser} from '../common/config';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker
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
       
        return(
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="问题分类"
              >
                {getFieldDecorator('questionTypeName', {
                  rules: [{
                    required: true, message: '请输入问题分类',
                  }],
                })(
                  <Input placeholder="请输入" style={{width:'80%'}} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="适用对象"
              >
                {getFieldDecorator('conductType', {
                  rules: [{
                    required: true, message: '请至少选择一项',
                  }],
                })(
                  <CheckboxGroup options={[{ label: '下单会员', value: 'ORDER' },
                  { label: '服务会员', value: 'SERVICE' },]} />                  
                )}
              </FormItem>

              <FormItem {...submitFormLayout}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button>
              </FormItem>
            </Form>          
        )
    }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">                
                <FormItem label="订单号">
                {getFieldDecorator('projectCode')(
                    <Input placeholder="请输入订单号" />
                )}
                </FormItem>                
                <FormItem label="支付时间">
                {getFieldDecorator('completeTime')(
                    <RangePicker />
                )}
                </FormItem>
                <FormItem label="支付流水号">
                {getFieldDecorator('serial')(
                    <Input placeholder="请输入支付流水号" />
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
            </Form>
        );
    }
}

export default class Order extends Component {
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
        url: API_URL.serive.queryProjectPaymentsInfoList,
        data: {
            offset: pagination.current || 1,
            limit: pagination.pageSize -1,
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

  componentDidMount() {
    this.loadListData()
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
      fieldsValue.projectCode = fieldsValue.projectCode && fieldsValue.projectCode.trim()
      fieldsValue.serial = fieldsValue.serial && fieldsValue.serial.trim()
      if(fieldsValue.completeTime && fieldsValue.completeTime.length > 0){
        fieldsValue.beginDate = fieldsValue.completeTime[0].format("YYYY-MM-DD")
        fieldsValue.endDate = fieldsValue.completeTime[1].format("YYYY-MM-DD")
      }
      this.setState({
        searchFormValues: fieldsValue,
        pagination
      },()=>{this.loadListData({...fieldsValue,completeTime:null})});
    });
  }


  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }


  renderSearchForm() {
    const { selectedRows, searchFormValues } = this.state;
    const mapPropsToFields = () => ({ 
            projectCode:{value:searchFormValues.projectCode},
            serial:{value:searchFormValues.serial},
            completeTime:{value:searchFormValues.completeTime},
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
        url: isEdit ? API_URL.serive.modifyQuestionType :  API_URL.serive.addQuestionType,
        data: {
            ...params,
            questionTypeId:isEdit ? editId : null,
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
        url: API_URL.serive.queryQuestionType,
        data: {
            offset: 1,
            limit: 1,
            questionTypeId:id,
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
        url: API_URL.serive.deleteQuestionType,
        data: {
            offset: 1,
            limit: 1,
            questionTypeId:id,
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

  changeModalView = (modalName,isShow,type,callback) => {    
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
      },
      {
        title: '订单号',
        dataIndex: 'projectCode',
        width:150,
      },
      {
        title: '支付时间',
        dataIndex: 'completeTime',
        width:150,
        sorter:true,
      },
      {
        title: '支付流水号',
        dataIndex: 'serial',
        width:300,
      }, 
      {
        title: '实付金额（元）',
        dataIndex: 'actualPay',
        width:150,
        sorter:true,
      }, 
      {
        title: '实收金额（元）',
        dataIndex: 'actualReceive',
        width:150,
        sorter:true,
      }, 
      {
        title: '平台服务费（元）',
        dataIndex: 'charge',
        width:150,
        sorter:true,
      } 
    ];

    const lists = []
    let sumActualPay = 0, sumActualReceive = 0, sumCharge = 0
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * (pagination.pageSize - 1) + i + 1,
            id:i,      
            ...d,
        }
        sumActualPay +=d.actualPay
        sumActualReceive +=d.actualReceive
        sumCharge +=d.charge
        lists.push(list)
    })
    lists.push({
      index:'合计',
      actualPay:sumActualPay.toFixed(2),
      actualReceive:sumActualReceive.toFixed(2),
      charge:sumCharge.toFixed(2)
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
          name:{value:detail.name},
          conductType:{value:detail.conductType && detail.conductType.split(';')},
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
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改问题分类':'添加问题分类'}
                visible={modalVisible}
                width={450}
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
