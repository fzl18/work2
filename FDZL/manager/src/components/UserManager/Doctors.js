import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config} from '../common/config';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
  state ={
    hospital:[],
    hospitalId:'',
    department:[],
    departmentId:'',
  }
  loadHospital = (params={})=>{
    const {assistants}=this.state
    const options ={
        method: 'POST',
        url: API_URL.common.queryHospital,
        data: {
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  hospital:data.hospital.data || data.hospital.datas
                })
            } else {
                Modal.error({ title: data.error});
            }            
        }
    }
    $.sendRequest(options)
  }

  loadDepartment =(params={})=>{
    const {assistants}=this.state
    const options ={
        method: 'POST',
        url: API_URL.common.listHospitalDepartment,
        data: {
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                  this.setState({
                    department:data.department.data || data.department.datas
                  })
            } else {
                Modal.error({ title: data.error});
            }            
        }
    }
    $.sendRequest(options)
  }

  handleSelectChange=(name,v)=>{
    const {hospitalId}=this.state
    const {setFieldsValue}=this.props.form
    if(name==='hospitalId'){
      this.loadDepartment({'hospitalId':v})
      if(hospitalId !== v){
        this.setState({
          departmentId : ''
        })
        setFieldsValue({hospitalDepartmentId:''})
      }      
    } 
    this.setState({
      [name]:v,
    })
  }
  
  componentWillMount(){
    this.loadHospital()
  }

  componentDidMount(){
    const {getFieldDecorator,getFieldValue}=this.props.form
    const departmentId = getFieldValue('hospitalId')
    
    if(departmentId && departmentId !='undefined' && departmentId !='null' ){
      this.loadDepartment({'hospitalId':departmentId})
    }
  }

  render(){
      const {getFieldDecorator,getFieldValue}=this.props.form
      const {assistants} = this.props
      const {hospital,department,departmentId}=this.state
      // const hospitalName = getFieldValue('hospitalName') || ''
      // const departmentLocalName = getFieldValue('departmentLocalName') || ''
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
      };
  
      const submitFormLayout = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 10, offset: 7 },
        },
      };
      const hoptions = hospital.length >0 ? hospital.map((v,i)=><Option key={i} value={`${v.hospitalId}`}>{v.hospitalName}</Option> ):null
      const doptions = department.length >0 ? department.map(v=><Option key={v.hospitalDepartmentId}  value={`${v.hospitalDepartmentId}`}>{v.departmentLocalName}</Option> ) : null
      return(
          <div>
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label={assistants?"医学助理姓名":"医生姓名"}
            >
              {getFieldDecorator('userCompellation', {
                rules: [{
                  required: true, message: '请输入姓名',
                  whitespace:true
                }],
              })(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="手机号"
            >
              {getFieldDecorator('userMobile', {
                rules: [{
                  required: true, message: '请输入11位正确的手机号',
                  whitespace:true,
                  pattern:/^1[0-9][0-9]\d{8}$/,
                }],
              })(
                <Input placeholder="请输入手机号" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={assistants ? "单位":"医院"}
            >
              {getFieldDecorator('hospitalId', {
                rules: [{
                  required: false, message: '请选择',
                }],
              })(
                <Select placeholder="请选择" onChange={this.handleSelectChange.bind(this,'hospitalId')}>
                  {hoptions}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={assistants ? "部门" : "科室"}
            >
              {getFieldDecorator('hospitalDepartmentId', {
                rules: [{
                  required: false, message: '请选择',
                }],
              })(
                <Select placeholder="请选择" onChange={this.handleSelectChange.bind(this,'departmentId')}>
                  {doptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
              {this.props.isEdit ? '保存':'添加'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.props.changeModalView.bind(this,'modalVisible','close')}>取消</Button>
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
                <FormItem label="姓名">
                {getFieldDecorator('userCompellation')(
                    <Input placeholder="请输入姓名" />
                )}
                </FormItem>
                <FormItem label="手机号">
                {getFieldDecorator('userMobile')(
                    <Input placeholder="请输入手机号" />
                )}
                </FormItem>
                <FormItem label="绑定状态">
                {getFieldDecorator('bindStatus')(
                    <Select allowClear style={{width:120}} placeholder="请选择">
                        <Option value="ACTIVE">已绑定</Option>
                        <Option value="INACTIVE">已解绑</Option>
                        <Option value="NOACTIVE">未绑定</Option>
                    </Select>
                )}
                </FormItem>
                <Button icon="plus" type="primary" style={{float:'right'}} onClick={()=>{this.props.changeModalView('modalVisible','open','new')}}>添加</Button>
                <Button icon="search" type="primary" htmlType="submit" style={{marginRight:10}}>搜索</Button>
            </Form>
        );
    }
}

export default class Doctors extends Component {
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
    assistants:this.props.assistants || false
  }

  loadListData = (params) => {
    const {pagination,assistants}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: assistants ? API_URL.usermanager.queryAssistantByHospitalDepartmentId : API_URL.usermanager.queryDoctorByHospitalDepartmentId,
        data: {
            offset: pagination.current || 1,
            limit: pagination.pageSize,
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
    console.log(this.state.assistants)
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
      fieldsValue.userCompellation = fieldsValue.userCompellation && fieldsValue.userCompellation.trim()
      fieldsValue.userMobile = fieldsValue.userMobile && fieldsValue.userMobile.trim()
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => { 
      if (!err) {
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId,assistants,searchFormValues}=this.state
    let url = ''
    if(assistants){
      url = isEdit ? API_URL.usermanager.modifyAssisantByHospitalDepartmentId :  API_URL.usermanager.addAssisantByHospitalDepartmentId
    }else{
      url = isEdit ? API_URL.usermanager.modifyDoctorByHospitalDepartmentId :  API_URL.usermanager.addDoctorByHospitalDepartmentId
    }
    const options ={
        method: 'POST',
        url: url,
        data: {
            ...params,
            ydataAccountId:isEdit ? editId : null,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                notification['success']({
                    message: data.success,
                    description: '',
                  })
                this.changeModalView('modalVisible','close')
                this.loadListData(searchFormValues)
            } else {
                Modal.error({ title: data.error});
            }            
        }
    }
    $.sendRequest(options)
  }

  edit=(id)=>{
    const {assistants}=this.state
    const options ={
        method: 'POST',
        url: assistants ? API_URL.usermanager.queryAssistantByHospitalDepartmentId : API_URL.usermanager.queryDoctorByHospitalDepartmentId,
        data: {
            offset: 1,
            limit: 1,
            ydataAccountId:id,
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
    const {assistants}=this.state
    const options ={
        method: 'POST',
        url: assistants ? API_URL.usermanager.removeAssisantByHospitalDepartmentId : API_URL.usermanager.removeDoctorByHospitalDepartmentId,
        data: {
          ydataAccountId:id,
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


  resetUserPassword=(id)=>{
    const options ={
      method: 'POST',
      url: API_URL.usermanager.resetUserPassword,
      data: {
          ydataAccountId:id,
      },
      dataType: 'json',
      doneResult: data => {
          if (!data.error) {
              notification['success']({
                  message: '重置密码成功！',
                  description: `初始密码为：${data.password}`,
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

  renderSearchForm() {
    const { selectedRows, searchFormValues } = this.state;
    const mapPropsToFields = () => ({ 
            userCompellation:{value:searchFormValues.userCompellation},
            userMobile:{value:searchFormValues.userMobile},
            bindStatus:{value:searchFormValues.bindStatus},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm changeModalView={this.changeModalView} handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
        </Row>
    );
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
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination, assistants } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
      },
      {
        title: '姓名',
        dataIndex: 'userCompellation',
        width:80,
      },
      {
        title: '手机号码',
        dataIndex: 'userMobile',
        width:100,        
      },      
      {
        title: '单位',
        dataIndex: 'hospitalName', 
        width:150,
      },
      {
        title: '部门科室',
        dataIndex: 'departmentLocalName', 
        width:150,
      },
      {
        title: '微信号',
        dataIndex: 'openId', 
        width:80,
      },
      {
        title: '微信昵称',
        dataIndex: 'nickName',
        width:60,
      },
      {
        title: '绑定状态',
        dataIndex: 'bindStatus',
        width:60,
        render:(text,react)=>
        react.bindStatus =='NOACTIVE' ? "未绑定": react.bindStatus == "INACTIVE" ? "已解绑" : react.bindStatus == "ACTIVE" ? "已绑定" : "未绑定"
      },
      {
        title: '最近一次绑定时间',
        dataIndex: 'lastBindTime', 
        width:130,
        sorter: true,
      },
      {
        title: '操作',
        width:100,
        render: (text,record,index) => (
          <div>
            <Popconfirm title="确定要重置密码吗？" onConfirm={()=>{this.resetUserPassword(record.id)}} okText="是" cancelText="否">
            <a href="javascript:;">重置密码</a>
            </Popconfirm>
            <span className="ant-divider" />
            <a href="javascript:;" onClick={()=>{this.changeModalView('modalVisible','open','edit',()=>{ this.edit(record.id) })}}>修改</a>
            <br />
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
            uuid:i,
            id:d.ydataAccountId,
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
            userMobile:{value:detail.userMobile},
            userCompellation:{value:detail.userCompellation},
            hospitalId:{value:detail.hospitalId ? `${detail.hospitalId}`:''},
            hospitalName:{value:detail.hospitalName},
            hospitalDepartmentId:{value: detail.hospitalDepartmentId ? `${detail.hospitalDepartmentId}` :''},
            departmentLocalName:{value:detail.departmentLocalName},
        } : null
      ) 
    FormBox=Form.create({mapPropsToFields})(FormBox)
    let title
    if(assistants){
      title = isEdit ? '修改医学助理':'添加医学助理'
    }else{
      title = isEdit ? '修改医生':'添加医生'
    }
    return (
      <div>
            <div>
              {this.renderSearchForm()}
            </div>
            <Table
              loading={loading}
              rowKey={record => record.uuid}
            //   rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={title}
                visible={modalVisible}
                width={500}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} assistants={assistants} changeModalView={this.changeModalView}  handleSubmit={this.handleSubmit}/>
            </Modal>
      </div>
    );
  }
}
