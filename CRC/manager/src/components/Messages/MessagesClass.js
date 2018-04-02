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
      if(order && order.leIntegral && order.geIntegral){        
        callback()
        return
      }else if(!order || !order.leIntegral || !order.geIntegral){
        callback('请输入积分！')
        return
      }
      callback('请输入积分！')
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
        return(            
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="留言分类">
            {getFieldDecorator('messageTypeName',{
                rules: [{
                  required: true,
                  message: '请输入留言分类',
                }],
              })(
                <Input placeholder='请输入' /> 
            )} 
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              确定
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
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="留言分类">
                {getFieldDecorator('messageTypeName')(
                    <Input placeholder='请输入' />
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
                <Button icon="plus" type="primary" onClick={this.props.create} style={{marginLeft:17}}>添加</Button>
            </Form>
        );
    }
}

export default class MessagesClass extends Component {
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
        url: API_URL.serive.queryMessageType,
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
      fieldsValue.messageTypeName = fieldsValue.messageTypeName && fieldsValue.messageTypeName.trim()
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
    const { selectedRows, searchFormValues,memberLevel,memberType,city } = this.state;
    const mapPropsToFields = () => ({ 
            messageTypeName:{value:searchFormValues.messageTypeName},
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
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.serive.modifyMessageType : API_URL.serive.addMessageType,
        data: {
            ...params,
            messageTypeId:isEdit ? editId : null,
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
        url: API_URL.serive.queryMessageType,
        data: {
            offset: 1,
            limit: 1,
            messageTypeId:id,
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
        url: API_URL.serive.deleteMessageType,
        data: {
            offset: 1,
            limit: 1,
            messageTypeId:id,
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
    const {loading, listData, detail, selectedRows, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination,memberLevel,memberType,city } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60
      },
      {
        title: '留言分类',
        width:300,
        dataIndex: 'messageTypeName',
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
            id:d.messageTypeId,
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
          messageTypeName:{value:detail.messageTypeName},
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
              // rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改留言分类':'添加留言分类'}
                visible={modalVisible}
                width={400}
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
