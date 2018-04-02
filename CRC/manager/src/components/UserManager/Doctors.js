import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Radio, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config} from '../common/config';
import  './style.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
  state ={
    hospital:[],
    hospitalId:'',
    department:[],
    departmentId:'',
    isPass:'true',
    picVisible:false,
    picUrl:'',
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
  radioChange =(e)=>{    
    this.setState({
      isPass:e.target.value
    })
  }
  componentWillMount(){
  }

  componentDidMount(){

  }

  render(){
      const {getFieldDecorator,getFieldValue}=this.props.form
      const {assistants} = this.props
      const {departmentId,isPass,picVisible,picUrl}=this.state
      const ydataAccountUserMobile = getFieldValue('ydataAccountUserMobile') || ''
      const ydataAccountCompellation = getFieldValue('ydataAccountCompellation') || ''
      const hospitalName = getFieldValue('hospitalName') || ''
      const departmentName = getFieldValue('departmentName') || ''
      const department = getFieldValue('department') || ''
      const doctorPosition = getFieldValue('doctorPosition') || ''
      const skilfulIllness = getFieldValue('skilfulIllness') || ''
      const certificate = getFieldValue('certificate') || ''
      const enterpriseName = getFieldValue('enterpriseName') || ''
      const position = getFieldValue('position') || ''
      const positiveSide = getFieldValue('positiveSide') || ''
      const reverseSide = getFieldValue('reverseSide') || ''

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
          sm: { span: 10, offset: 9 },
        },
      };
      return(
          <div className="doctorModle">
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label={"姓名"}
            >
              {ydataAccountCompellation}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="手机号"
            >
              {ydataAccountUserMobile}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={!assistants ? "所在医院" : '所在单位'}
            >
              {!assistants ? hospitalName : enterpriseName}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={!assistants ? "所在科室":"所在部门"}
            >
              { !assistants ? departmentName : department}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={!assistants ? "医生职称":"职位"}
            >
              {!assistants ? doctorPosition : position}
            </FormItem>
            {!assistants ?
            <FormItem
              {...formItemLayout}
              label={"擅长疾病"}
            >
              {skilfulIllness}
            </FormItem>
            : null }
            <FormItem
              {...formItemLayout}
              label={"相关证件"}
            >
              {!assistants ? <a href='javascript:;' onClick={()=>{this.setState({picVisible:true,picUrl:certificate})}}>{ certificate && '医师资格证'}</a> : <div> <a href='javascript:;' onClick={()=>{this.setState({picVisible:true,picUrl:positiveSide})}}>{positiveSide && '身份证正面'}</a> <a href='javascript:;' onClick={()=>{this.setState({picVisible:true,picUrl:reverseSide})}}>{reverseSide && '身份证反面'}</a></div>}
            </FormItem>
            <hr />
            <FormItem style={{ marginTop: 15 }}
              {...formItemLayout}
              label={"审核意见"}
            >
              {getFieldDecorator('passingSituation', {                  
                  rules: [{
                    required:true,message:'请选择审核意见'
                  }],
                })(
                  <RadioGroup onChange={this.radioChange}>
                    <Radio value='true'>通过</Radio>
                    <Radio value='false'>不通过</Radio>
                  </RadioGroup>
                )}
            </FormItem>
            {isPass =='false' ? <FormItem
              {...formItemLayout}
              label={"不通过原因"}
            >
              {getFieldDecorator('auditReason', {
                  rules: [{
                    // request:true,message:'请填写原因'
                  }],
                })(
                  <TextArea rows={4} />
                )}
            </FormItem> :null }
            
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">确定</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.props.changeModalView.bind(this,'modalVisible','close')}>取消</Button>
            </FormItem>
          </Form>
          <Modal
                title={'证件图片'}
                visible={picVisible}
                width={400}
                onCancel={()=>{this.setState({picVisible:false})}}
                footer={null}
            >
               <div style={{textAlign:'center'}}>
                 <img src= {picUrl} width='100%'/>
               </div>
            </Modal>
         </div>
        
      )
  }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        const {assistants} = this.props
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="姓名">
                {getFieldDecorator('ydataAccountCompellation')(
                    <Input placeholder="请输入姓名" />
                )}
                </FormItem>
                <FormItem label="手机号">
                {getFieldDecorator('ydataAccountUserMobile')(
                    <Input placeholder="请输入手机号" />
                )}
                </FormItem>
                <FormItem label= {!assistants ? "所在医院" :"所在单位"} >
                {getFieldDecorator(!assistants ? 'hospitalName':'enterpriseName')(
                    <Input placeholder={!assistants ? "请输入所在医院": "请输入所在单位"}/>
                )}
                </FormItem>
                <FormItem label={!assistants ?"所在科室":"所在部门"}>
                {getFieldDecorator(!assistants ? 'departmentName' : 'department')(
                    <Input placeholder={!assistants ?"请输入所在科室":"请输入所在部门" }/>
                )}
                </FormItem>
                <FormItem label={!assistants ? "医生职称":"职位"}>
                {getFieldDecorator(!assistants ?'doctorPosition':'position')(
                    <Input placeholder={!assistants ?"请输入医生职称":"请输入职位" }/>
                )}
                </FormItem>
                <FormItem label="审核状态">
                {getFieldDecorator('audit')(
                  <Select allowClear style={{width:120}} placeholder="请选择">
                    <Option value="audit_pending">待审核</Option>
                    <Option value="audit_passed">审核通过</Option>
                    <Option value="audit_failed">未通过</Option>
                  </Select>
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
                {/* <Button icon="plus" type="primary" style={{float:'right'}} onClick={()=>{this.props.changeModalView('modalVisible','open','new')}}>添加</Button> */}
                <Button icon="search" type="primary" htmlType="submit" style={{marginRight:10}}>搜索</Button>
            </Form>
        );
    }
}

