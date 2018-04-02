import React, {Component} from 'react';
import {Route, Redirect, Link} from "react-router-dom";
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification,Pagination  } from 'antd';
import Editor from '../common/Editor';
import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
    state={        
        submitting:false,
        previewVisible: false,
        previewImage:'',
        fileList:[],
    }

    delHtmlTag = (str)=>{
      return str.replace(/<[^>]+>/g,"");
    }

    validLevel=(rule, value, callback)=>{
      const {order}=this.state   
      if(order && order.geResult && order.leResult){
        if(order.leResult > order.geResult){
          callback()
          return
        }else{
          callback('第一项要小于第二项！')
          return
        }
        
      }
      // else if(order && order.leResult || order.geResult){
      //   callback()
      //   return
      // }
      callback('请输入数据！')
    }    
    
    componentDidMount(){
      const { getFieldDecorator, getFieldValue,setFieldsValue} = this.props.form
      const memberBehaviorType = getFieldValue('memberBehaviorType')
      const order = {geResult:getFieldValue('geResult'),leResult:getFieldValue('leResult')}
      const isResult =getFieldValue('memberBehaviorType2') && getFieldValue('memberBehaviorType2').isResult
      this.setState({isResult,memberBehaviorType,order})
    }

    normFile = (rule, value, callback) => {
      console.log(typeof value)
      if(typeof value =='string'){
          callback();
          return;
      }else if( value && value.fileList.length){
        callback();
        return;
      }
      callback('请添加图片');
    }

    handleNum=(fieldName,v)=>{
      const {setFieldsValue} = this.props.form;
      const {order} = this.state      
      order[fieldName] = v
      this.setState({order},()=>{setFieldsValue({
        order
      })})
    }
    handleAction=(v)=>{
      const {isResult,memberBehaviorType} = this.state
      memberBehaviorType.map(d =>{
        if(v == d.memberBehaviorTypeId){
          this.setState({isResult:d.isResult})
          return
        }
      })      
    }
    render(){
        const { getFieldDecorator, getFieldsValue, getFieldValue,setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, order, isResult} = this.state;
        const formItemLayout = config.formItemLayout    
        const submitFormLayout = config.submitFormLayout
        const type = getFieldValue('type')
        const key = getFieldValue('key')
        const memberBehaviorType = getFieldValue('memberBehaviorType')
        const typeOptions = type && type.map((v) => <Option key={v.memberTypeId} value={`${v.memberTypeId}`}>{v.memberTypeName=='INSIDE_ASSISTANT'?'临床协调员（内部）':'临床协调员（外部）'}</Option>)
        const memberBehaviorTypeOptions = memberBehaviorType && memberBehaviorType.map((v) => <Option key={v.memberBehaviorTypeId} value={`${v.memberBehaviorTypeId}`}>{v.memberBehaviorTypeName == '完成支付/订单结算收款' ? '订单结算收款' : v.memberBehaviorTypeName}</Option>)
        getFieldDecorator('key')
        return(            
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="会员类型">
              {getFieldDecorator('memberTypeId',{
                  rules: [{
                    required: true, message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' style={{width:200}}>
                    {typeOptions}
                  </Select>
              )}
              </FormItem>
              <FormItem {...formItemLayout} label="行为">
              {getFieldDecorator('memberBehaviorTypeId',{
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' style={{width:200}} onChange={this.handleAction} >
                    {memberBehaviorTypeOptions}
                  </Select>
              )}
              </FormItem>
              {isResult ? 
                <FormItem {...formItemLayout} label="行为结果">
                {getFieldDecorator('order',{
                    rules: [{
                      required: true,
                    validator:this.validLevel
                    }],
                  })(
                    <div> <InputNumber min={0} precision={0} value={order.geResult} onChange={this.handleNum.bind(this,'geResult')}/> ~ <InputNumber min={0} precision={0} value={order.leResult} onChange={this.handleNum.bind(this,'leResult')} style={{marginLeft:10}}/></div>
                )}
                </FormItem>:null
              }
              <FormItem {...formItemLayout} label="积分变动">
                <Select style={{width:50,marginRight:5}} defaultValue={key ||'add'} onChange={(v)=>{setFieldsValue({key:v})}} >
                  <Option value='add'>＋</Option>
                  <Option value='subtract'>－</Option>
                </Select>
              {getFieldDecorator('integralNumber',{
                  rules: [{
                    required: true,
                    message:'请输入数字'
                    // validator:this.validLevel
                  }],
                })(
                  <InputNumber min={0} precision={0} />
              )}
              </FormItem>
              <FormItem {...formItemLayout} label="计算频率">
              {getFieldDecorator('calculatedRate',{
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' style={{width:200}}>
                    <Option value='DAY'>每天</Option>
                    <Option value='COUNT'>每次</Option>
                  </Select>
              )}
              </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
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
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const type = getFieldValue('type')
        const memberBehaviorType = getFieldValue('memberBehaviorType')
        const typeOptions = type && type.map((v) => <Option key={v.memberTypeId} value={`${v.memberTypeId}`}>{v.memberTypeName=='INSIDE_ASSISTANT'?'临床协调员（内部）':'临床协调员（外部）'}</Option>)
        const memberBehaviorTypeOptions = memberBehaviorType && memberBehaviorType.map((v) => <Option key={v.memberBehaviorTypeId} value={`${v.memberBehaviorTypeId}`}>{v.memberBehaviorTypeName == '完成支付/订单结算收款' ? '订单结算收款' : v.memberBehaviorTypeName}</Option>)
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="会员类型">
                {getFieldDecorator('memberTypeId')(
                    <Select placeholder='请选择' allowClear style={{width:120}}>
                      {typeOptions}
                    </Select>
                )}
                </FormItem>
                <FormItem label="行为">
                {getFieldDecorator('memberBehaviorTypeId')(
                    <Select placeholder='请选择' allowClear style={{minWidth:120}}>
                      {memberBehaviorTypeOptions}
                    </Select>
                )}
                </FormItem>
                <FormItem label="计算频率">
                {getFieldDecorator('calculatedRate')(
                    <Select placeholder='请选择' allowClear style={{width:120}}>
                      <Option value='DAY'>每天</Option>
                      <Option value='COUNT'>每次</Option>
                    </Select>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
                <Button icon="plus" type="primary" onClick={this.props.create} style={{marginLeft:17}}>添加</Button>
            </Form>
        );
    }
}

export default class Serivce extends Component {
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
        url: API_URL.serive.queryRuleMemberIntegral,
        data: {
            offset: pagination.current || 1,
            limit: pagination.pageSize,
            conductType:'SERVICE',
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

  loadMemberType=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryMemberType,
        data: {
          conductType:'SERVICE'
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  memberType: data.datas || data.data,
                });
            } else {
                Modal.error({ title: data.error });
            }
        }
    }
    $.sendRequest(options)    
  }

  queryMemberBehaviorType=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryMemberBehaviorType,
        data: {

        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  memberBehaviorType: data.datas || data.data,
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
    this.loadMemberType()
    this.queryMemberBehaviorType()
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
    const { selectedRows, searchFormValues,memberBehaviorType,memberType } = this.state;
    const mapPropsToFields = () => ({ 
            memberTypeId:{value:searchFormValues.memberTypeId},
            memberBehaviorTypeId:{value:searchFormValues.memberBehaviorTypeId},
            calculatedRate:{value:searchFormValues.calculatedRate},
            type:{value:memberType},
            memberBehaviorType:{value:memberBehaviorType}
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm create={this.changeModalView.bind(this,'modalVisible','open','new')} handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={2} sm={8} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                {/* <Button icon="plus" type="primary" onClick={()=>{this.changeModalView('modalVisible','open','new')}}>添加</Button> */}
                
            </Col>
        </Row>
    );
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {  
      if (!err) {
        Object.assign(values,values.order)
        console.log(values)
        values.key != 'add' ? values.key ? values.integralNumber = ~values.integralNumber + 1 :'add': values.integralNumber
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.serive.modifyRuleMemberIntegral :  API_URL.serive.addRuleMemberIntegral,
        data: {
            ...params,
            conductType:'SERVICE',
            ruleMemberIntegralId:isEdit ? editId : null,
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
        url: API_URL.serive.queryRuleMemberIntegral,
        data: {
            offset: 1,
            limit: 1,
            conductType:'SERVICE',
            ruleMemberIntegralId:id,
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
        url: API_URL.serive.deleteRuleMemberIntegral,
        data: {
            offset: 1,
            limit: 1,
            conductType:'SERVICE',
            ruleMemberIntegralId:id,
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

  changeModalView = (modalName,isShow,type) => {    
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
    }


  render() {
    const {loading, listData, detail, selectedRows, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination,memberBehaviorType,memberType } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60
      },
      {
        title: '会员类型',
        width:100,
        render:(text,record)=> record.memberType && record.memberType.memberTypeName =='INSIDE_ASSISTANT' ? '临床协调员（内部）' :'临床协调员（外部）'
      },
      {
        title: '行为',
        width:130,
        render:(text,record)=> record.memberBehaviorType && record.memberBehaviorType.memberBehaviorTypeName == '完成支付/订单结算收款' ? '订单结算收款' : record.memberBehaviorType.memberBehaviorTypeName
      },      
      {
        title: '行为结果',
        width:160,
        render:(text,record)=> {
          let show
          if(record.geResult && record.leResult){
            show = `${record.geResult} <= 得分 <= ${record.leResult}`
          }else if(!record.geResult && record.leResult){
            show = `得分 <= ${record.leResult}`
          }else if(record.geResult && !record.leResult){
            show = `得分 >= ${record.geResult}`
          }else{
            show=''
          }
          return show
        }
      },
      {
        title: '积分变动',
        dataIndex: 'integralNumber',
        width:160,
        render:(text,record)=> record.integralNumber > 0 ? `+${record.integralNumber}`: record.integralNumber
      },
      {
        title: '计算频率',
        width:160,
        render:(text,record)=> record.calculatedRate =='DAY' ? '每天':'每次'
      },         
      {
        title: '操作',
        width:100,
        render: (text,record,index) => (
          <div>
            {/* <Link to={`/index/news/save/${record.id}`}>修改</Link> */}
            <a href="javascript:;" onClick={()=>{this.changeModalView('modalVisible','open','edit');this.edit(record.id)}}>修改</a>
            <span className="ant-divider" />
            <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(record.id)}} okText="是" cancelText="否">
            <a href="javascript:;" >删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.ruleMemberIntegralId,
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
          calculatedRate:{value:detail.calculatedRate},
          geResult:{value:detail.geResult},
          leResult:{value:detail.leResult},
          key:{value:detail.integralNumber > 0 ? 'add':'subtract'},
          integralNumber:{value:Math.abs(detail.integralNumber)},
          memberBehaviorTypeId:{value:detail.memberBehaviorType && detail.memberBehaviorType.memberBehaviorTypeId+''},
          memberTypeId:{value:detail.memberType && detail.memberType.memberTypeId+''},
          type:{value:memberType},
          memberBehaviorType:{value:memberBehaviorType},
          memberBehaviorType2:{value:detail.memberBehaviorType}
        } : {
          type:{value:memberType},
          memberBehaviorType:{value:memberBehaviorType}
        }
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
              // rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改服务会员积分制度':'添加服务会员积分制度'}
                visible={modalVisible}
                width={600}
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
