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
      if(order && order.geIntegral || order.geIntegral==0){
        if(order.leIntegral > order.geIntegral){
          callback()
          return
        }else if(order.leIntegral > 0  && order.leIntegral <= order.geIntegral ){
          callback('第一项要小于第二项！')
          return
        }else if(order.leIntegral == 0 ){
          callback('第二项不能为0！')
          return
        }else{          
          callback()
          return
        }
        
      }else if(!order || !order.geIntegral){
        callback('请输入积分！第一项不能为空,可以为零')
        return
      }
      // callback('请输入积分！')
    }    
    
    componentDidMount(){
      const { getFieldDecorator, getFieldValue,setFieldsValue} = this.props.form;
      const order = getFieldValue('order') ||{}
      this.setState({order})
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

    render(){
        const { getFieldDecorator, getFieldsValue, getFieldValue,setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, order} = this.state;
        const formItemLayout = config.formItemLayout    
        const submitFormLayout = config.submitFormLayout
        const type = getFieldValue('type')
        const level = getFieldValue('level')
        const typeOptions = type && type.map((v) => <Option key={v.memberTypeId} value={`${v.memberTypeId}`}>{v.memberTypeName=='DOCTOR'?'医生': v.memberTypeName=='NOTDOCTOR'?'非医生': v.memberTypeName=='INSIDE_ASSISTANT'?'临床协调员（内部）':'临床协调员（外部）'}</Option>)
        const levelOptions = level && level.map((v) => <Option key={v.memberLevelTypeId} value={`${v.memberLevelTypeId}`}>{v.memberLevelTypeName}</Option>)

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
              <FormItem {...formItemLayout} label="会员等级">
              {getFieldDecorator('memberLevelTypeId',{
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' style={{width:200}}>
                    {levelOptions}
                  </Select>
              )}
              </FormItem>
              <FormItem {...formItemLayout} label="积分条件">
              {getFieldDecorator('order',{
                  rules: [{
                    required: true,                    
                    validator:this.validLevel
                  }],
                })(
                  <div> <InputNumber min={0} value={order && order.geIntegral} precision={0} onChange={this.handleNum.bind(this,'geIntegral')}/> ~ <InputNumber min={0} value={order && order.leIntegral} precision={0} onChange={this.handleNum.bind(this,'leIntegral')} style={{marginLeft:10}}/>  积分 </div>
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
        const level = getFieldValue('level')
        const typeOptions = type && type.map((v) => <Option key={v.memberTypeId} value={`${v.memberTypeId}`}>{v.memberTypeName=='DOCTOR'?'医生': v.memberTypeName=='NOTDOCTOR'?'非医生': v.memberTypeName=='INSIDE_ASSISTANT'?'临床协调员（内部）':'临床协调员（外部）'}</Option>)
        const levelOptions = level && level.map((v) => <Option key={v.memberLevelTypeId} value={`${v.memberLevelTypeId}`}>{v.memberLevelTypeName}</Option>)
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="会员类型">
                {getFieldDecorator('memberTypeId')(
                    <Select placeholder='请选择' allowClear style={{minWidth:120}}>
                      {typeOptions}
                    </Select>
                )}
                </FormItem>
                <FormItem label="会员等级">
                {getFieldDecorator('memberLevelTypeId')(
                    <Select placeholder='请选择' allowClear style={{width:120}}>
                      {levelOptions}
                    </Select>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
                <Button icon="plus" type="primary" onClick={this.props.create} style={{marginLeft:17}}>添加</Button>
            </Form>
        );
    }
}

export default class MemberLevel extends Component {
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
        url: API_URL.serive.queryRuleMemberLevel,
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

  loadMemberType=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryMemberType,
        data: {
          // conductType:'ORDER'
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

  loadMemberLevel=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryMemberLevel,
        data: {

        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  memberLevel: data.datas || data.data,
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
    this.loadMemberLevel()
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
      fieldsValue.lastTendencyTitle = fieldsValue.lastTendencyTitle && fieldsValue.lastTendencyTitle.trim()
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
    const { selectedRows, searchFormValues,memberLevel,memberType } = this.state;
    const mapPropsToFields = () => ({ 
            memberTypeId:{value:searchFormValues.memberTypeId},
            memberLevelTypeId:{value:searchFormValues.memberLevelTypeId},
            type:{value:memberType},
            level:{value:memberLevel}
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
      Object.assign(values,values.order)    
      if (!err) {
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.serive.modifyRuleMemberLevel :  API_URL.serive.addRuleMemberLevel,
        data: {
            ...params,
            ruleMemberLevelId:isEdit ? editId : null,
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
        url: API_URL.serive.queryRuleMemberLevel,
        data: {
            offset: 1,
            limit: 1,
            ruleMemberLevelId:id,
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
        url: API_URL.serive.deleteRuleMemberLevel,
        data: {
            offset: 1,
            limit: 1,
            ruleMemberLevelId:id,
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
    const {loading, listData, detail, selectedRows, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination,memberLevel,memberType } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60
      },
      {
        title: '会员类型',
        width:100,
        render:(text,record)=> {
          let name
          switch(record.memberType.memberTypeName){
          case 'NOTDOCTOR':
            name='非医生'
            break;
          case 'DOCTOR':
            name='医生'
          break;
          case 'INSIDE_ASSISTANT':
            name='临床协调员（内部）'
          break;
          case 'OUTSIDE_ASSISTANT':
            name='临床协调员（外部）'
          break;          
          }
          return name
        }
      },
      {
        title: '会员等级',
        width:130,
        render:(text,record)=> record.memberLevelType.memberLevelTypeName      
      },      
      {
        title: '积分条件',
        width:160,
        render: (text,record,index) => {
          return(
            record.geIntegral && record.leIntegral ? `${record.geIntegral} <= 积分数 <= ${record.leIntegral}` :
            !record.geIntegral && record.leIntegral ? `积分数 <= ${record.leIntegral}` : record.geIntegral==0 && !record.leIntegral ? `积分数 >= ${record.geIntegral}` :`积分数 >= ${record.geIntegral}`
          )
        }
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
            id:d.ruleMemberLevelId,
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
          order:{value:{geIntegral:detail.geIntegral,leIntegral:detail.leIntegral}},
          memberLevelTypeId:{value:detail.memberLevelType && detail.memberLevelType.memberLevelTypeId+''},
          memberTypeId:{value:detail.memberType && detail.memberType.memberTypeId+''},
          type:{value:memberType},
          level:{value:memberLevel}
        } : {
          type:{value:memberType},
          level:{value:memberLevel}
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
                title={isEdit ? '修改等级规则':'添加等级规则'}
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