export default class Doctors extends Component {
state = {
    loading:false,
    historyLoading:false,
    pagination:{
        pageSize: config.pageSize,
        current: 1,
    },
    listData:[],
    detail:'',
    addInputValue: '',
    modalVisible: false,
    historyVisible: false,
    selectedRows: [],
    searchFormValues: {},
    isEdit:false,
    selectedRowKeys: [],
    totalCallNo: 0,
    assistants:this.props.assistants || false,
    name:'',
    AuditHistory:[]
  }

  loadListData = (params) => {
    const {pagination,assistants,searchFormValues}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: assistants ? API_URL.serive.queryNonDoctors : API_URL.serive.queryDoctors,
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

  selectAuditHistoryByAcctId = (params) => {
    const {assistants}=this.state
    this.setState({
      historyLoading: true,
    });
    const options ={
        method: 'POST',
        url: assistants ? API_URL.serive.selectAuditHistoryByAcctId : API_URL.serive.selectAuditHistoryByAcctId,
        data: {
            offset: 1,
            limit: 999,
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const AuditHistory = data.datas || data.data;
                this.setState({
                    historyLoading: false,
                    AuditHistory: AuditHistory ? AuditHistory :[],
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
    url = isEdit ? API_URL.serive.auditDoctorPass :  API_URL.serive.auditDoctorPass    
    const options ={
        method: 'POST',
        url: url,
        data: {
            ...params,
            acctId:isEdit ? editId : null,
            auditAcctId: sessionStorage.auditAcctId || 10
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
        url: assistants ? API_URL.serive.queryNonDoctors : API_URL.serive.queryDoctors,
        data: {
            offset: 1,
            limit: 1,
            acctId:id,
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
      },
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
    const { selectedRows, searchFormValues,assistants } = this.state;
    const mapPropsToFields = () => ({ 
            ydataAccountCompellation:{value:searchFormValues.ydataAccountCompellation},
            ydataAccountUserMobile:{value:searchFormValues.ydataAccountUserMobile},
            auditStatus:{value:searchFormValues.auditStatus},
            departmentName:{value:searchFormValues.departmentName},
            department:{value:searchFormValues.department},
            hospitalName:{value:searchFormValues.hospitalName},
            doctorPosition:{value:searchFormValues.doctorPosition},
            audit:{value:searchFormValues.audit},
            bindStatus:{value:searchFormValues.bindStatus},
            position:{value:searchFormValues.position || ''},
            enterpriseName:{value:searchFormValues.enterpriseName || ''},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm assistants={assistants} changeModalView={this.changeModalView} handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
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
    const {loading, historyLoading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, historyVisible, pagination, assistants, name,AuditHistory } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
      },
      {
        title: '姓名',
        dataIndex: 'ydataAccountCompellation',
        width:80,
      },
      {
        title: '手机号码',
        dataIndex: 'ydataAccountUserMobile',
        width:100,        
      },      
      {
        title: !assistants ? '所在医院' : '所在单位',
        dataIndex: !assistants ? 'hospitalName' : 'enterpriseName', 
        width:150,
      },
      {
        title: !assistants ? '所在科室':'所在部门',
        dataIndex: !assistants ? 'departmentName' : 'department', 
        width:150,
      },
      {
        title: !assistants ? '医生职称':'职位',
        dataIndex: !assistants ? 'doctorPosition':'position', 
        width:150,
      },  
      {
        title: '注册时间',
        dataIndex: 'createTime', 
        width:150,
        render:(text,react)=> moment(react.createTime).format('YYYY-MM-DD')
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus', 
        width:150,
        render:(text,react)=> react.auditStatus =='audit_pending' ? '待审核' : react.auditStatus =='audit_passed' ? '审核通过': react.auditStatus =='audit_failed' ? '未通过' : null
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
        title: '操作',
        width:100,
        render: (text,record,index) => (
          <div>
            {record.auditStatus == 'audit_pending' ?  
              <a href="javascript:;" onClick={()=>{this.changeModalView('modalVisible','open','edit');this.edit(record.ydataAccountId)}}>审核</a>
              :null
            }
            <span className="ant-divider" />
            <a href="javascript:;" onClick={()=>{this.changeModalView('historyVisible','open');this.setState({name:record.ydataAccountCompellation},()=>{this.selectAuditHistoryByAcctId({acctId:record.ydataAccountId})})}}>审核历史</a>            
          </div>
        ),
      },
    ];
    const skilfulIllness = {
      title: '擅长疾病',
      dataIndex: 'skilfulIllness', 
      width:150,
    }
    !assistants && columns.splice(5,0,skilfulIllness)
    
    const columnsHistory = [
      {
        title: '提交时间',
        dataIndex: 'submissionTime',
        width:150,
      },
      {
        title: '审核时间',
        dataIndex: 'auditTime',
        width:150,
      },
      {
        title: '审核员',
        dataIndex: 'auditName',
        width:100,        
      },
      {
        title: '审核结果',
        dataIndex: 'auditStatus',
        width:100,
        render:(text,react)=> react.auditStatus =='audit_passed' ? '审核通过': react.auditStatus =='audit_failed' ? '未通过' : null        
      },
      {
        title: '审核不通过原因',
        dataIndex: 'auditReason',
        width:120,        
      }
    ]
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
    const listsHistory = []
    AuditHistory.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            uuid:i,
            id:d.ydataAccountId,
            ...d,
        }
        listsHistory.push(list)
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
          certificate:{value:detail.certificateUrl},
          ydataAccountUserMobile:{value:detail.ydataAccountUserMobile},
          ydataAccountCompellation:{value:detail.ydataAccountCompellation},
          hospitalName:{value:detail.hospitalName},
          departmentName:{value:detail.departmentName},
          department:{value:detail.department},
          doctorPosition:{value:detail.doctorPosition},
          skilfulIllness:{value:detail.skilfulIllness},
          position:{value:detail.position || ''},
          enterpriseName:{value:detail.enterpriseName || ''},
          positiveSide:{value:detail.positiveSideUrl || ''},
          reverseSide:{value:detail.reverseSideUrl || ''},
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
                title={!assistants ? '审核医生' : '审核非医生'}
                visible={modalVisible}
                width={500}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} assistants={assistants} changeModalView={this.changeModalView}  handleSubmit={this.handleSubmit}/>
            </Modal>
            <Modal              
              wrapClassName='audit'
                title={'审核历史'}
                visible={historyVisible}
                width={620}
                onCancel={this.changeModalView.bind(this,'historyVisible','close')}
                footer={              
                  <Button type="primary" onClick={this.changeModalView.bind(this,'historyVisible','close')}>
                    关闭
                  </Button>}
            >
               <div style={{textAlign:'center'}}>
                 <h1>审核历史</h1>
                 <p>姓名：{name}</p>
               <Table
                loading={historyLoading}
                rowKey={(record,i) => i}
                dataSource={listsHistory}
                columns={columnsHistory}
                pagination={false}
                />
               </div>
            </Modal>
            
      </div>
    );
  }
}
