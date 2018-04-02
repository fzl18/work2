import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config} from '../common/config';
import {command} from '../common/global';
const FormItem = Form.Item;
const { Option } = Select;
const { InputGroup  } = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
  handleSelect=(v)=>{
    const {setFieldsValue} = this.props.form
    setFieldsValue({conditionSign:v})
  }
  render(){
      const {getFieldDecorator,getFieldValue,setFieldsValue}=this.props.form
      const formItemLayout = config.formItemLayout  
      const submitFormLayout = config.submitFormLayout
      getFieldDecorator('conditionSign')      
      const conditionSign = getFieldValue('conditionSign') || 'gt'
      return(
          <div>
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label={"服务人员类型"}
            >
              {getFieldDecorator('serviceStaffTypeName', {
                rules: [{
                  required: true, message: '请输入服务人员类型',
                }],
              })(
                <Input placeholder="请输入服务人员类型" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={"临床工作经验"}
            >
                  <Select onChange={this.handleSelect} defaultValue={conditionSign} style={{width:50,marginRight:5}}>
                    <Option value="gt">&#62;</Option>
                    <Option value="ge">&#62;&#61;</Option>
                    <Option value="lt">&#60;</Option>
                    <Option value="le">&#60;&#61;</Option>
                  </Select>
              {getFieldDecorator('conditionDays', {
                rules: [{
                  required: true,
                  message:'请输入临床工作经验天数'
                }],
              })(                
                                  
                  <InputNumber min={0} precision={0} placeholder="请输入" /> 
              )}天
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
              {this.props.isEdit ? '保存':'添加'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView}>取消</Button>
            </FormItem>
          </Form>
         </div>        
      )
  }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="服务人员类型">
                {getFieldDecorator('serviceStaffTypeName')(
                    <Input placeholder="请输入服务人员类型" />
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
                <Button icon="plus" type="primary" onClick={this.props.create} style={{marginLeft:17}}>添加</Button>
            </Form>
        )
    }
}

export default class Staff extends Component {
state = {
    loading:false,
    pagination:{
        pageSize: config.pageSize,
        current: 1,
    },
    listData:[],
    detail:'',
    modalVisible: false,
    selectedRows: [],
    searchFormValues: {},
    isEdit:false,
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  loadListData = (params={}) => {
    const {pagination}=this.state
    this.setState({
      loading: true,
    });
    command.api({
      url:API_URL.serive.queryStaffType,
      pagination,
      params,
    },data => {
      if(!data.error){
        const listData = data.datas || data.data;
        pagination.total = data.totalCount
        this.setState({
            loading: false,
            listData,
            pagination,
        })
      }else{
        this.setState({loading: false})
        Modal.error({ title: data.error || datas.error})
      }
    })
  }

  del=(params={})=>{
    command.api({
      url:API_URL.serive.deleteStaffType,
      params,
    },data =>{
      if(!data.error){
        notification['success']({
          message: data.success,
          description: '',
        })
        this.loadListData()
      }else{
        Modal.error({ title: data.error || datas.error})
      }
    })
  }
  edit=(params={})=>{
    command.api({
      url:API_URL.serive.queryStaffType,
      params,
    },data =>{
      if(!data.error){
        const detail = data.datas[0] || data.data[0];
        this.setState({
            detail,
            editId:params.serviceStaffTypeId,
        });
      }else{
        Modal.error({ title: data.error || datas.error})
      }
    })
  }
  save=(params={})=>{
    const {isEdit,editId}=this.state
    console.log(isEdit,editId)
    isEdit && Object.assign(params, {serviceStaffTypeId:editId})
    command.api({
      url:isEdit ? API_URL.serive.modifyStaffType : API_URL.serive.addStaffType,
      params,
    },data =>{
      if(!data.error){
        notification['success']({
          message: data.success,
          description: '',
        })
        this.modalView('modalVisible','close')
        this.loadListData()
      }else{
        Modal.error({ title: data.error || datas.error})
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        values.conditionSign = !values.conditionSign ? 'gt': values.conditionSign
        this.save(values)
      }
    });
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

  modalView = (modalName,isShow,type) => {    
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
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  }


  handleMenuClick = (e) => {

    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        // dispatch({
        //   type: 'rule/remove',
        //   payload: {
        //     no: selectedRows.map(row => row.no).join(','),
        //   },
        //   callback: () => {
        //     this.setState({
        //       selectedRows: [],
        //     });
        //   },
        // });
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
      fieldsValue.serviceParameterName = fieldsValue.serviceParameterName && fieldsValue.serviceParameterName.trim()
      this.setState({
        searchFormValues: fieldsValue,
        pagination
      },()=>{this.loadListData(fieldsValue)});
    });
  }


  // handleAddInput = (e) => {
  //   this.setState({
  //     addInputValue: e.target.value,
  //   });
  // }

  tabColumns = ()=>{
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60
      },
      {
        title: '服务人员类型',
        dataIndex: 'serviceStaffTypeName',
        width:300
      },
      {
        title: '条件设置',
        dataIndex: 'serviceParameterName',
        width:300,
        render:(text,record)=>{
          let key 
          switch(record.conditionSign){
            case 'lt' :
            key= '<'
            break;
            case 'le' :
            key= '<='
            break;
            case 'gt' :
            key= '>'
            break;
            case 'ge' :
            key= '>='
            break;
          }
          return(`临床试验经验${key}${record.conditionDays}天`)        
        }
      },
      {
        title: '操作',
        width:100,
        render:(text,record)=> 
          <div>
            <a href="javascript:;" onClick={()=>{this.modalView('modalVisible','open','edit'); this.edit({serviceStaffTypeId:record.id})}}>修改</a>
            <span className="ant-divider" />
            <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del({serviceStaffTypeId:record.id})}} okText="是" cancelText="否">
            <a href="javascript:;" >删除</a>
            </Popconfirm>
          </div>
      }
    ]
    return columns
  }
  tabDataSource = ()=>{
    const {listData,pagination}=this.state
    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.serviceStaffTypeId,
            ...d,
        }
        lists.push(list)
    })
    return lists
  }

  renderSearchForm() {
    const { selectedRows, searchFormValues } = this.state;
    const mapPropsToFields = () => ({ 
            serviceStaffTypeName:{value:searchFormValues.serviceStaffTypeName},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm create={()=>{this.modalView('modalVisible','open','new')}} handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
        </Row>
    );
  }

  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination,searchFormValues } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    }
    const mapPropsToFields = () => (        
      isEdit ?        
        { 
            serviceStaffTypeName:{value:detail.serviceStaffTypeName},
            conditionDays:{value:detail.conditionDays},
            conditionSign:{value:detail.conditionSign},
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
              dataSource={this.tabDataSource()}
              columns={this.tabColumns()}
              pagination={{...config.paginationProps, ...pagination}}
              onChange={this.handleTableChange}
              scroll={{y:this.tabDataSource().length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改服务人员类型':'添加服务人员类型'}
                visible={modalVisible}
                width={400}
                onOk={this.handleAdd}
                onCancel={()=>{this.modalView('modalVisible','close')}}
                footer={null}
            >
               <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} closeModalView={()=>{this.modalView('modalVisible','close')}} handleSubmit={this.handleSubmit}/>
            </Modal>
      </div>
    );
  }
}
